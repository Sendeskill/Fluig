$(document).ready(function(){

	alxProds = new Alx.Table('tabelaProds');
	alxClientes = new Alx.Table('tabelaPClientes');
	alxForns = new Alx.Table('tabelaPForns');

	$('.btn-add').trigger('click');

	var pAnalise = FLUIGC.richeditor('analise');
	var pComite = FLUIGC.richeditor('comite');
	var pGerente = FLUIGC.richeditor('gerente');

	setTimeout(function(){
		$('#cke_comite').hide();
		$('#cke_analise').hide();
		$('#cke_gerente').hide();

	}, 1000);

	
	
	$('#box-gpe').hide();
	//separação telas

	$('.container').hide();

	if ( CURRENT_STATE == 0) {
		$('#inicio').show();
	}

	if ( CURRENT_STATE == 12) {
		$('#confirma_atualizacao').show();
	}

	if ( CURRENT_STATE == 10) {
		$('#consultas').show();
	}

	if ( CURRENT_STATE == 22) {
		$('#relatorio').show();
	}

	if ( CURRENT_STATE == 24) {
		$('#parecer_gerente').show();
		setTimeout(function(){
			$('#cke_gerente').show();
		}, 1010);

	}

	if ( CURRENT_STATE == 34 || CURRENT_STATE == 47 ) {
		$('#triagem').show();
	}

	if ( CURRENT_STATE == 45 || CURRENT_STATE == 59) {
		$('#box-gpe').show();
		$('#planilhamento').show();
	}

	if ( CURRENT_STATE == 68 || CURRENT_STATE == 105) {
		$('#analise').show();
	}

	if ( CURRENT_STATE == 72 || CURRENT_STATE == 146) {
		$('#comite').show();
	}


	//tabela faturamento


	// Prioridade
	$('#prioridade').hide();

	$('input[name="prioridade"]').change( function(){
		if ($('input[name="prioridade"]').is(':checked')){
			var myModal = FLUIGC.message.confirm({
			    message: 'Essa opção tem custo adicional, deseja continuar?',
			    title: 'Marcar prioridade',
			    labelYes: 'Sim',
			    labelNo: 'Não'
			}, function(result, el, ev) {
			    if ( result == false) {
			    	$('input[name="prioridade"]').prop('checked', false);
			    	
			    }else{
			    	$('#prioridade').show();
			    }
			});
		}else{
			$('#prioridade').hide();
			    
		}

	});

});