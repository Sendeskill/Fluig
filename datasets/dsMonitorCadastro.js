function defineStructure() {

}
function onSync(lastSyncDate) {

}

//Aparentemente os códigos AJAX sempre caem aqui e as funções são chamadas
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

    if (options['_action'] == 'saveOrUpdate')
		return saveOrUpdate(options);
	else if (options['_action'] == 'createMonitorCadastro')
		return createMonitorCadastro(options);
	else
    	return selectMonitorCadastro(options);
}

//Aqui busca as linhas para o monitor
//AQUI ESTÁ DANDO ERRO!
function selectMonitorCadastro(options) {
	var newDataset = DatasetBuilder.newDataset();
	
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');
	var created = false;
    
    var NumCooperativa = getContraintByFieldName(options['constraints'], 'NumCooperativa').initialValue;
    var NumPa          = getContraintByFieldName(options['constraints'], 'NumPa').initialValue;
    var NomeCliente    = getContraintByFieldName(options['constraints'], 'NomeCliente').initialValue;
    var Periodo1       = getContraintByFieldName(options['constraints'], 'Periodo1').initialValue;
    var Periodo2       = getContraintByFieldName(options['constraints'], 'Periodo2').initialValue;
    var statusSelect   = getContraintByFieldName(options['constraints'], 'statusSelect').initialValue;

	try {
		var conn = ds.getConnection();

        var filtro = new Array();
        if (NumCooperativa != "")
        	filtro.push("NumCooperativa = " + NumCooperativa);
        if (NumPa != "")
        	filtro.push("NumPa = " + NumPa);
        if (NomeCliente != "") 
            filtro.push("NomeCliente LIKE '%" + NomeCliente.replace(' ', '%') + "%'");
        if (Periodo1 != "" && Periodo2 != "")
            filtro.push("DataLimite >= " + Periodo1 + " AND DataLimite <= " + Periodo2);
        if (Periodo1 != "" && Periodo2 != "")
            filtro.push("DataLimite >= " + Periodo1 + " AND DataLimite <= " + Periodo2);
        
        //Verificar oq isso faz
        var myQuery = "SELECT TOP 50 * FROM [DataTransaction].[fluig].[MonitorCadastro] WHERE " + filtro.join(" AND ");
        // var myQuery = "SELECT TOP 50 * FROM [DataTransaction].[fluig].[MonitorCRL] WHERE " + filtro.join(" AND ");

        log.info("slq ==================> " + myQuery);
        
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
                if(null != obj)
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                else
                    Arr[i - 1] = "null";
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

//Aqui criam-se os processos
function createMonitorCadastro(options) {
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup('/jdbc/sicoob');

	var FLUIG_HOST = "http://fluig.zeroti.com.br:8280";
	// var FLUIG_HOST = "http://fluig.dev.unicoob.local";

	var data = getContraintByFieldName(options['constraints'], 'data').initialValue;

	data = JSON.parse(data);

    // // OAuth variables -> crossby
    // var OAUTH_APP_PUBLIC      = "sicoob";
    // var OAUTH_APP_PRIVATE     = "sicoob";
    // var OAUTH_USER_APP_PUBLIC = "627070e7-9241-4dc5-99c5-3d002d6e8a7e";
	// var OAUTH_USER_APP_SECRET = "025c1993-b9fc-4159-b2ad-5e3d8af1e8dca9d798b1-51d1-4d76-a588-4e1d74a8427a";

	//OAUTH ZEROTI
    var OAUTH_APP_PUBLIC      = "sicoob";
    var OAUTH_APP_PRIVATE     = "sicoob";
    var OAUTH_USER_APP_PUBLIC = "c47c337c-7fd2-411e-92d7-0058529c28f8";
	var OAUTH_USER_APP_SECRET = "26d00345-ba9b-4d3c-a275-bc9e876a6016ef8e6a3c-3372-4a3e-a893-782fc01bfb93";

	// var OAUTH_APP_PUBLIC      = "6aa69a8a-486b-4b0d-a9ae-a184a1408cf9";
    // var OAUTH_APP_PRIVATE     = "e86877e1-a2d0-414c-bb3b-000274e446d2-60b987de-7f98-4545-9d65-6017f853ce7d";
    // var OAUTH_USER_APP_PUBLIC = "b53e209c-c8f7-496e-b17d-72f54ff494cf";
	// var OAUTH_USER_APP_SECRET = "cd9865b7-fce2-4678-96ef-cb10f39af8b67b7a61a1-484d-482d-a124-17db0de77264";

    log.info('DATA ================ > ' + data.length);

	for (var i = 0; i < data.length; i++) {	
		var body = '';
		var vdata = data[i];

		body += '{';
			body += '"targetState": 0,';
			body += '"subProcessTargetState": 0,';
			body += '"comment": "Comentário",';
			body += '"formFields": {';
                body += '"nome": "' + vdata.NomeCliente + '",';
                body += '"chegada": "' + vdata.DataLimite + '",';
			body += '}';
		body += '}';

		var consumer = oauthUtil.getGenericConsumer(OAUTH_APP_PUBLIC, OAUTH_APP_PRIVATE, OAUTH_USER_APP_PUBLIC, OAUTH_USER_APP_SECRET);
		consumer.post(FLUIG_HOST + "/bpm/api/v1/processes/monitor_cadastro/start", body); 
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