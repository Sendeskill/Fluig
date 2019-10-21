function servicetask28(attempt, message) {
	var formData = new java.util.HashMap();
	
	var FLUIG_HOST = "http://192.168.0.181:8585";
	
    // OAuth variables
    // var OAUTH_APP_PUBLIC = "sicoob";
    // var OAUTH_APP_PRIVATE = "sicoob";
    // var OAUTH_USER_APP_PUBLIC = "627070e7-9241-4dc5-99c5-3d002d6e8a7e";
	// var OAUTH_USER_APP_SECRET = "025c1993-b9fc-4159-b2ad-5e3d8af1e8dca9d798b1-51d1-4d76-a588-4e1d74a8427a";
	

	// var OAUTH_APP_PUBLIC = "6aa69a8a-486b-4b0d-a9ae-a184a1408cf9";
    // var OAUTH_APP_PRIVATE= "e86877e1-a2d0-414c-bb3b-000274e446d2-60b987de-7f98-4545-9d65-6017f853ce7d";
    // var OAUTH_USER_APP_PUBLIC = "b53e209c-c8f7-496e-b17d-72f54ff494cf";
    // var OAUTH_USER_APP_SECRET = "cd9865b7-fce2-4678-96ef-cb10f39af8b67b7a61a1-484d-482d-a124-17db0de77264";
	
	var cooperativa_atribuicao;

    if (hAPI.getCardValue('tratativa') == "Cooperativa") {
    	cooperativa_atribuicao = "Pool:Group:COOPERATIVA-" + hAPI.getCardValue('cooperativa');
    }

	var body = '';

	body += '{';
		body += '"targetState": 0,';
		body += '"subProcessTargetState": 0,';
		body += '"comment": "Teste comentário",';
		body += '"formFields": {';
			body += '"cooperativa_nome": "' + hAPI.getCardValue('cooperativa_nome') + '",';
			body += '"tratativa": "' + hAPI.getCardValue('tratativa') + '",';
			body += '"cooperativa": "' + hAPI.getCardValue('cooperativa') + '",';
			body += '"inconsistencia_data": "' + hAPI.getCardValue('inconsistencia_data') + '",';
			body += '"inconsistencia_valor": "' + hAPI.getCardValue('inconsistencia_valor') + '",';
			body += '"inconsistencia_descricao": "' + hAPI.getCardValue('inconsistencia_descricao') + '",';
			body += '"cooperativa_atribuicao": "' + cooperativa_atribuicao + '"';
		body += '}';
	body += '}';
    
  // try {
  // 
//    var consumer = oauthUtil.getGenericConsumer(OAUTH_APP_PUBLIC,OAUTH_APP_PRIVATE,OAUTH_USER_APP_PUBLIC,OAUTH_USER_APP_SECRET);
//	var data = consumer.post(FLUIG_HOST + "/bpm/api/v1/processes/" + hAPI.getCardValue('pendencia') + "/start", body);
  // } catch (e) {
  // 	throw "Erro ao criar processo try catch";
  // 	log.error("## Erro ao criar processo try catch");
  //     log.error(e);
  // }

   var users = new java.util.ArrayList();
   
   users.add('integrador');
   
   formData.put("cooperativa_nome", hAPI.getCardValue('cooperativa_nome'));
   formData.put("cooperativa", hAPI.getCardValue('cooperativa'));
   formData.put("inconsistencia_data", hAPI.getCardValue('inconsistencia_data'));
   formData.put("inconsistencia_valor", hAPI.getCardValue('inconsistencia_valor'));
   formData.put("inconsistencia_descricao", hAPI.getCardValue('inconsistencia_descricao'));
   formData.put("tratativa", hAPI.getCardValue('tratativa'));
   
   if (hAPI.getCardValue('tratativa') == "Cooperativa") {
   	formData.put("cooperativa_atribuicao", "Pool:Group:COOPERATIVA-" + hAPI.getCardValue('cooperativa'));
   }
   
   
   hAPI.startProcess(hAPI.getCardValue('pendencia'), 0, users, "Solicitação iniciada automaticamente", true, formData, false);
}
