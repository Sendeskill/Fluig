var HelloWorld = SuperWidget.extend({
    message: null,
    cooperativaId: null,
    liquidacaoCredito: null,

    init: function () {
    	var that = this;
    	
    	var lastChecked;
    	var $chkboxes;
    	
    	$.ajax({
            type : "GET",
			contentType: "application/json",
			async: false,
            url : `/api/public/2.0/groups/findGroupsByUser/${WCMAPI.userCode}`,
            success: function(data) {
                data = data.content.filter(function(group) { return /Cooperativa_([0-9]+)/.test(group.code) == true });

                if (data.length) {
                	that.cooperativaId = data[0].code.replace(/[^0-9]/g, '');
                }
            }
		});
    	
    	var template = `<tr>
    		<td>
	    		<div class="custom-checkbox custom-checkbox-success">
	    			<input type="checkbox" name="selecionado[]" id="{{ Id }}" value="{{ Id }}">
		    	    <label for="{{ NumContratoCredito }}"></label>
		    	</div>
    		</td>
	    	<td>{{ NumPA }}</td>
			<td>
				{{ Nome }}
				<span class="subinfo cpf-cnpj">{{ NumCPFCNPJ }}</span>
			</td>
			<td>
				{{ DescProduto }}
			</td>
			<td>{{ NumContratoCredito }}</td>
			<td>R$ <span class="money">{{ ValorBaixo }}</span></td>
			<td>R$ <span class="money">{{ ValorContrato }}</span></td>
			<td>{{ DescHistorico }}<span class="subinfo">{{ DataBaixa }}</span></td>
		</tr>`;
		
		Mustache.parse(template);
    	
    	that.serviceGetLiquidacaoCredito(function(err, data) {
    		that.liquidacaoCredito = data.content;
    		
			for (const classif of data.content) {
				
				classif['DataBaixa'] = moment(classif['DataBaixa']).format('DD/MM/YYYY');
				
				
				classif['ValorBaixo'] = Number(Number(Number(classif['ValorBaixo']) || 0).toFixed(2)).toLocaleString('pt-BR');
				classif['ValorContrato'] = Number(Number(Number(classif['ValorContrato']) || 0).toFixed(2)).toLocaleString('pt-BR');
				
				$('#classif-table').find('tbody').append(Mustache.render(template, classif))
			}
			
			// CPF/CNPJ Mask
            var CpfCnpjMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length <= 11 ? '000.000.000-009' : '00.000.000/0000-00';
            };

            var cpfCnpjpOptions = {
                onKeyPress: function(val, e, field, options) {
                    field.mask(CpfCnpjMaskBehavior.apply({}, arguments), options);
                }
            };

            $('.cpf-cnpj').mask(CpfCnpjMaskBehavior, cpfCnpjpOptions);
			
			$chkboxes = $('[name="selecionado[]"]');
			
			$('#classif-table').find('tbody').find('tr').click(function(e) { 
				e.preventDefault();
				
				var check = $(this).find('input');
				check.prop('checked', !check.prop('checked'));
				
				if (!lastChecked) {
					lastChecked = check[0];
		            return;
		        }
				
				if (e.shiftKey) {
		            var start = $chkboxes.index(check[0]);
		            var end = $chkboxes.index(lastChecked);
		            
		            $chkboxes.slice(Math.min(start,end), Math.max(start,end)+ 1).prop('checked', lastChecked.checked);
		        }

		        lastChecked = check[0];
			});
		});
    	
    },

    bindings: {
        local: {
            'criar-incorporacao': ['click_criarIncorporacao']
        }
    },

    showMessage: function () {
        $div = $('#helloMessage_' + this.instanceId);
        $message = $('<div>').addClass('message').append(this.message);
        $div.append($message);
    },
    
    criarIncorporacao: function() {
		that = this;

		that.serviceCreateIncorporacaoBndu(function(err, data) {
			$('[data-criar-incorporacao]').attr("disabled", true);
			
			window.location.href = `${WCMAPI.tenantURI}/pageworkflowview?app_ecm_workflowview_processInstanceId=${data.processInstanceId}&app_ecm_workflowview_currentMovto=2&app_ecm_workflowview_taskUserId=${WCMAPI.userCode}&app_ecm_workflowview_managerMode=false`;
		});
    },
    
    serviceGetLiquidacaoCredito: function (cb) {
    	var that = this;
    	
		var options,
		url = '/api/public/ecm/dataset/search',
		options = {
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify({
			 	"datasetId" : "dsLiquidacaoCredito",
			 	"limit" : "1000"
			 }),
			loading: true
		};
		FLUIGC.ajax(options, cb);
	},

	serviceCreateIncorporacaoBndu: function (cb) {
		var that = this;
		
		var fields = {};
		
		var inputSelecioados = $('[name="selecionado[]"]:checked').map(function () { return this.value }).get();
		
		var selecionados = that.liquidacaoCredito.filter(function(selecionado) {
			return inputSelecioados.indexOf(selecionado.Id) !== -1;
		});
		
		var i = 1;
		var totalOp = 0;
		
		for (const selecionado of selecionados) {
			
			console.log('Selecionado', selecionados);
			
			fields['id_operacao___' + i] = selecionado.Id;
			
			if (selecionado.DataBaixa) {
				fields['data_operacao___' + i] = selecionado.DataBaixa.split(' ')[0].split('-').reverse().join('/');
			}
			
			fields['numero_contrato_operacao___' + i] = selecionado.NumContratoCredito;
			fields['valor_operacao___' + i] = selecionado.ValorContrato;
						
			totalOp += Number(selecionado.ValorContrato.replace(',', '.'));
			
			i += 1;
		}
		
		fields['valor_total_op'] = Number(Number(totalOp).toFixed(2) || 0).toLocaleString('pt-BR');
		fields['numero_cooperativa'] = that.cooperativaId;
		fields['anexos'] = "[]";
		fields['total_operacoes'] = i - 1;
		
		var options,
		url = '/bpm/api/v1/processes/incorporacao_bndu/start',
		options = {
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify({
				"targetState": 0,
				"subProcessTargetState": 0,
				"comment": "Teste comentário",
				"formFields": fields
			}),
			loading: true
		};

		FLUIGC.ajax(options, cb);
	}
});