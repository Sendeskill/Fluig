function defineStructure() {
	addColumn("RETORNO");
	//setKey([ "RETORNO"]);
	addIndex([ "RETORNO" ]);
}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	
	var company  = parseInt(getValue("WKCompany"));
	//var user     = "gabrieln2009_00";
	var user     = "admfluig.unicoob";
	//var password = "teste@123";
	var password = "2X7roP03F8gvGr5";
	
	//CHAMADA DA FUNCAO
	var retorno = startProcess(company, user, password, dataset);
	//dataset.addRow([retorno]);
	
	//return dataset;
	return retorno;
}

function onMobileSync(user) {

}

function startProcess(company, user, password, dataset) {
	log.info("#### DATASET - dsConciliacaoNumerarioTrans ####");
	var descProcesso = "Conciliação de Numerário em Trânsito";
	try {
	    // Servico <url_fluig>/webdesk/ECMWorkflowEngineService?wsdl
	    // Busca o webservice cadastrado com o código "WorkflowEngineService"
	    var workflowEngineServiceProvider = ServiceManager.getServiceInstance("WorkflowEngineService");
	    var workflowEngineServiceLocator = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
	    var workflowEngineService = workflowEngineServiceLocator.getWorkflowEngineServicePort();
	    
	    // Cria o ProcessAttachmentDtoArray
	    var processAttachmentDtoArray = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");
	    
	    var processTaskAppointmentDtoArray = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");
	 
	    // Cria o ObjectFactory
	    var objectFactory = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.ObjectFactory");
	    
	    var colleaguesId = objectFactory.createStringArray();
	    
	    var retorno = executaSql();

	    for (var i = 0; i < retorno.rowsCount; i++) {
	    	var IDOPERACAOCAIXA = retorno.getValue(i, "IDOPERACAOCAIXA");
	    	IDOPERACAOCAIXA = (IDOPERACAOCAIXA <= 9 ? "0" + IDOPERACAOCAIXA : IDOPERACAOCAIXA);
	    	var numCoop    = retorno.getValue(i, "NUMINSTITUICAO");
	    	var nomCoop    = retorno.getValue(i, "SIGLAINSTITUICAO");
	    	var numPA      = retorno.getValue(i, "IDUNIDADEINST");
	    	var nomPA      = retorno.getValue(i, "NOMEUNIDADE");
	    	var numTerm    = retorno.getValue(i, "NUMTERMINAL");
	    	var numAute    = retorno.getValue(i, "NUMAUTENTICACAO");
	    	var codUsuAute = retorno.getValue(i, "IDUSUARIO");
	    	var nomUsuAute = retorno.getValue(i, "DESCNOMEUSUARIO");
	    	var usuAute    = "(" + codUsuAute + ") " + nomUsuAute;
	    	var codTesResp = retorno.getValue(i, "IDUSUARIOLIBERACAO");
	    	var nomTesResp = retorno.getValue(i, "TESOUREIRORESP");
	    	var tesResp    = "(" + codTesResp + ") " + nomTesResp;
	    	var ende       = retorno.getValue(i, "DESCENDERECO");
	    	var numEnde    = retorno.getValue(i, "DESCNUMERO");
	    	var compEnd    = retorno.getValue(i, "DESCCOMPLEMENTO");
	    	var bairro     = retorno.getValue(i, "NOMEBAIRRO");
	    	var cidade     = retorno.getValue(i, "NOMECIDADE");
	    	var estado     = retorno.getValue(i, "SIGLAUF");
	    	var cep        = retorno.getValue(i, "NUMCEP");
	    	var dtAuten    = retorno.getValue(i, "DATAHORALOG");
	    	var numOper    = retorno.getValue(i, "IDGRUPOOPCAIXA") + "/" + IDOPERACAOCAIXA + "-" + retorno.getValue(i, "IDTIPOHISTORICO");
	    	var nomOper    = retorno.getValue(i, "DESCHISTORICO");
	    	var vlOper     = retorno.getValue(i, "VALORAUTENTICADO");
	    	var observ     = retorno.getValue(i, "DESCCOMPLEMENTOTRANSACAO");
	    	
		    // Cria um String[][]
		    var cardData = objectFactory.createStringArrayArray();
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("numCooperativa");
		    cardDataArray.getItem().add(numCoop);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("nomeCooperativa");
		    cardDataArray.getItem().add(nomCoop);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("numPACooperativa");
		    cardDataArray.getItem().add(numPA);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("nomePACooperativa");
		    cardDataArray.getItem().add(nomPA);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("numTerminal");
		    cardDataArray.getItem().add(numTerm);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("numAutenticacao");
		    cardDataArray.getItem().add(numAute);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("usuarioAutenticacao");
		    cardDataArray.getItem().add(usuAute);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("codUsuarioAutenticacao");
		    cardDataArray.getItem().add(codUsuAute);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("nomUsuarioAutenticacao");
		    cardDataArray.getItem().add(nomUsuAute);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("tesoureiroResp");
		    cardDataArray.getItem().add(tesResp);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("codTesoureiroResp");
		    cardDataArray.getItem().add(codTesResp);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("nomTesoureiroResp");
		    cardDataArray.getItem().add(nomTesResp);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("enderecoPA");
		    cardDataArray.getItem().add(ende);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("endNumPA");
		    cardDataArray.getItem().add(numEnde);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("endComplPA");
		    cardDataArray.getItem().add(compEnd);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("endBairroPA");
		    cardDataArray.getItem().add(bairro);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("endCidadePA");
		    cardDataArray.getItem().add(cidade);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("endEstadoPA");
		    cardDataArray.getItem().add(estado);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("endCepPA");
		    cardDataArray.getItem().add(cep);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("dtAutenticacao");
		    cardDataArray.getItem().add(dtAuten);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("numOperacao");
		    cardDataArray.getItem().add(numOper);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("nomeOperacao");
		    cardDataArray.getItem().add(nomOper);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("valorOperacao");
		    cardDataArray.getItem().add(vlOper);
		    cardData.getItem().add(cardDataArray);
		    
		    var cardDataArray = objectFactory.createStringArray();
		    cardDataArray.getItem().add("observacao");
		    cardDataArray.getItem().add(observ);
		    cardData.getItem().add(cardDataArray);

	    	result = workflowEngineService.startProcess(user, password, company, "conciliaNumerario", 0, colleaguesId, "Rotina iniciada automaticamente", "gabrieln2009_00", true, processAttachmentDtoArray, cardData, processTaskAppointmentDtoArray, false);
	    	
		    if (result.getItem().size() > 1) {
		    	//return "Processo " + descProcesso + " de número " + result.getItem().get(5).getItem().get(1) + " startado dom sucesso!";
		    	dataset.addRow(["Processo " + descProcesso + " de número " + result.getItem().get(5).getItem().get(1) + " startado dom sucesso!"]);
		    } else {
		    	//return result.getItem().get(0).getItem().get(0) + ": " + result.getItem().get(0).getItem().get(1);
		    	dataset.addRow([result.getItem().get(0).getItem().get(0) + ": " + result.getItem().get(0).getItem().get(1)]);
		    }
	    }

	    // Cria uma solicitação
	    //
	    
	    //log.info("#### RESULT ####");
	    //log.dir(result);
	    //log.dir(result.getItem());
	    //log.dir(result.getItem().size());
	    //log.info("#### FIM - RESULT ####");
	    /*

	    */
	    /*
	    if (result.getItem().get(5).getItem().get(0).equals("iProcess") 
	    		&& result.getItem().get(5).getItem().get(0) != "") {
	    	return "Sincronização completada com sucesso!" ;
	    } else {
	    	return result.getItem().get(0).getItem().get(0) + ": " + result.getItem().get(0).getItem().get(1);
	    }
	    */
	    
	    return dataset;
	} catch (e) {
		log.error('###### Erro ao iniciar o processo. ' + e.message);
		return;
	}
}

