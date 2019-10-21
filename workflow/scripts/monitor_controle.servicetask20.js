function servicetask20() {
	var formData = new java.util.HashMap();
	var indexes = hAPI.getChildrenIndexes("monitor_controle_testes");
	var users = new java.util.ArrayList();
	   
	users.add('anderson4340_00');
	
	for (var i = 1; i <= indexes.length; i++) {
		var radio = hAPI.getCardValue('radio___' + i);

		var formData = new java.util.HashMap();
		
		log.info('### Aqui vai criar ###');
		log.info('Radio valor ' + radio);
		
		formData.put("CodigoM20", hAPI.getCardValue('CodigoM20___' + i));
		formData.put("Conformidade", radio);
		formData.put("NivelRisco", hAPI.getCardValue('NivelRisco___' + i));
		formData.put("Processo", hAPI.getCardValue('Processo___' + i));
		formData.put("LocalTeste", hAPI.getCardValue('LocalTeste___' + i));
		formData.put("Periodicidade", hAPI.getCardValue('Periodicidade___' + i));
		formData.put("Teste", hAPI.getCardValue('Teste___' + i));
		formData.put("ProcedimentosVerificacao", hAPI.getCardValue('ProcedimentosVerificacao___' + i));
		formData.put("evidencia", hAPI.getCardValue('evidencia___' + i));
		formData.put("nConformidade", hAPI.getCardValue('nConformidade___' + i));
		
		hAPI.startProcess('monitor_controle_sc', 0, users, "Solicitação iniciada automaticamente", true, formData, false);
		
    }
	
	return true;
}
