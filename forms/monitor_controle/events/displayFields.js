function displayFields(form, customHTML) {

    var CURRENT_STATE = getValue("WKNumState");
    var CURRENT_USER = getValue("WKUser");

    if (CURRENT_STATE != 54){
    	form.setEnabled('Conformidade', false);
	    form.setEnabled('evidencia', false);
	    form.setEnabled('nConformidade', false);
    }
    
    if (CURRENT_STATE != 5){
    	form.setEnabled('a_gestor', false);
        form.setEnabled('g_manifestacao', false);
        form.setEnabled('r_manifestacao', false);
        form.setEnabled('data_regularizacao', false);
    }
    
    if (CURRENT_STATE == 5){
    	form.setEnabled('aceite', false);
    	form.setEnabled('parecer_manifest', false);
    	form.setEnabled('aceitar_comp', false);
    	form.setEnabled('parecer_compr', false);

    }
    
    if (CURRENT_STATE == 28){
    	form.setEnabled('posicao_plano', false);
    	form.setEnabled('manifest_central', false);
    }
    
    if (CURRENT_STATE != 5 && CURRENT_STATE != 28){
    	form.setEnabled('prazo_reg', false);
        form.setEnabled('plano_acao', false);

    }
    
    if (CURRENT_STATE != 30){
        form.setEnabled('data_exec', false);
        form.setEnabled('exec_plano', false);
    }
  
    customHTML.append('<script>');
    customHTML.append("var CURRENT_STATE = " + CURRENT_STATE + ";");
    customHTML.append("var CURRENT_USER = '" + CURRENT_USER + "';");
    customHTML.append('</script>');
}
