function afterTaskSave(colleagueId,nextSequenceId,userList){
	var CURRENT_USER = getValue('WKUser');
	var CURRENT_STATE = getValue("WKNumState");
	var CURRENT_NUM_PROCESS = getValue("WKNumProces");
	
	var mensagem = "";
	
	if (CURRENT_STATE == 5 || CURRENT_STATE == 28 ) {
		if ( hAPI.getCardValue('a_gestor') == 'Acatado'){
			mensagem = 
				'<div style="font-weight: 600;color: #003641;border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
					'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + 'Análise do Gestor: ' + hAPI.getCardValue('a_gestor')  + ' - ' +
					"  Prazo para Regularização: " + hAPI.getCardValue('prazo_reg') + '</span>'
			+ ' Plano de Ação: <br> <span style="font-weight: 400; color: #003641; "> "' + hAPI.getCardValue('plano_acao') + '"</span>'
			+ '</div>';
		}else if ( hAPI.getCardValue('a_gestor') == 'Regularizado'){
			mensagem = 
				'<div style="font-weight: 600;color: #003641;border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
					'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + 'Análise do Gestor: ' + hAPI.getCardValue('a_gestor')  + ' - ' +
					"  Data da Regularização: " + hAPI.getCardValue('data_regularizacao') + '</span>'
					+ 'Manifestação: <span style="font-weight: 400; color: #003641; ">"' + hAPI.getCardValue('r_manifestacao') + '"</span>'
			+ '</div>';
		}else if ( hAPI.getCardValue('a_gestor') == 'Rejeitado'){
			mensagem = 
				'<div style="font-weight: 600;color: #003641;border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
					'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + 'Análise do Gestor: ' + hAPI.getCardValue('a_gestor')  + '</span>' +
					'Manifestação: <span style="font-weight: 400; color: #003641; ">"' + hAPI.getCardValue('g_manifestacao') + '"</span>'
			+ '</div>';
		}
		
	}
	
	if (CURRENT_STATE == 12 ) {
		mensagem = 
			'<div style="font-weight: 600;color: #003641; border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
				'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + 'Aceito? ' + hAPI.getCardValue('aceite')  +'</span>'
			+ ' Parecer:  <span style="font-weight: 400; color: #003641; ">"'+  hAPI.getCardValue('parecer_manifest') + '"</span>'
		+ '</div>' ;
	}
	
	if (CURRENT_STATE == 33) {
		mensagem = 
			'<div style="font-weight: 600;color: #003641; border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
				'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + "Posição: " + hAPI.getCardValue('posicao_plano')  +'</span>'
			+ 'Manifestação da Central: <span style="font-weight: 400; color: #003641; ">"' + hAPI.getCardValue('manifest_central') + '"</span>'
		+ '</div>' ;
	}

	if (CURRENT_STATE == 30) {
		mensagem = 
			'<div style="font-weight: 600;color: #003641; border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
				'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + "Data da execução:  " + hAPI.getCardValue('data_exec')  +'</span>'
			+ 'Comprovação da execução: <span style="font-weight: 400; color: #003641; ">"' + hAPI.getCardValue('exec_plano')  + '"</span>'
		+ '</div>' ;
	}
	
	if (CURRENT_STATE == 38 || CURRENT_STATE == 21) {
		mensagem = 
			'<div style="font-weight: 600;color: #003641; border-radius: 3px;border: 1px solid #009688;margin: 5px 0;padding: 7px;display: block;">' +
				'<span style="color: #009688;display: block;padding: 0px 5px 5px;margin-bottom: 5px;border-bottom: 2px solid;width: 100%;">' + "Aceito? " + hAPI.getCardValue('aceitar_comp')  +'</span>'
			+ 'Parecer: <span style="font-weight: 400; color: #003641; ">"' + hAPI.getCardValue('parecer_compr')  + '"</span>'
		+ '</div>' ;
	}

	if (mensagem != "") {
		hAPI.setTaskComments(CURRENT_USER, CURRENT_NUM_PROCESS, 0, mensagem);
	}
}
