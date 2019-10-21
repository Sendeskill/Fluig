function createDataset(fields, constraints, sortFields) {
	var options = {};
	
	options['constraints'] = constraints;
    options['fields'] = fields;
	
    
    var user = getValue("WKUser");
    
    options['cooperativaId'] = cooperativaId;

    options['action'] = getContraintByFieldName(constraints, '_action').initialValue;
    
    // NÃO UTILIZAR TOKEN NO LADO DO USUÁRIO
    var token = "uBWF8A2K3xCv755sXoBH1qAmjOYzsghG";
    
    // Ações protegidas pelo token
    if (options['action'] == 'adicionarImportados'
    	|| options['action'] == 'removerImportados') {
    	var checkToken = getContraintByFieldName(constraints, '_token').initialValue;
    	
    	if (checkToken != token) {
    		return datasetErro('Ação não permitida');
    	}
    }
    
    if (options['action']  == 'adicionarImportados'
    	|| options['action'] == 'removerImportados') {
    	return adicionarRemoverImportados(options);
    } else {
    	return selectLiquidacaoCredito(options);
    }
}

function datasetErro(message) {
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('erro');
	newDataset.addRow(new Array(message));
	return newDataset;
}

function getContraintByFieldName(constraints, name) {
	if(constraints != null && constraints.length > 0) {
		for (var i = 0; i < constraints.length; i++) {
    		if (constraints[i].fieldName == name) {
    			return constraints[i];
    		}
		}
    }
	
	return {
		fieldName: null,
		initialValue: null,
		finalValue: null,
		constraintType: null,
	};
}

function selectLiquidacaoCredito(options) {
	var newDataset = DatasetBuilder.newDataset();
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	var created = false;
	
	var myQuery = "SELECT TOP 50 * FROM [DataTransaction].[fluig].[LiquidacaoCredito] WHERE DataBaixa = ? AND NumCooperativa = ? AND Importado = ?";
	
	try {
		var conn = ds.getConnection();
        var stmt = conn.prepareStatement(myQuery);
        
        stmt.setString(1, '2019-07-04');
        stmt.setInt(2, options['cooperativaId']);
        stmt.setBoolean(3, false);
        
		var rs = stmt.executeQuery();
        var columnCount = rs.getMetaData().getColumnCount();
		 
		while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            
            var Arr = new Array();
            
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "null";
                }
            }
            
            newDataset.addRow(Arr);
        }

	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (rs != null) rs.close();
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
	}

	return newDataset;
}


function adicionarRemoverImportados(options) {
	var ids = getContraintByFieldName(options['constraints'], 'LiquidacaoCredito.Ids').initialValue;
	
	// Proteção banco de dados
	if (!/^\d+(,\d+)*$/.test(ids)) {
		return datasetErro('É permitido somente números separados por vírgulas');
	}
	
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('sucesso');
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	
	var myQuery = "UPDATE [DataTransaction].[fluig].[LiquidacaoCredito]"
						  + " SET Importado = ?, DataImportacao = ?"
						  + " WHERE NumCooperativa = ? AND Id IN (" + ids + ")";
	
	try {
		var conn = ds.getConnection();
        var stmt = conn.prepareStatement(myQuery);
        
        if (options['action']  == 'adicionarImportados') {
        	stmt.setBoolean(1, true);
            stmt.setTimestamp(2, java.sql.Timestamp.from(java.time.Instant.now()));
        } else if (options['action'] == 'removerImportados') {
        	stmt.setBoolean(1, false);
            stmt.setTimestamp(2, null);
        }
        
        stmt.setInt(3, options['cooperativaId']);
        
		var rs = stmt.executeQuery();
	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (rs != null) rs.close();
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
	}
	
	newDataset.addRow(new Array('Salvo com sucesso'));

	return newDataset;
}