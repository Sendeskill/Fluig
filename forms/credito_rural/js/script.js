$(document).ready(function(){

	var taskTitle =  $('#textActivity', window.parent.document).text();  

	/*/* Tabelas Pai e Filho */
	//
	//
	alxOrcamentoPecuario = new Alx.Table('tabela_orcamento_pecuario', 'grupo_id');
	alxOrcamentoPecuario.addChild(new Alx.Table('tabela_grupo_p', null, 'item_p_id'));

	for (let grupo of ['Vacinas', 'Medicamentos', 'Suplementação']) {
		alxOrcamentoPecuario.add(null, function(number, element) {

			$element = $(element);

			$element.find('#nome_grupo___' + number).val(grupo);
			$element.find('.btn-add').trigger('click');
		});
	}

	
	alxOrcamentoAgricolaA = new Alx.Table('tabela_orcamento_analitico', 'item_id');
	alxOrcamentoAgricolaA.addChild(new Alx.Table('tabela_item_analitico', null, 'campos_id'));

	alxOrcamentoAgricolaA.getChild('tabela_item_analitico').afterAdd = function(number, element){ 
			var myCalendar = FLUIGC.calendar('.calendar', {
				useCurrent: false
			});
	}

	for (let item of ['Inseticidas', 'Pão', 'Escavadeira']) {
		alxOrcamentoAgricolaA.add(null, function(number, element) {

			$element = $(element);

			$element.find('#nome_item___' + number).val(item);
			$element.find('.btn-add').trigger('click');
		});
	}


	alxOrcamentoAgricolaS = new Alx.Table('tabela_orcamento_simplificado');

	for (let itemS of ['Inseticidas', 'Pão', 'Escavadeira']) {
		alxOrcamentoAgricolaS.add(null, function(number, element) {

			$element = $(element);

			$element.find('#nome_itemS___' + number).val(itemS);
			$element.find('.btn-add').trigger('click');
		});
	}

	alxImovel = new Alx.Table('tabela_imovel');
	alxImovel.add();
	alxImovel.add();
	alxImovel.add();


	anexo = new Alx.Table('tabela_anexo');

	anexo.afterRender = function(number, element) {
		/*
		/**	Editar nome documento
		/*/

		$element = $(element);

		$element.find('button.edit').click( function(){
			$(this).parents('.titulo').find(':input').attr("readonly", false); 
		});

		/*$('.titulo').find(':input').mouseout( function(){
			$(this).attr("readonly", true); 
		});*/

		
		$element.find('.titulo').find(':input').keypress(function() {
			var keycode = (event.keyCode ? event.keyCode : event.which);

			if (keycode == 13) {
				event.preventDefault();
				this.readOnly = true;
			}
		});
	}



	/** Tipo Orçamento Agricola **/
	//
	$('select[name="tipo_orcamento"').change(function(){
		$('#orcamento_simplificado').hide();
		$('#orcamento_analitico').hide();

		if ($(this).val() == 'Simplificado'){
			$('#orcamento_simplificado').show();

		}else if ($(this).val() == 'Analitico') {
			$('#orcamento_analitico').show();
		}
	});

	//* Coordenadas
	$('.coordenadas').click( function(){
		$(this).parent().parent().find('.box-coord').show();
	});

	$('.box-coord').find('.btn-close').click( function(){
		$(this).parents('.box-coord').hide();
	});

	$('.box-coord').find('.btn-salvar').click( function(){
		$(this).parents('.box-coord').hide();
	});

	//* Sem Limite


	//

	$('btn_aprovado').click( function(){
		$('input[name="apr_credito"').val('1');
	});

	//

	$('#header').find('span.center').append(taskTitle);

	$('.container').hide();
	$('#busca_cooperado').hide();
	$('#controle').find('.row').hide();
	$('#apr_credito').hide();

	if ( CURRENT_STATE == 0 || CURRENT_STATE == 4 ){
		$('#busca_cooperado').show();
		$('#cooperado').tab('show');
		$('#cooperado').addClass('active');

		$('#header').find('span.center').text('Crédito Rural ');

	
	}else if ( CURRENT_STATE == 111) {
		$('#imprimir').show();

	}else if ( CURRENT_STATE == 25 ){
		$('#anexo_docs').show();
		$('#alerta-correcao').hide();

		$('.box-docs').find('.titulo').css({
			'background-color' : '#4C7C83'
		});

	}else if ( CURRENT_STATE == 27 ){
		$('#avaliacao_docs').show();
		$('#parecer_tecnico').hide();

	}else if ( CURRENT_STATE == 39 ){
		$('#anexo_docs').show();
		$('#parecer').hide();
		$('.btn-act').hide();
		$('.box-docs').find('.titulo').css({
			'background-color' : '#4C7C83'
		});

	}else if ( CURRENT_STATE == 41 ){
		$('#avaliacao_docs').show();
		$('#parecer_tecnico').hide();
		

	}else if( CURRENT_STATE == 49 || CURRENT_STATE == 51 ){
		$('#avaliacao_docs').show();
		$('#parecer').hide();

		$('.box-docs').find('.titulo').css({
			'background-color' : '#4C7C83'
		});

	}else if ( CURRENT_STATE == 35 || CURRENT_STATE == 45){
		$('#registro_proposta').show();

	}else if ( CURRENT_STATE == 53 ){
		$('#avaliacao_docs').show();
		$('#parecer').hide();
		$('#box-ava').hide();
		$('#apr_credito').show();
		
	}else if ( CURRENT_STATE == 71){
		$('#controle').show();
		$('#cancelamento').show();

	}else if ( CURRENT_STATE == 58 ){
		$('#controle').show();
		$('#validacao').show();

	}else if ( CURRENT_STATE == 62 ){
		$('#controle').show();
		$('#correcao').show();

	}else if ( CURRENT_STATE == 64 ){
		$('#controle').show();
		$('#formalizacao').show();

	}else if ( CURRENT_STATE == 66 ){
		$('#controle').show();
		$('#liberacao_credito').show();
	}

	//next
	

	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	    e.target; // activated tab
	    e.relatedTarget; // previous tab

	    situation = Number(e.target.dataset.number);

	   $('[data-number]').removeClass('complete');


	   console.log(situation);

	   for ( i = 1; i <= situation; i++){
	   		console.log(situation, i);

	    	$('[data-number="'+ i + '"]').addClass('complete');
	    }
	});


	$('.collapse').collapse();


	$('#btn_aprovado').click( function(){
		$('#btn_negado').css({
			'background-color': '#eee',
		});
	});

	$('#btn_negado').click( function(){
		$('#btn_aprovado').css({
			'background-color': '#eee',
		});
	});


	$('.money').maskMoney();

	var options = {
   		onKeyPress: function (cpf, ev, el, op) {
        	var masks = ['000.000.000-000', '00.000.000/0000-00'];
        	$('.CPF-CNPJ').mask((cpf.length > 14) ? masks[1] : masks[0], op);
    	}
	}

	//$('.CPF-CNPJ').length > 11 ? $('.CPF-CNPJ').mask('00.000.000/0000-00', options) : $('.CPF-CNPJ').mask('000.000.000-00#', options);

	var options1 = {
	    min: 0,
	    max: 24,
	    range: false,
	    value: [8,17],
	    step: 0.5,
	    formatter: function(value) {
	        return 'From ' + value[0] + ' to ' + value[1];
	    }
	};

	FLUIGC.slider.init('#produtividade_slider', options1);
	FLUIGC.slider.init('#financiamento_slider');
	FLUIGC.slider.init('#financiamento_slider_pec');

	/*
	/**	Tipo de Exploração
	/*/

	$('.pecuaria').hide();
	$('.agricola').hide();

	$('#tipo_exploracao').change( function(){

		$('.pecuaria').hide();
		$('.agricola').hide();

		if ( $(this).val() == 1 ){
			$('.agricola').show();
		}else if( $(this).val() == 2 ){
			$('.pecuaria').show();
		}
	});
});

