jQuery.fn.valOrText = function() {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(this[0].tagName) != -1) {
        return  this[0].value;
    }

    return this[0].innerText;
};

$(document).ready(function(){

	$('.opt-campos').hide();
	$('.analise').find('.opt-campos').show();

	$('.lista_testes').find('input[type=radio]').change( function(){
		var conform = $('input[name$="Conformidade"]:checked').val();

		if ( conform == 'Não') {
			$(this).closest('.box-teste').find('.opt-campos').show();
			$('.nao-conformidade').show();
		}else if ( conform == 'Sim' || conform == 'NA' ){
			$(this).closest('.box-teste').find('.opt-campos').show();
			$('.nao-conformidade').hide();
		}

	}).trigger('change');
	
	if ($('input.calendar:not([readonly])').length) {
		FLUIGC.calendar('.calendar:not([readonly])');
	}

	$('.desc-teste').find('span').html($('[name="Teste"]').valOrText());
	$('.procedimento').find('span').html($('[name="ProcedimentosVerificacao"]').valOrText());

	$('#analise_manifest, #exec_plano, .procedimento').hide();


	if (CURRENT_STATE == 54) {
		$('#analise_gestor').hide();
		$('.procedimento').show();
	}

	if (CURRENT_STATE == 30 || CURRENT_STATE == 38) {
		$('#exec_plano').show();
	}

	if(CURRENT_STATE == 12){
		$('#analise_gestor').show();
		$('#analise_manifest').show();
		$('.procedimento').show();
	}

	if(CURRENT_STATE == 5 && $('input[name$="aceite"]:checked').val() == 'Não' ){
		$('#analise_gestor').show();
		$('#analise_manifest').show();
	}

	if(CURRENT_STATE == 5 && $('input[name$="aceitar_comp"]:checked').val() == 'Não' ){
		$('#analise_gestor').show();
		$('#analise_compr').show();
	}

	if (CURRENT_STATE == 21){ 
		$('#analise_compr').show();
			$('.procedimento').show();
		$('[name="aceite"]').prop('checked', false);
	}
	
	if(CURRENT_STATE == 33){
		$('#analise_plano').show();
		$('.procedimento').show();
	}

	if(CURRENT_STATE == 28){
		$('#analise_plano').show();
	}

	if(CURRENT_STATE == 38){
		$('#analise_compr').show();
		$('.procedimento').show();
	}

	/*
	* Análise do gestor
	*/

	$('input[name$="a_gestor"]').change( function(){
		var a_gestor = $('input[name$="a_gestor"]:checked').val();
			$('.rejeitado').hide();
			$('.plano').hide();
			$('#compr_regularidade').hide();

			if (a_gestor == 'Acatado'){
				$('.plano').show();
			} else if( a_gestor == 'Rejeitado'){
				$('.rejeitado').show();
			}else if(a_gestor == 'Regularizado'){
				$('#compr_regularidade').show();
			}
	}).trigger('change');
});