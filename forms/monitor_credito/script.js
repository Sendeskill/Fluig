function preview(id) {
	$.ajax({
		type : "GET",
		contentType: "application/json",
		url : `/api/public/2.0/documents/getDownloadURL/${id}`,
		success: function(data) {
			window.open(data.content);
		}
	});
}

$(document).ready(function(){
	//Busca os checklists em um dataset fixo
	function serviceDsCheckListCRL(cb) {
		var options = {
			url: '/api/public/ecm/dataset/search',
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify({
				"datasetId" : "dsCheckListCRL",
				"limit" : "1000"
			}),
			loading: true
		};
		FLUIGC.ajax(options, cb);
	}

	serviceDsCheckListCRL(function(err, data) {
		var checkListCtrl = [];
		for (var check of data.content) {
			checkListCtrl.push(check);
		}

		var itens = checkListCtrl.filter(element => {
			return element.Item != "";
		});

		alxMonitorCRL = new Alx.Table('tabela_monitor_crl');

		function defaultHandle (number, element) {
			var $element = $(element);

			$element.find('[alx-id]').each(function() {
				$this = $(this);

				var id = $this.attr('alx-id') + '___' + number;
				$this.attr('id', id );
			});

			$element.find('[alx-for]').each(function() {
				$this = $(this);

				var id = $this.attr('alx-for') + '___' + number;
				$this.attr('for', id );
			});

			$('#justificativa___'+ number).hide();
			$('#subitem___'+ number).hide();

			$('input[name="opcao___' + number + '"]').change( function() {
				var valor = $('input[name="opcao___' + number + '"]:checked').val();
				var Item = $('#Item___' + number).val();

				var $subitem_selected = $('#subitem_selected___' + number);

				//Se não tem negativo, termina o processo (primeira task)
				if (CURRENT_STATE == 6) {
					$subitem_selected.val('');
					$('#negativo').val($('[name^="opcao___"][value="nao"]:checked').length > 0 ? 'Y' : 'N');
				}

				$('#justificativa___'+ number).hide();
				$('#subitem___'+ number).hide();

				$monitorCRL_subitens = $('#monitor_crl_subitem___' + number);
				$monitorCRL_subitens.html('');

				if (valor == 'nao') {
					var subitens = checkListCtrl.filter(element => {
						return element.Item == "" && parseInt(element.Subitem) == Item;
					});

					var radioId = 1;
					for (subitem of subitens) {
						$('#subitem___'+ number).show();
						$monitorCRL_subitens.append(`
													<div class="custom-radio custom-radio-success">
													    <input type="radio" name="sub_item___${number}" id="sItem___${number}_${radioId}" value="${subitem.Subitem}. ${subitem.Descricao}">
													    <label for="sItem___${number}_${radioId}">${subitem.Subitem}. ${subitem.Descricao}</label>
													</div>
													`);
						radioId++;
					}

					$('[name^="sub_item___"]').change(function() {
						$subitem_selected.val(this.value);
					});
				}else if (valor == 'just')
					$('#justificativa___'+ number).show();
			}).trigger('change');

			//Verifica se algum item da análise foi discordado (para o conforme)
			$('[name^="analise___"]').change(function() {
				$('#concorde').val($('[name^="analise___"][value="discordar"]:checked').length > 0 ? 'N' : 'Y');
			});

			//Anexos
			$element.find('[fileupload]').each(function() {
				var $fileUpload = $(this);
				var inputFileId = Math.random().toString(36).substring(7);

				$(`<input type="file" name="${inputFileId}" id="${inputFileId}" data-url="/ecm/upload" style="display: none;">`).insertAfter($fileUpload);

				$fileUpload.attr('for', inputFileId);

				$input = $('#' + inputFileId);

				$input.fileupload({
					dataType: 'json',
					done: function (e, data) {
						$.each(data.result.files, function (index, file) {
							$.ajax({
								async : true,
								type : "POST",
								contentType: "application/json",
								url : '/api/public/ecm/document/createDocument',
								data: JSON.stringify({
									"description": file.name,
									"parentId": 4119,
									"additionalComments": "",
									"attachments": [{
										"fileName": file.name
									}],
								}),
								error: function() {
									FLUIGC.toast({
										title: '',
										message: "Falha ao enviar",
										type: 'danger'
									});
								},
								success: function(data) {
									var textareaAnexo = $fileUpload.attr('anexo-campo');
									var $anexos       = $element.find(`[name="${textareaAnexo}___${number}"]`);
									var val           = $anexos.val() || '[]';
									var anexoObj      = JSON.parse(val);
									var anexo         = { "id": data.content.id, "name": data.content.phisicalFile };

									anexoObj.push(anexo);

									var containerAnexoLista = '.' + $fileUpload.attr('anexo-list');

									$lista = $element.find(containerAnexoLista);
									$lista.html('<span>Anexos: </span>');
									$lista.show();

									for (var anx of anexoObj) {
										$element.find(containerAnexoLista).append(`<a href="#">${anx.name}</a>`)
									}

									$anexos.val(JSON.stringify(anexoObj));
								}
							});
						});

					}
				});
			});

		};

		alxMonitorCRL.afterAdd = defaultHandle;
		alxMonitorCRL.afterRender = defaultHandle;

		var i = $('#correcao').val();

		alxMonitorCRL.afterRenderAll = function(element) {
			//TELAS
			$('.aderencia').hide();
			$('.analise').hide();

			if (CURRENT_STATE != 6) {
				$('.anx').each( function(){
					if ( $(this).length != 0 ){
						$(this).show();
						$(this).prepend('<span>Anexos: </span>');
					}
				});
			}

			if (CURRENT_STATE == 6) {
				$('#checklist').show();
				$('.separate').removeClass('separate');
			}

			if (CURRENT_STATE == 12) {
				$('#checklist').show();
				$('.aderencia').show();

				$('.option').parents('[alx-row]').hide();
				$('.nao-opt:checked').parents('[alx-row]').show();
			}

			if (CURRENT_STATE == 14){
				$('#checklist').show();
				$('.aderencia').show();
				$('.analise').css('display', 'block');

				$('.option').parents('[alx-row]').hide();

				if ( i == 1 && $('input[name^="aderencia_b"]:checked').val() != 0 ) {
					$('input[name^="aderencia_b"]:checked').parents('[alx-row]').show();
					$('.backup, .backup1').show();
				}else if ( i > 1){
					$('input[name^="aderencia_c"]:checked').parents('[alx-row]').show();
					$('.backup, .backup2').show();
				}else if ( i == 0){
					$('.nao-opt:checked').parents('[alx-row]').show();
				}
			}

			if (CURRENT_STATE == 20){
				$('#checklist').show();
				$('.aderencia').show();

				$('.analise').css('display', 'block');

				$('.option').parents('[alx-row]').hide();
				$('[alx-id="aDisc"]:checked').parents('[alx-row]').show();

				if ( i == 0) {
					$('.backup, .backup1').show();
				}else {
					$('.backup, .backup2').show();
				}

				i++;
				$('#correcao').val(i);
			}

		};

		alxMonitorCRL.render(function(number, element) {
			$element = $(element);

			$element.each( function(){
				$subitem = $element.find('[alx-id="subitem"]');
				$subitem.show();

				$element.find('[alx-id="monitor_crl_subitem"]').html('<strong style="padding: 10px; display: block;">' + $('#subitem_selected___' + number).val() + '</strong>');
			});

			var $fileUpload   = $element.find('[fileupload]');
			var textareaAnexo = $fileUpload.attr('anexo-campo');

			// Anexos
			var $anexos  = $element.find(`[name="${textareaAnexo}___${number}"]`);
			var val      = $anexos.val() || '[]';
			var anexoObj = JSON.parse(val);

			var containerAnexoLista = '.' + $fileUpload.attr('anexo-list');

			$lista = $element.find(containerAnexoLista);
			$lista.html('');

			for (var anx of anexoObj) {
				$element.find(containerAnexoLista).append(`<a href="#" onclick="preview(${anx.id})">${anx.name}</a>`)
			}
		});

		if (CURRENT_STATE == 6){
			for (var item of itens) {
				alxMonitorCRL.add(null, function(number, element) {
					$('#Item___' + number).val(item.Item);
					$('#Descricao___' + number).val(item.Descricao);
				});
			}
		}
	});

	$('.money').maskMoney();

	$('#monitor-table').find('tr.analisar').click(function(){
		if ($(this).find(':input').is(":checked")) {
			$(this).find(':input').prop("checked", false);
			$(this).removeClass('selected');
		}else{
			$(this).find(':input').prop("checked", true);
			$(this).addClass('selected');
		}
	});
});