var situation = 1;
	
	function next(){
		situation++;
		$('[data-number="' + situation + '"]').trigger('click');
	}

function showCamera(param) {
    JSInterface.showCamera(param);
}

function cadastroModal(){
	 var cadastro = FLUIGC.modal({
	    title: 'Cadastro no Sisbr',
	    content: `
	    	<div id="dados_proposta">
				<div class="row" id="pInfo">
					<div class="col-sm-12 col-md-3 ">
						<div class="form-group ">
							<label>Cooperativa</label>
							<input type="text" name="coop1" class="input-info" value="001" readonly >
						</div>
					</div>
					<div class="col-sm-12 col-md-3">
						<div class="form-group">
							<label>Conta</label>
							<input type="text" name="conta1" class="input-info" value="001" readonly>
						</div>
					</div>
					<div class="col-sm-12 col-md-3">
						<div class="form-group">
							<label>Estado Civil</label>
							<input type="text" name="estado_civil1" class="input-info" value="Solteiro" readonly>
						</div>
					</div>
					<div class="col-sm-12 col-md-3">
						<div class="form-group">
							<label>Telefone</label>
							<input type="text" name="tel1" class="input-info" value="(00) 00000-0000" readonly>
						</div>
					</div>
					<div class="col-sm-12 col-md-3">
						<div class="form-group">
							<label>Nacionalidade</label>
							<input type="text" name="nacionalidade1" class="input-info" value="Brasileiro" readonly>
						</div>
					</div>
					<div class="col-sm-12 col-md-6">
						<div class="form-group">
							<label>Endereço</label>
							<input type="text" name="endereco1" class="input-info" value="Rua Lorem Ipsum dolor sit amet, 000" readonly>
						</div>
					</div>
					<div class="col-sm-12 col-md-3">
						<div class="form-group">
							<label>Cidade</label>
							<input type="text" name="cidade1" class="input-info" value="Curitiba" readonly>
						</div>
					</div>
				</div>

				<div class="row" id="pInfo">
					<div class="col-sm-12 col-md-4">
						<div class="form-group">
							<label>Finalidade do crédito</label>
							<span name="fin_cred1" class="form-control" readonly>
								Exemplo
							</span
						</div>
						</div>
					</div>
					<div class="col-sm-12 col-md-4">
						<div class="form-group">
							<label for="tipo_exploracao">Tipo de exploração</label>
							<span name="tipo_exploracao1" class="form-control" id="tipo_exploracao" readonly>
								Agrícola
							</span>
						</div>
					</div>
					<div class="col-sm-12 col-md-4">
						<div class="form-group">
							<label>Item financiado</label>
							<span name="item_financiado1" class="form-control" readonly> 
								Exemplo
							</span>
						</div>
					</div>
					<div class="col-sm-12 col-md-4">
						<div class="form-group">
							<label>Unidade de medida</label>
							<span name="unid_medida1" class="form-control" readonly>
								Exemplo
							</span>
						</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12">
					<div class="custom-checkbox custom-checkbox-success">
					    <input type="checkbox" id="checkbox-2">
					    <label for="checkbox-2">Proposta cadastrada no Sisbr?</label>
					</div>
				</div>
				
				<div class="col-xs-12 col-sm-6 col-md-3">
					<div class="form-group"
						<label for="n_proposta">Número da Proposta:</label>
						<input type="text" name="n_proposta" class="form-control">
					</div>
				</div>
			</div>
	    `,
	    id: 'cadastro-modal',
	    size: 'large',
	    actions: [{
	        'label': 'Concluído',
	        'bind': 'data-open-modal',
	    },{
	        'label': 'Cancelar',
	        'autoClose': true
	    }]
	}, function(err, data) {
	    if(err) {
	        // do error handling
	    } else {
	        // do something with data
	    }
	});
}