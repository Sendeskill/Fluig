function validateForm(form){
	
   
}

function isEmpty(campo, form) {
    var valor = form.getValue(campo);
    return valor == null || valor.trim().length() == 0 || typeof valor === undefined;
}
