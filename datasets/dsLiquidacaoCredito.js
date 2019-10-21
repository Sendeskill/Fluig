function createDataset(fields, constraints, sortFields) {
	var options = {};
	
	options['constraints'] = constraints;
    options['fields'] = fields;
	
    
    // Pega o ID da Cooperativa
    var dsCooperativaUsuario = DatasetFactory.getDataset("dsCooperativaUsuario", null, null, null);
    var cooperativaId = dsCooperativaUsuario.getValue(0, "cooperativaId");
    
    if (cooperativaId == null) {
    	var erro = dsCooperativaUsuario.getValue(0, "erro");
    	return datasetErro(erro);
    }
    
    options['cooperativaId'] = cooperativaId;

    options['_action'] = getContraintByFieldName(constraints, '_action').initialValue;
    
    // NÃO UTILIZAR TOKEN NO LADO DO USUÁRIO
    var token = "uBWF8A2K3xCv755sXoBH1qAmjOYzsghG";
    
    // Ações protegidas pelo token
    if (options['_action'] == 'adicionarImportados'
    	|| options['_action'] == 'removerImportados') {
    	var checkToken = getContraintByFieldName(constraints, '_token').initialValue;
    	
    	if (checkToken != token) {
    		return datasetErro('Ação não permitida');
    	}
    }
    
    if (options['_action']  == 'adicionarImportados'
    	|| options['_action'] == 'removerImportados') {
    	return adicionarRemoverImportados(options);
	} else if (options['_action'] == 'selectListaPA') {
		return selectListaPA(options);
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

function selectListaPA(options) {
	var newDataset = DatasetBuilder.newDataset();
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	var created = false;
	
	var myQuery = "SELECT NumPA FROM [DataTransaction].[fluig].[LiquidacaoCredito] WHERE NumCooperativa = ? GROUP BY NumPA ORDER BY NumPA";
	
	try {
		var conn = ds.getConnection();
		var stmt = conn.prepareStatement(myQuery);

        stmt.setInt(1, options['cooperativaId']);

        
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

function selectLiquidacaoCredito(options) {
	var newDataset = DatasetBuilder.newDataset();
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	var created = false;
	
	var myQuery = "SELECT TOP 200 * FROM [DataTransaction].[fluig].[LiquidacaoCredito] WHERE DataBaixa >= ? AND DataBaixa <= ?  AND NumCooperativa = ? AND Importado = ? AND NumPA = ?";
	
	try {
		var conn = ds.getConnection();
		var stmt = conn.prepareStatement(myQuery);

        stmt.setString(1, getContraintByFieldName(options['constraints'], 'data_inicio').initialValue);
        stmt.setString(2, getContraintByFieldName(options['constraints'], 'data_fim').initialValue);
        stmt.setInt(3, options['cooperativaId']);
        stmt.setBoolean(4, false);
        stmt.setInt(5, getContraintByFieldName(options['constraints'], 'num_pa').initialValue);
        
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
        
        if (options['_action']  == 'adicionarImportados') {
        	stmt.setBoolean(1, true);
            stmt.setTimestamp(2, java.sql.Timestamp.from(java.time.Instant.now()));
        } else if (options['_action'] == 'removerImportados') {
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