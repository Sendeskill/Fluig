function afterTaskSave(colleagueId,nextSequenceId,userList){
	var CURRENT_USER = getValue('WKUser');
	var CURRENT_STATE = getValue("WKNumState");
	var CURRENT_NUM_PROCESS = getValue("WKNumProces");
	
	var mensagem = "";
	
	if (CURRENT_STATE == 59 || CURRENT_STATE == 22 || CURRENT_STATE == 54 || CURRENT_STATE == 83) {
		mensagem = "Solução: " + hAPI.getCardValue('tratativa_solucao');
	}
	
	if (CURRENT_STATE == 18 || CURRENT_STATE == 53 || CURRENT_STATE == 43) {
		mensagem = "Análise: " + hAPI.getCardValue('tratativa_analise');
	}

	if (mensagem != "") {
		hAPI.setTaskComments(CURRENT_USER, CURRENT_NUM_PROCESS, 0, mensagem);
	}
}