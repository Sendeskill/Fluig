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

    options['_action'] = getContraintByFieldName(constraints, '_action').initialValue;

    if (options['_action'] == 'saveOrUpdate') {
		return saveOrUpdate(options);
	} else if (options['_action'] == 'createTaskList') {
		return createTaskList(options);
	} else if (options['_action'] == 'locais') {
		return locais(options);
	} else if (options['_action'] == 'apagar') {
		return apagar(options);
	} else {
    	return selectMonitorParametros(options);
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

function cooperadoGrc(Cooperativa, PA) {
	var newDataset = DatasetBuilder.newDataset();
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	var created = false;
	
	try {
		var conn = ds.getConnection();

		myQuery =  ' SELECT TOP 1 CC.*, IIF(CC.Dias > 365, \'Y\', \'N\') AS automatico FROM (SELECT CI.*, DATEDIFF(DAY, CI.DataRenda, CI.DataUltimaRenovacao) AS Dias';
		myQuery += ' FROM [DataTransaction].[fluig].[CadastroCooperadoGRC] AS CI) AS CC';
		myQuery += ' WHERE';
		myQuery += ' 	NumCooperativa = ?';
		myQuery += ' 	AND NumPA = ?';
		myQuery += ' ORDER BY CC.Dias DESC';

		var stmt = conn.prepareStatement(myQuery);
		
		stmt.setString(1, Cooperativa);
		stmt.setString(2, PA);

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
		log.error("ERRO delete ==============> " + e.message);
	} finally {
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
	}

	return newDataset;
}

function locais(options) {
	var newDataset = DatasetBuilder.newDataset();
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	var created = false;
		
	try {
		var conn = ds.getConnection();
		
		var myQuery = "SELECT Local FROM [DataTransaction].[fluig].[MonitorParametros] GROUP BY Local ORDER BY Local";
		var stmt = conn.prepareStatement(myQuery);
        
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

function selectMonitorParametros(options) {
	var newDataset = DatasetBuilder.newDataset();
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	var created = false;
	
	var local = getContraintByFieldName(options['constraints'], 'local').initialValue;
	
	try {
		var conn = ds.getConnection();
		var myQuery;
		var stmt;
		
		if (local) {
			myQuery = "SELECT * FROM [DataTransaction].[fluig].[MonitorParametros] WHERE Local = ? ORDER BY Id ASC";
			stmt = conn.prepareStatement(myQuery);
			stmt.setString(1, local);
		} else {
			myQuery = "SELECT * FROM [DataTransaction].[fluig].[MonitorParametros] ORDER BY Id ASC";
			stmt = conn.prepareStatement(myQuery);
		}
        
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

function createTaskList(options) {
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');

	var FLUIG_HOST = "http://192.168.0.181:8585";
	// var FLUIG_HOST = "http://fluig.dev.unicoob.local";

	var Cooperativa = getContraintByFieldName(options['constraints'], 'Cooperativa').initialValue;
	var PA = getContraintByFieldName(options['constraints'], 'PA').initialValue;
	var ano = getContraintByFieldName(options['constraints'], 'ano').initialValue;
	var local = getContraintByFieldName(options['constraints'], 'local').initialValue;
	
    // OAuth variables
     var OAUTH_APP_PUBLIC = "sicoob";
     var OAUTH_APP_PRIVATE = "sicoob";
     var OAUTH_USER_APP_PUBLIC = "627070e7-9241-4dc5-99c5-3d002d6e8a7e";
	 var OAUTH_USER_APP_SECRET = "025c1993-b9fc-4159-b2ad-5e3d8af1e8dca9d798b1-51d1-4d76-a588-4e1d74a8427a";


	//var OAUTH_APP_PUBLIC = "6aa69a8a-486b-4b0d-a9ae-a184a1408cf9";
    //var OAUTH_APP_PRIVATE = "e86877e1-a2d0-414c-bb3b-000274e446d2-60b987de-7f98-4545-9d65-6017f853ce7d";
    //var OAUTH_USER_APP_PUBLIC = "b53e209c-c8f7-496e-b17d-72f54ff494cf";
	//var OAUTH_USER_APP_SECRET = "cd9865b7-fce2-4678-96ef-cb10f39af8b67b7a61a1-484d-482d-a124-17db0de77264";

	try {
		var conn = ds.getConnection();
		var myQuery;
		var stmt;
		
		myQuery = "SELECT Id, CodigoM20, Processo, NivelRisco, Teste, Local, Periodicidade, ProcedimentosVerificacao FROM [DataTransaction].[fluig].[MonitorParametros] WHERE Local = ? ORDER BY Id ASC";
		stmt = conn.prepareStatement(myQuery);
		stmt.setString(1, local);
        
		var rs = stmt.executeQuery();
		 
		while (rs.next()) {

			var Id = rs.getObject(rs.getMetaData().getColumnName(1)).toString();
			var CodigoM20 = rs.getObject(rs.getMetaData().getColumnName(2)).toString();
			var Processo = rs.getObject(rs.getMetaData().getColumnName(3)).toString();
			var NivelRisco = rs.getObject(rs.getMetaData().getColumnName(4)).toString();
			var Teste = rs.getObject(rs.getMetaData().getColumnName(5)).toString();
			var Local = rs.getObject(rs.getMetaData().getColumnName(6)).toString();
			var Periodicidade = rs.getObject(rs.getMetaData().getColumnName(7)).toString();
			var ProcedimentosVerificacao = rs.getObject(rs.getMetaData().getColumnName(8)).toString();

			var totalEtapas = Math.round(12 / Periodicidade);

			var automatico = 'N';
			var conformidade = '';
			var nConformidade = '';
			
			log.info('========================> Executou ' + CodigoM20);
			
			if (CodigoM20 == '02.01.02') {
				log.info('========================> Executou automático aqui');
				var cooperadoGrc2 = cooperadoGrc(Cooperativa, PA);
				
				automatico = 'Y';
				conformidade = cooperadoGrc2.getValue(1, 'Conformidade');
				nConformidade = "ID Cliente Sisbr: " + cooperadoGrc2.getValue(0, 'IdClienteSisbr') + " - DescNomeCliente: " + cooperadoGrc2.getValue(0, 'DescNomeCliente');
			}
			

			for (var i = 1; i <= totalEtapas; i++) {
                var body = '';
				var etapa = i + '/' + totalEtapas;
				var periodo = '';
				
				if ( totalEtapas == 2 ){
					periodo = i + 'º Semestre de ' 
				}

				body += '{';
					body += '"targetState": 0,';
					body += '"subProcessTargetState": 0,';
					body += '"comment": "Teste comentário",';
					body += '"formFields": {';
						body += '"automatico": "' + automatico + '",';
						body += '"Conformidade": "' + conformidade + '",';
						body += '"nConformidade": "' + nConformidade + '",';
						body += '"Cooperativa": "' + Cooperativa + '",';
						body += '"PA": "' + PA + '",';
						body += '"ano": "' + ano + '",';
						body += '"periodo": "' + periodo + ano +'",';
						body += '"etapa": "' + etapa + '",';
						body += '"CodigoM20": "' + CodigoM20 + '",';
						body += '"Processo": "' + Processo + '",';
						body += '"NivelRisco": "' + NivelRisco + '",';
						body += '"Teste": "' + Teste + '",';
						body += '"LocalTeste": "' + Local + '",';
					
						body += '"ProcedimentosVerificacao": "' + ProcedimentosVerificacao + '"';
					body += '}';
				body += '}';

				var consumer = oauthUtil.getGenericConsumer(OAUTH_APP_PUBLIC, OAUTH_APP_PRIVATE, OAUTH_USER_APP_PUBLIC, OAUTH_USER_APP_SECRET);
				var data = consumer.post(FLUIG_HOST + "/bpm/api/v1/processes/monitor_controle/start", body);
			}	
        }

	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (rs != null) rs.close();
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
	}
}

function apagar(options) {
	var Id = getContraintByFieldName(options['constraints'], 'Id').initialValue;
	
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('sucesso');
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
		
	try {
		var conn = ds.getConnection();
		var myQuery = "DELETE FROM [DataTransaction].[fluig].[MonitorParametros] WHERE Id = ?";

        var stmt = conn.prepareStatement(myQuery);
        
        stmt.setString(1, Id);
		stmt.execute();
	} catch (e) {
		log.error("ERRO delete ==============> " + e.message);
	} finally {
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
	}
	
	newDataset.addRow(new Array('Removido com sucesso'));

	return newDataset;
}

function saveOrUpdate(options) {
	var data = JSON.parse(getContraintByFieldName(options['constraints'], 'data').initialValue);
	
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('sucesso');
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	
	log.error("DATAAAAA ==============> " + getContraintByFieldName(options['constraints'], 'data').initialValue);
	
	try {
		var conn = ds.getConnection();
		
		var myQuery;

		
		if (data['Id'] != -1) {
			myQuery = "UPDATE [DataTransaction].[fluig].[MonitorParametros]"
				  + " SET CodigoM20 = ?, Processo = ?, NivelRisco = ?,"
					  + " Teste = ?, Local = ?, Periodicidade = ?,"
					  + " ProcedimentosVerificacao = ? " 
				  + " WHERE Id = " + data['Id'];
			
		} else {
			myQuery = "INSERT INTO [DataTransaction].[fluig].[MonitorParametros] (Id, CodigoM20, "
			      + "Processo, NivelRisco, Teste, Local, Periodicidade, ProcedimentosVerificacao) "
			      + "VALUES "
			      + "((SELECT TOP 1 Id FROM [DataTransaction].[fluig].[MonitorParametros] ORDER BY Id DESC) + 1, "
			      + "?, ?, ?, ?, ?, ?, ?)";
		}
		
        var stmt = conn.prepareStatement(myQuery);
        
        stmt.setString(1, data['CodigoM20']);
        stmt.setString(2, data['Processo']);
        stmt.setString(3, data['NivelRisco']);
        stmt.setString(4, data['Teste']);
        stmt.setString(5, data['Local']);
        stmt.setInt(6, data['Periodicidade']);
        stmt.setString(7, data['ProcedimentosVerificacao']);
        
		stmt.execute();
	} catch (e) {
		log.error("ERRO saveOrUpdate ==============> " + e.message);
	} finally {
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
	}
	
	newDataset.addRow(new Array('Salvo com sucesso'));

	return newDataset;
}
