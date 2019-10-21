function displayFields(form, customHTML){
	var CURRENT_STATE = getValue("WKNumState");
    var CURRENT_USER = getValue("WKUser");


   form.setEnabled('cooperativa_nome', false);
   form.setEnabled('cooperativa', false);
   form.setEnabled('inconsistencia_data', false);
   form.setEnabled('inconsistencia_valor', false);
   form.setEnabled('inconsistencia_descricao', false);
   form.setEnabled('tratativa', false);


   if (CURRENT_STATE != 71) {
       form.setEnabled('protocolo_gri', false);
       form.setEnabled('sla', false);
       form.setEnabled('abertura', false);
   }
   
   if (CURRENT_STATE == 18 || CURRENT_STATE == 56) {
	   form.setEnabled('tratativa_solucao', false);
   }
   
   if (CURRENT_STATE != 14) {
	   form.setEnabled('departamento', false);
   }
   
   if (CURRENT_STATE == 22 || CURRENT_STATE == 83) {
	   form.setEnabled('tratativa_analise', false);
   }
   
   if (CURRENT_STATE == 25) {
	   form.setEnabled('tratativa_analise', false);
	   form.setEnabled('tratativa_solucao', false);
	   form.setEnabled('tratativa_satisfatoria', false);
   }


    customHTML.append('<script>');
    customHTML.append("var CURRENT_STATE = " + CURRENT_STATE + ";");
    customHTML.append("var TRATATIVA_VALUE = '" + form.getValue('tratativa') + "';");
    customHTML.append("var CURRENT_USER = '" + CURRENT_USER + "';");
    customHTML.append("var NUM_PROCES = " + getValue("WKNumProces") + ";");
    customHTML.append('</script>');
}