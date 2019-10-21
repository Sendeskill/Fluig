function afterTaskSave(colleagueId,nextSequenceId,userList){
	var CURRENT_USER = getValue('WKUser');
	var CURRENT_STATE = getValue("WKNumState");
	var CURRENT_NUM_PROCESS = getValue("WKNumProces");
	
	var mensagem = "";
	
	if (CURRENT_STATE == 12 ) {
		mensagem = 
			'<div style="font-weight: 600;color: #003641; border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
				'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + 'Aceito? ' + hAPI.getCardValue('aceite')  +'</span>'
			+ ' Parecer:  <span style="font-weight: 400; color: #003641; ">"'+  hAPI.getCardValue('parecer_manifest') + '"</span>'
		+ '</div>' ;
	}

	if (mensagem != "") {
		hAPI.setTaskComments(CURRENT_USER, CURRENT_NUM_PROCESS, 0, mensagem);
	}
}
