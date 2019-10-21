function displayFields(form, customHTML) {

    var CURRENT_STATE = getValue("WKNumState");
    var CURRENT_USER = getValue("WKUser");
    
    var indexOperacoes = form.getChildrenIndexes("tabela_monitor_crl");
    
    if (CURRENT_STATE != 0 && CURRENT_STATE != 31){
    	 for (var i = 1; i <= indexOperacoes.length; i++) {
    	    	form.setEnabled('opcao___' + i, false);
    	    	form.setEnabled('descricao_sub___' + i, false);
    	    }
    }
   
    if (CURRENT_STATE != 13){
    	 for (var i = 1; i <= indexOperacoes.length; i++) {
 	    	form.setEnabled('aderencia___' + i, false);
 	    	form.setEnabled('just_aderencia___' + i, false);
 	    }
    }
    
    if (CURRENT_STATE != 20 ){
   	 for (var i = 1; i <= indexOperacoes.length; i++) {
	    	form.setEnabled('analise___' + i, false);
	    	form.setEnabled('justAnalise___' + i, false);
	    }
   }
    
    if (CURRENT_STATE != 28 ){
      	 for (var i = 1; i <= indexOperacoes.length; i++) {
      		form.setEnabled('aderencia_b___' + i, false);
 	    	form.setEnabled('just_aderencia_b___' + i, false);
 	    	form.setEnabled('aderencia_c___' + i, false);
	    	form.setEnabled('just_aderencia_c___' + i, false);
   	    }
      }
    
    customHTML.append('<script>');
    customHTML.append("var CURRENT_STATE = " + CURRENT_STATE + ";");
    customHTML.append("var CURRENT_USER = '" + CURRENT_USER + "';");
    customHTML.append('</script>');
}
