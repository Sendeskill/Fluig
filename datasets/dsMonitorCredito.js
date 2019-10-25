function createDataset(fields, constraints, sortFields) {
	var options = {};
	options['constraints'] = constraints;
  options['fields']      = fields;
	
  // Pega o ID da Cooperativa
  var dsCooperativaUsuario = DatasetFactory.getDataset("dsCooperativaUsuario", null, null, null);
	var cooperativaId        = dsCooperativaUsuario.getValue(0, "cooperativaId");
    
	if (cooperativaId == null) {
		var erro = dsCooperativaUsuario.getValue(0, "erro");
		return datasetErro(erro);
	}

  options['_action'] = getContraintByFieldName(constraints, '_action').initialValue;
	
	if (options['_action'] == 'createMonitorCredito')
		return createMonitorCredito(options);
	else
    return selectMonitorCredito(options);
}

//Retona os dados para a tabela
function selectMonitorCredito(options) {
	var dataset = DatasetBuilder.newDataset();
	
	var NumCooperativa = getContraintByFieldName(options['constraints'], 'NumCooperativa').initialValue;
	var NumPa          = getContraintByFieldName(options['constraints'], 'NumPa').initialValue;
	var NomeCliente    = getContraintByFieldName(options['constraints'], 'NomeCliente').initialValue;
	var Periodo1       = getContraintByFieldName(options['constraints'], 'Periodo1').initialValue;
	var Periodo2       = getContraintByFieldName(options['constraints'], 'Periodo2').initialValue;
	var statusSelect   = getContraintByFieldName(options['constraints'], 'statusSelect').initialValue;

	dataset.addColumn("coop");
	dataset.addColumn("pa");
	dataset.addColumn("cod_cliente");
	dataset.addColumn("nome_cliente");
	dataset.addColumn("data");
	dataset.addColumn("data_ult");
  dataset.addColumn("status");
  dataset.addColumn("documento");
  
  dataset.addRow(["999","123","123","Junior Rodrigues","2018-12-11","2019-12-11","D","00979403995"]);
  dataset.addRow(["999","123","122","Lucas Karger","2018-12-11","2019-12-11","A","32415423000169"]);
  dataset.addRow(["999","321","124","Roberto Robes","2018-12-15","2019-12-15","D","00979403995"]);

	// try {
	// 	var conn = ds.getConnection();

  //       var filtro = new Array();
  //       if (NumCooperativa != "")
  //       	filtro.push("NumCooperativa = " + NumCooperativa);
  //       if (NumPa != "")
  //       	filtro.push("NumPa = " + NumPa);
  //       if (NomeCliente != "") 
  //           filtro.push("NomeCliente LIKE '%" + NomeCliente.replace(' ', '%') + "%'");
  //       if (Periodo1 != "" && Periodo2 != "")
  //           filtro.push("DataLimite >= " + Periodo1 + " AND DataLimite <= " + Periodo2);
  //       if (Periodo1 != "" && Periodo2 != "")
  //           filtro.push("DataLimite >= " + Periodo1 + " AND DataLimite <= " + Periodo2);
        
  //       //Verificar oq isso faz
  //       var myQuery = "SELECT TOP 50 * FROM [DataTransaction].[fluig].[MonitorCredito] WHERE " + filtro.join(" AND ");
  //       // var myQuery = "SELECT TOP 50 * FROM [DataTransaction].[fluig].[MonitorCRL] WHERE " + filtro.join(" AND ");

  //       log.info("slq ==================> " + myQuery);
        
  //       var stmt = conn.prepareStatement(myQuery);
      
	// 	var rs = stmt.executeQuery();
  //       var columnCount = rs.getMetaData().getColumnCount();
		 
	// 	while (rs.next()) {
  //           if (!created) {
  //               for (var i = 1; i <= columnCount; i++) {
  //                   newDataset.addColumn(rs.getMetaData().getColumnName(i));
  //               }
  //               created = true;
  //           }
            
  //           var Arr = new Array();
  //           for (var i = 1; i <= columnCount; i++) {
  //               var obj = rs.getObject(rs.getMetaData().getColumnName(i));
  //               if(null != obj)
  //                   Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
  //               else
  //                   Arr[i - 1] = "null";
  //           }
  //           newDataset.addRow(Arr);
  //       }
	// } catch (e) {
	// 	log.error("ERRO==============> " + e.message);
	// } finally {
	// 	if (rs != null) rs.close();
  //       if (stmt != null) stmt.close();
  //       if (conn != null) conn.close();
	// }

	return dataset;
}

// Aqui criam-se os processos
function createMonitorCredito(options) {
	var FLUIG_HOST = "http://fluig.teste.voxelz.com.br:80";

	var data = getContraintByFieldName(options['constraints'], 'data').initialValue;

	data = JSON.parse(data);

	//OAUTH LOCAL
  var OAUTH_APP_PUBLIC      = "key_FluigOauth";
  var OAUTH_APP_PRIVATE     = "secret_FluigOauth";
  var OAUTH_USER_APP_PUBLIC = "f5614b89-ea0a-4ad9-ace6-ec955c595ef2";
	var OAUTH_USER_APP_SECRET = "d8d26b64-2c40-44f5-b460-da36f90483b6cb50ad9d-1189-449b-a969-f2d2b0d02019";

	for (var i = 0; i < data.length; i++) {	
		var body = '';
		var vdata = data[i];

		body += '{';
			body += '"targetState": 0,';
			body += '"subProcessTargetState": 0,';
			body += '"comment": "",';
			body += '"targetAssignee": "00979403995",';
			body += '"formFields": {';
                body += '"nome": "' + vdata.nome_cliente + '",';
                body += '"chegada": "' + vdata.data + '"';
			body += '}';
		body += '}';

		var consumer = oauthUtil.getGenericConsumer(OAUTH_APP_PUBLIC, OAUTH_APP_PRIVATE, OAUTH_USER_APP_PUBLIC, OAUTH_USER_APP_SECRET);
		consumer.post(FLUIG_HOST + "/bpm/api/v1/processes/monitor_credito/start", body); 
	}
}

function datasetErro(message) {
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('erro');
	newDataset.addRow(new Array(message));
	return newDataset;
}

//Trata campos vazios
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