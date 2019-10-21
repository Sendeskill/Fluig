var Pendencia = (function() {

	var movementSequence;

	function tabsForm() {
		$('#tabs a').click(function(event) {
			event.preventDefault();
			$(this.hash).tab('show');
		});

		$('[role="tab"]').hide();


		$('#formulario-tab').show().tab('show');


		$('#tratativa-choose-container, #tratativa-data-container, #tratativa-analise-container, #tratativa-solucao-container').hide();

		if (CURRENT_STATE == 29) {
			$('#cobrar-acompanhamento-gri-tab').show();
		}

		if (CURRENT_STATE == 18 || CURRENT_STATE == 56 || CURRENT_STATE == 25 ||  CURRENT_STATE == 27) {
			$('#tratativa-tab').show();
			$('#tratativa-solucao-container, #tratativa-analise-container, #tratativa-choose-container').show();
		}

		if (CURRENT_STATE == 22 || CURRENT_STATE == 83) {
			$('#tratativa-tab').show();
			$('#tratativa-solucao-container, #tratativa-analise-container').show();
		}

		if (CURRENT_STATE == 38) {
			$('#tratativa-tab').show();
			$('#tratativa-solucao-container').show();
		}

		if (CURRENT_STATE == 54 || CURRENT_STATE == 59 || CURRENT_STATE == 43) {
			$('#tratativa-tab').show();
			$('#tratativa-solucao-container').show();
		}
		
		if (CURRENT_STATE == 29) {
			$('[name="resolvido_gri"]').change(function() {
				var tratativa = $('[name="resolvido_gri"]:checked').val();

				if (tratativa == 'Y') {
					$('#dar-tratativa').show();
				} else {
					$('#dar-tratativa').hide();
				}
			}).trigger('change');
		}
	}

	function beforeSendValidate(numState, nextState) {
		var isValid = true;
		

		if (CURRENT_STATE == 71) {
            if ($('[name="abertura"]').val() == "") {
                alert('Por favor, informe a data do chamado no GRI');
                return false;
			}
			
			if ($('[name="protocolo_gri"]').val() == "") {
                alert('Por favor, informe o protocólo do chamado no GRI');
                return false;
			}
			
			if ($('[name="sla"]').val() == "") {
                alert('Por favor, informe o SLA do chamado');
                return false;
            }
        }

        if (false) {
			var complementoAdd = "";
			
			jQuery('[data-complemento]').each(function() {
				if (this.value != '') {
					complementoAdd = this.value;
					return false;
				}
			});

            if (complementoAdd != "") {
                $.ajax({
                    async : true,
                    type : "POST",
                    contentType: "application/json",
                    url : '/ecm/api/rest/ecm/workflowView/sendObservation/',

                    data: JSON.stringify({
                        "processInstanceId": NUM_PROCES,
                        "stateSequence": CURRENT_STATE,
                        "movementSequence": movementSequence,
                        "observation": complementoAddValue,
                        "managerMode": false
                    })
                });
            }
        }

        return isValid;
    }

	function init() {
		console.log('NUM_PROCES', NUM_PROCES);
		console.log('CURRENT_STATE', CURRENT_STATE);
		console.log('CURRENT_USER', CURRENT_USER);

		console.log('Tratativa GRI', TRATATIVA_VALUE == 'GRI');

		$('#info-protocolo-gri').hide();
		$('#select-departamento').hide();

		if (TRATATIVA_VALUE == 'GRI') {
			$('#info-protocolo-gri').show();
		}

		if (TRATATIVA_VALUE == 'Central') {
			$('#select-departamento').show();
		}

		$('[data-complemento-nome]').each(function() {
			$(this).html(`<textarea class="form-control" data-complemento rows="4" name="${this.dataset.complementoNome}" id="${this.dataset.complementoNome}"></textarea>`);
		});

		$('[name="tipo_resposta_gri"]').change(function() {
			$('#tratativa-data-container').hide();

			if ($('[name="tipo_resposta_gri"]:checked').val() == 'GRI') {
				$('#tratativa-data-container').show();
			}
		}).trigger('change');
		

		if (NUM_PROCES > 0) {
			$.ajax({
				 type : "GET",
				 async: false,
				 contentType: "application/json",
				 url : `/api/public/2.0/workflows/findActiveTasks/${NUM_PROCES}`,
				 error: function() {
					 FLUIGC.toast({ message: 'Não foi possível recuperar recuperar informações da atividade', type: 'danger' });
				 },
				 success: function(data) {
					 var content = data.content;
					 movementSequence = content.tasksInfo[0].movementSequence;
				 }
			 });
		 }


		 console.log('movementSequence', movementSequence);

		tabsForm();
	}

	return {
		init,
		beforeSendValidate
	};

})();

var beforeSendValidate = Pendencia.beforeSendValidate;


$(document).ready(function(){
	if ($('input.calendar:not([readonly])').length) {
		FLUIGC.calendar('.calendar:not([readonly])');
	}
	
	$('body').parents('#wcm-widget').find("#workflowActions").find(".btn").css({
		"background": "green"
	});

	Pendencia.init();
});