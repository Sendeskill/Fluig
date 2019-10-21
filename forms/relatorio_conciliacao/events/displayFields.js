function displayFields(form,customHTML){
	var CURRENT_STATE = getValue("WKNumState");
	
	if (CURRENT_STATE == 13) {
		form.setEnabled('cooperativa', false);
		form.setEnabled('cooperativa_nome', false);
		form.setEnabled('inconsistencia_data', false);
		form.setEnabled('inconsistencia_valor', false);
		form.setEnabled('inconsistencia_descricao', false);
	}
}