function executaSql() {
	var sql = "";
	sql += "SELECT TOP 1 C.NUMINSTITUICAO, ";
	sql += "	   A.IDINSTITUICAO, ";
	sql += "       C.SIGLAINSTITUICAO, ";
	sql += "       A.IDUNIDADEINST, ";
	sql += "       D.NOMEUNIDADE, ";
	sql += "       A.NUMTERMINAL, ";
	sql += "       I.IDTIPOTERMINAL, ";
	sql += "       I.IDUSUARIO, ";
	sql += "       J.DESCNOMEUSUARIO, ";
	sql += "       I.IDUSUARIOLIBERACAO, ";
	sql += "       K.DESCNOMEUSUARIO 'TESOUREIRORESP', ";
	sql += "       A.NUMAUTENTICACAO, ";
	sql += "       A.IDGRUPOOPCAIXA, ";
	sql += "       A.IDOPERACAOCAIXA, ";
	sql += "       B.IDTIPOHISTORICO, ";
	sql += "       B.IDPRODUTO, ";
	sql += "       H.DESCHISTORICO, ";
	sql += "       A.VALORAUTENTICADO, ";
	sql += "       A.DATAHORALOG, ";
	sql += "       A.DATAPROCESSAMENTO, ";
	sql += "       E.DESCENDERECO, ";
	sql += "       E.DESCNUMERO, ";
	sql += "       E.DESCCOMPLEMENTO, ";
	sql += "       E.NOMEBAIRRO, ";
	sql += "       E.NOMECIDADE, ";
	sql += "       F.SIGLAUF, ";
	sql += "       E.NUMCEP, ";
	sql += "       A.DESCCOMPLEMENTOTRANSACAO ";
	sql += "  FROM tce.TERMINALLOG AS A ";
	sql += " INNER JOIN tce.TERMINALLOGDETALHADO AS B ";
	sql += "         ON B.IDINSTITUICAO = A.IDINSTITUICAO ";
	sql += "        AND B.IDUNIDADEINST = A.IDUNIDADEINST ";
	sql += "        AND B.DATAPROCESSAMENTO = A.DATAPROCESSAMENTO ";
	sql += "        AND B.NUMTERMINAL = A.NUMTERMINAL ";
	sql += "        AND B.NUMAUTENTICACAO = A.NUMAUTENTICACAO ";
	sql += "        AND B.IDGRUPOOPCAIXA = A.IDGRUPOOPCAIXA ";
	sql += "        AND B.IDOPERACAOCAIXA = A.IDOPERACAOCAIXA ";
	sql += "        AND B.IDPRODUTO = 13 ";
	sql += "        AND B.IDTIPOHISTORICO IN (290, 293, 346, 347) ";
	sql += " INNER JOIN tce.TERMINAL AS I ";
	sql += "         ON I.IDINSTITUICAO = B.IDINSTITUICAO ";
	sql += "        AND I.IDUNIDADEINST = B.IDUNIDADEINST ";
	sql += "        AND I.DATAPROCESSAMENTO = B.DATAPROCESSAMENTO ";
	sql += "        AND I.NUMTERMINAL = B.NUMTERMINAL ";
	sql += "        AND I.IDPRODUTO = B.IDPRODUTO ";
	sql += " INNER JOIN tce.USUARIO AS J ";
	sql += "         ON J.IDINSTITUICAO = A.IDINSTITUICAO ";
	sql += "        AND J.IDUSUARIO = I.IDUSUARIO ";
	sql += " INNER JOIN tce.USUARIO AS K ";
	sql += "         ON K.IDINSTITUICAO = A.IDINSTITUICAO ";
	sql += "        AND K.IDUSUARIO = I.IDUSUARIOLIBERACAO ";
	sql += " INNER JOIN tce.INSTITUICAO AS C ";
	sql += "         ON C.IDINSTITUICAO = A.IDINSTITUICAO ";
	sql += "        AND C.NUMINSTITUICAO <> '' ";
	sql += " INNER JOIN tce.UNIDADEINSTITUICAO AS D ";
	sql += "         ON D.IDINSTITUICAO = A.IDINSTITUICAO ";
	sql += "        AND D.IDUNIDADEINST = A.IDUNIDADEINST ";
	sql += " INNER JOIN tce.ENDERECOINSTITUICAO AS E ";
	sql += "         ON E.IDINSTITUICAO = A.IDINSTITUICAO ";
	sql += "        AND E.IDUNIDADEINST = A.IDUNIDADEINST ";
	sql += " INNER JOIN tce.LOCALIDADE AS F ";
	sql += "         ON F.IDLOCALIDADE = E.IDLOCALIDADE ";
	sql += " INNER JOIN tce.TIPOHISTORICO AS H ";
	sql += "         ON H.IDPRODUTO = B.IDPRODUTO ";
	sql += "        AND H.IDTIPOHISTORICO = B.IDTIPOHISTORICO ";
	sql += "  WHERE A.DATAPROCESSAMENTO = '2018-12-14' ";
	sql += "    AND A.IDGRUPOOPCAIXA = 92 ";
	sql += "    AND A.IDOPERACAOCAIXA IN (3, 4) ";
	//sql += "    AND A.IDINSTITUICAO = 510 ";
	//sql += "    AND A.IDINSTITUICAO IN (510, 511) ";
	sql += "    AND A.IDINSTITUICAO IN (676) ";
	sql += "    AND A.BOLESTORNO = 0 ";

	var servico = "DataStage";
	var fields = null;
	
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("select", sql, sql, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("servico", servico, servico, ConstraintType.MUST));
	
	var sortingFields = null;
	
	var retorno = DatasetFactory.getDataset("ds_sql", fields, constraints, sortingFields);
	
	//console.log("#### RETORNO ####");
	//console.dir(retorno.rowsCount);
	//console.dir(retorno);
	//console.log("==== FIM - RETORNO ====");
	
	return retorno;
	
}