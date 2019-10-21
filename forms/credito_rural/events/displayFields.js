function displayFields(form,customHTML){
	
	var CURRENT_STATE = getValue("WKNumState");
    var CURRENT_USER = getValue("WKUser");
    

    
    if (CURRENT_STATE != 51){
    	form.setEnabled('pontos_atencao', false);
	    form.setEnabled('parecer_tecnico', false);
	    form.setEnabled('desc_pontosA', false);
    }
    
    
	customHTML.append("<script> var CURRENT_STATE = " + getValue("WKNumState") + ";</script>");
}