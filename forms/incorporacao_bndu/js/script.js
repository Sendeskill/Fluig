jQuery.fn.valOrText = function() {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(this[0].tagName) != -1) {
        return  this[0].value;
    }

    return this[0].innerText;
};

function number2Money(num) {

    if (isNaN(num)) {
        num = '0';
    }

    return Number(num).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

function money2Number(num) {
    return Number(num.replace(/[^0-9,]+/g, '').replace(',', '.'));
}


function copyInput(copyText) {
    copyText.select();
    document.execCommand("copy");
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

var Bndu = (function() {
    var origem;
    var cooperativaId;

    var grupoCooperativa = {
        id: null,
        data: {
            BNDUPasta: null
        }
    };

    var movementSequence;

    /**
     * Classificação
     */
    var Classificacao = (function() {
        var liquidacaoCredito;
        var lastChecked;
        var $chkboxes;
        
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
                <td>R$&nbsp;{{ ValorBaixo }}</td>
                <td>R$&nbsp;{{ ValorContrato }}</td>
                <td>{{ DescHistorico }}<span class="subinfo">{{ DataBaixa }}</span></td>
            </tr>`;

        Mustache.parse(template);
        
        function init() {
            searchForm();
        }

        function searchForm() {
            var templateFormBusca = `
                    <div class="row">
                        <div class="col-xs-12 col-md-4 col-lg-3">
                            <label>Data inicial</label>
                            <input type="text" name="data_inicio" id="data_inicio" class="calendar form-control fs-display-inline" placeholder="Data Início">
                        </div>
                        <div class="col-xs-6 col-md-3">
                            <label>Data final</label>
                            <input type="text" name="data_fim" id="data_fim" class="calendar form-control fs-display-inline" placeholder="Data Fim">
                        </div>
                
                        <div class="col-xs-12 col-md-2 col-lg-2 col-md-offset-1 col-lg-offset-1">
                            <label for="num_pa" >Agência</label>
                            <select name="num_pa" id="num_pa" class="form-control"></select>
                        </div>
                        <div class="col-xs-12 col-md-1 fs-display-inline">
                            <button id="btn-buscar" class="btn btn-primary fs-float-right" onclick="Bndu.Classificacao.search()"><i class="fluigicon fluigicon-search icon-sm"></i> Buscar</button>
                        </div>
                    </div>

            `;
                
            $('#form-busca').html(templateFormBusca);

            $('#data_inicio').val(moment().format('DD/MM/YYYY'));
            $('#data_fim').val(moment().format('DD/MM/YYYY'));

            selectListaPA(function(err, data) {
                for (const content of data.content) {
                    $('#num_pa').append(`<option value="${content.NumPA}">${content.NumPA}</option>`);
                }
            });

            FLUIGC.calendar('input.calendar');
        }

        function search() {

            var dataInicio = moment($('#data_inicio').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
            var dataFim = moment($('#data_fim').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
            var numPa = $('#num_pa').val();

            var filter = {
                data_inicio: dataInicio,
                data_fim: dataFim,
                num_pa: numPa
            };

            serviceGetLiquidacaoCredito(function(err, data) {
                liquidacaoCredito = data.content;
    		
                for (const classif of data.content) {
                    
                    classif['DataBaixa'] = moment(classif['DataBaixa']).format('DD/MM/YYYY');
                    
                    
                    classif['ValorBaixo'] = number2Money(classif['ValorBaixo']);
                    classif['ValorContrato'] = number2Money(classif['ValorContrato']);
                    
                    $('#classif-table').find('tbody').append(Mustache.render(template, classif));
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

                lastChecked = undefined;

                
                $('#classif-table').find('tbody').find('tr').unbind('click').click(function(e) { 
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
                        
                        $chkboxes.slice(Math.min(start,end), Math.max(start, end)+ 1).prop('checked', lastChecked.checked);
                    }

                    lastChecked = check[0];
                });
            }, filter);
        }

        function serviceGetLiquidacaoCredito(cb, filter) {
            var options = {
                url: '/api/public/ecm/dataset/search',
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify({
                     "datasetId" : "dsLiquidacaoCredito",
                     "filterFields" : ["data_inicio", filter.data_inicio, "data_fim", filter.data_fim, "num_pa", filter.num_pa],
                     "limit" : "1000"
                 }),
                loading: true
            };

            FLUIGC.ajax(options, cb);
        }

        function selectListaPA(cb) {
            var options = {
                url: '/api/public/ecm/dataset/search',
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify({
                     "datasetId" : "dsLiquidacaoCredito",
                     "filterFields" : ["_action", "selectListaPA"],
                     "limit" : "1000"
                 }),
                loading: true
            };

            FLUIGC.ajax(options, cb);
        }

        function serviceCreateIncorporacaoBndu(cb) {
            var fields = {};
            
            var inputSelecioados = $('[name="selecionado[]"]:checked').map(function () { return this.value }).get();
            
            var selecionados = liquidacaoCredito.filter(function(selecionado) {
                return inputSelecioados.indexOf(selecionado.Id) !== -1;
            });
            
            var i = 1;
            var totalOp = 0;
            
            for (const selecionado of selecionados) {
                
                console.log('Selecionado', selecionados);
                
                fields['id_operacao___' + i] = selecionado.Id;
                
                if (selecionado.DataBaixa) {
                    fields['data_operacao___' + i] = moment(selecionado.DataBaixa).format('DD/MM/YYYY');
                }
                
                fields['numero_contrato_operacao___' + i] = selecionado.NumContratoCredito;
                fields['valor_operacao___' + i] = selecionado.ValorContrato;
                            
                totalOp += money2Number(selecionado.ValorContrato);
                
                i += 1;
            }
            
            fields['valor_total_op'] = number2Money(totalOp);
            fields['numero_cooperativa'] = cooperativaId;
            fields['anexos'] = "[]";
            fields['total_operacoes'] = i - 1;


            var options,
            url = '/bpm/api/v1/processes/incorporacao_bndu/start',
            options = {
                url: url,
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                headers: {
                    // Por algum motivo não está incluindo sozinho no servidor da sicoob
                    'Authorization': 'Bearer ' + getCookie('jwt.token')
                },
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

        function criarIncorporacao() {
            serviceCreateIncorporacaoBndu(function(err, data) {
                $('[data-criar-incorporacao]').attr("disabled", true);
                
                parent.window.onbeforeunload = undefined;
                parent.window.location.href = `${parent.WCMAPI.tenantURI}/pageworkflowview?app_ecm_workflowview_processInstanceId=${data.processInstanceId}&app_ecm_workflowview_currentMovto=2&app_ecm_workflowview_taskUserId=${parent.WCMAPI.userCode}&app_ecm_workflowview_managerMode=false`;
            });
        }

        return {
            init,
            search,
            criarIncorporacao,
        };

    })(); // Classificação

    /**
     * Bens
     */
    var Bens = (function() {

        var Devedores = (function() {

            function init() {

            }

            function add(bem) {
                var $bemRow = $(bem).closest('.bem-row');
                var bemId = $bemRow.find('[id^="bem_id___"]').val();

                var number = wdkAddChild('bndu_devedores');
                var devedorRow = document.getElementById('devedor-row___' + number);

                $('#devedor_bem_id___' + number).val(bemId);

                $bemRow.find('[id^="devedores-rows"]').append(devedorRow.outerHTML);
                devedorRow.remove();
            }

            function remove(devedor) {
                $(devedor).closest('.devedor-row').remove();
            }

            function render($bem) {
                var bemId = $bem.find('[id^="bem_id___"]').val();
                var $devedoresRows = $bem.find('[id^="devedores-rows"]');

                $('[tablename="bndu_devedores"]')
                    .find('tr:not([detail])')
                    .find('[id^="devedor-row"]')
                    .each(function () {
                        var $devedor = $(this.outerHTML);
                        var devedorBemId = $devedor.find('[name^="devedor_bem_id___"]').val();

                        if (bemId == devedorBemId) {
                            $devedoresRows.append($devedor[0]);
                            this.remove();
                        }
                });

                if (IDENTIFICACAO_DO_BEM_MOD == 'VIEW') {
                    $('.add_bem, .remover-devedor, .add-devedor, .remove-bem').remove();
                }
            }

            return {
                init,
                add,
                render,
                remove
            };

        })();


        function init() {

            Devedores.init();

            if (CURRENT_STATE != 73 && CURRENT_STATE != 0) {
                render();
            } else {
                if ($('[tablename="bndu_bem"]').find('tr').length) {
                    render();
                } else {
                    add();
                } 
            }
        }

        function afterAppend() {
            $('.money').maskMoney({
                allowZero: true,
                thousands: '.',
                decimal: ',',
                precision: 2,
                affixesStay: false
            });

            FLUIGC.calendar('input.calendar:not([readonly])');
            FLUIGC.calendar('input.dataLaudoCalendar:not([readonly])', { minDate: moment().subtract(6, 'month').format('DD/MM/YYYY') });
            
            $('input.dataLaudoCalendar:not([readonly])').focusout(function(){
            	if (!moment(this.value, 'DD/MM/YYYY').add(1, 'day').isAfter(moment().subtract(6, 'month'))) {
            		this.value = '';
            		FLUIGC.toast({ message: 'A data não pode ser inferior a seis meses', type: 'danger' });
            	}
            });
            
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

            atualizaValores();
        }

        function atualizaValores() {
            var valorTotalDosBens = 0;
            var totalBens = 0;
            var bemValorMaior = 0;

            var inputsDosBens = $('#bem-rows').find('input[id^="valor_do_bem__"]');

            if (inputsDosBens.length == 0) {
                return;
            }

            for (const inputBem of inputsDosBens) {
                totalBens += 1;

                if (inputBem.value != "") {
                    var valor = Number(parseFloat(inputBem.value.replace(/\./g, '').replace(',', '.')).toFixed(2));
                    valorTotalDosBens += valor;

                    if (valor > bemValorMaior) {
                        bemValorMaior = valor;
                    }
                }
            }

            var valorTotalOp = $('#valor_total_op').valOrText();
            valorTotalOp = money2Number(valorTotalOp);

            var receitaRealizar = (valorTotalOp > bemValorMaior ? bemValorMaior : valorTotalOp);

            $('[name="valor_a_ser_contabilizado"]').val(number2Money(receitaRealizar));

            $('#total_bens').val(totalBens);
            $('#valor_total_dos_bens').val(Number(valorTotalDosBens).toLocaleString('pt-BR'));
        }


        function render() {
            $bemRows = $('#bem-rows');

            $('[tablename="bndu_bem"]')
                .find('tr:not([detail])')
                .find('[id^="bem-row"]')
                .each(function () {
                    var $bem = $(this.outerHTML);
                    $bemRows.append($bem[0]);
                    Devedores.render($bem);
                    this.remove();
                });

            afterAppend();
        }

        function add() {
            var number = wdkAddChild('bndu_bem');
            var bemRow = document.getElementById('bem-row___' + number);
            var lastNumber = Number($('[name^="bem_id___"]').last().val()) + 1 || 1;

            $('#bem-rows').append(bemRow.outerHTML);
            bemRow.remove();

            $('#bem_id___' + number).val(lastNumber);

            Devedores.add(document.getElementById('add-devedor-btn___' + number));

            afterAppend();

            return number;
        }

        function remove(bem) {
            $(bem).closest('.bem-row').remove();

            atualizaValores();
        }

        return {
            Devedores,
            init,
            add,
            remove,
            atualizaValores
        };
    })(); // Bens

    /**
     * Anexos
     */
    var Anexo = (function () {

        var selectedAnexoLstId = 0;
        var buscaDocumentosModal;

        var templateDevedorAnexo = Handlebars.compile(`
            <ul class="devedor-anexo">
                {{#anexosLst}}
                <div ondrop="Bndu.Anexo.onDrop({{ id }}, event)" ondragover="Bndu.Anexo.allowDrop(event)" class="row lista-anexo">

                    <li class="col-xs-12 col-md-8 fs-no-margin"> {{{ descricao }}}</li>

                    <div class="col-xs-12 col-md-4 anexo-actions">
                        <div class="btn-anexar">

                            <label for="upload_teste_{{ id }}" class="btn btn-primary hidden-mode-view"><i class="fluigicon fluigicon-paperclip icon-xs"></i> Anexar</label>
                            <input type="file"
                                   id="upload_teste_{{ id }}"
                                   name="upload_teste_{{ id }}"
                                   data-url="/ecm/upload"
                                   data-anexo-id="{{ id }}"
                                   style="display: none;"
                                   class="fileupload">
                        </div>

                        <div class="btn-anexar">
                            <button class="btn btn-buscar" data-open-modal onclick="Bndu.Anexo.modal({{ id }});">
                                <i class="fluigicon fluigicon-search icon-xs"></i>Buscar
                            </button>
                        </div>
                    </div>
                    <div class="col-xs-12">
                        <div class="anexados">
                            {{#anexos}}
                            <span>
                                <a href="javascript:Bndu.Anexo.preview({{ id }})">{{ name }}</a>
                                <a class="hidden-mode-view" href="javascript:Bndu.Anexo.remove({{ ../id }}, {{ id }})">
                                    <i class="flaticon flaticon-close icon-xs"></i>
                                </a>
                            </span>
                            {{/anexos}}
                        </div>
                    </div>
                </div>
                {{/anexosLst}}
            </ul>`);

        /* NUNCA ALTERAR O NÚMERO DA DESCRICAO DO ANEXO */
        var anexosLst = [
            new AnexoDesc(1, "Dação em pagamento", "Laudo de avaliação do bem emitido há no máximo 06 (seis) meses, elaborado na forma do artigo 2º desta Circular;"),
            new AnexoDesc(2, "Dação em pagamento", "Cópia de documento que contenha o despacho do escalão detentor de alçada, acerca do acolhimento da proposta da dação;"),
            new AnexoDesc(3, "Dação em pagamento", `Documentos que comprovem o domínio:
							            			<ul>
							            				<li>Imóveis - Certidão do cartório de registro de imóveis em que conste o registro da transferência do imóvel para a cooperativa;</li>
							            				<li>Veículos - Certificado de propriedade de veículo, já em nome da cooperativa (DUT);</li>
							            				<li>Outros Bens – Nota Fiscal.</li>
							            			</ul>`),
            new AnexoDesc(4,  "Dação em pagamento", "Documento que comprove a posse do bem (declaração nos moldes do Anexo “III”) por parte da cooperativa;"),
            new AnexoDesc(5,  "Dação em pagamento", "Extrato Empréstimo/Financiamento demonstrando a liquidação."),
            
            new AnexoDesc(6,  "Alienação Fiduciária bem Imóvel", "Cópia do instrumento de crédito e do laudo de avaliação do bem imóvel que determinou o valor constante no contrato/cédula;"),
            new AnexoDesc(7,  "Alienação Fiduciária bem Imóvel", "Laudo de avaliação do bem, emitido há no máximo 06 (seis) meses, elaborado na forma do artigo 2º desta Circular;"),
            new AnexoDesc(8,  "Alienação Fiduciária bem Imóvel", "Certidão em que conste a averbação, na matrícula do imóvel, da consolidação da propriedade em nome da cooperativa;"),
            new AnexoDesc(9,  "Alienação Fiduciária bem Imóvel", "Declaração de posse do bem (declaração nos moldes do Anexo “III”) por parte da cooperativa;"),
            new AnexoDesc(10, "Alienação Fiduciária bem Imóvel", "Cópia de ata que indique o resultado do(s) leilão(ões) realizado(s) em cumprimento do disposto no artigo 27 da Lei 9.514/1997, ou seja, constando o 1° leilão realizado 30 dias após a averbação da matrícula em nome da cooperativa e o 2° leilão em 15 dias seguinte"),
            new AnexoDesc(11, "Alienação Fiduciária bem Imóvel", "Extrato do contrato/cédula de crédito demonstrando a liquidação."),

            new AnexoDesc(12, "Alienação Fiduciária bem Móvel", "Cópia do instrumento de crédito;"),
            new AnexoDesc(13, "Alienação Fiduciária bem Móvel", "Laudo de avaliação do bem, emitido há no máximo 06 (seis) meses, elaborado na forma do artigo 2º desta Circular;"),
            new AnexoDesc(14, "Alienação Fiduciária bem Móvel", "Cópia da decisão judicial que autorizou a transferência do bem para o nome da cooperativa;"),
            new AnexoDesc(15, "Alienação Fiduciária bem Móvel", "Cópia de documento que comprove o domínio (no caso de veículo automotor, o respectivo certificado de registro já em nome da cooperativa);"),
            new AnexoDesc(16, "Alienação Fiduciária bem Móvel", "Declaração de posse do bem (declaração nos moldes do Anexo “III”) por parte da cooperativa."),

            
            new AnexoDesc(17, "Adjudicação", "Cópia do documento que contenha a decisão do escalão detentor de alçada acerca da Adjudicação do(s) bem(ns);"),
            new AnexoDesc(18, "Adjudicação", "Cópia de documento judicial que indique, no resultado do leilão, a adjudicação do(s) bem(ns) à cooperativa;"),
            new AnexoDesc(19, "Adjudicação", "Cópia do instrumento de crédito que motivou o processo de Adjudicação;"),
            new AnexoDesc(20, "Adjudicação", "Laudo de avaliação do bem emitido há no máximo 06 (seis) meses, elaborado na forma do artigo 2º desta Circular;"),
            new AnexoDesc(21, "Adjudicação", "Certidão em que conste a averbação, na matrícula, da consolidação da propriedade em nome da cooperativa (no caso de imóvel); certificado de registro de veículo automotor, já em nome da cooperativa (no caso de veículos); declaração/comprovante de posse do bem (declaração nos moldes do Anexo “III”).")
       ];

        function init() {
            $('[name="anexos"]').hide();

            origem = ORIGEM_VALUE;

            console.log('Origem: ', origem);

            render();

            $('#origem').change(function() {
                origem = this.value;
                render();
            });

        }

        function anexosByOrigem() {
            return anexosLst.filter(function(anexoDesc) {
                return anexoDesc.origem == origem;
            });
        }

        function todosAnexos() {
            var anexosOrigem = Anexo.anexosByOrigem();

            for (var anexo of anexosOrigem) {
                if (anexo.anexos.length == 0) {
                    return false;
                }
            }

            return true;
        }

        function validate() {
            var isValid = true;
            var todos = todosAnexos();

            $('#todos_documentos').val(todos ? 'Y' : 'N');

            if (CURRENT_STATE == 0 || CURRENT_STATE == 68) {
                if (!todos) {
                    isValid = confirm('Está faltando anexo, deseja continuar?');
                }
            }
            return isValid;
        }


        function AnexoDesc(id, origem, descricao, anexos = []) {
            this.id = id;
            this.origem = origem;
            this.descricao = descricao;
            this.anexos = anexos;
            this.toRemove = false;
            this.novo = false;
        }

        function render() {
            var $anexos = $('[name="anexos"]');
            var anexoObj = JSON.parse($anexos.valOrText());
            var anexosLst = anexosByOrigem();

            for (const anexoLst of anexosLst) {
                anexoLst.anexos = anexoObj.filter(anexo => anexo.lst == anexoLst.id);
            }

            var rendered = (function() {
                $buscaAnexo = $('#busca-anexo');

                if  (anexosLst.length) {
                    $buscaAnexo.show();
                    $('#check_docs').show();
                    return  templateDevedorAnexo({ anexosLst });
                }

                $buscaAnexo.hide();

                return `<div class="alert alert-info alert-dismissible" role="alert">
                    <strong>Origem não selecionada!</strong> Selecione a origem.
                </div>`;
            })();

            $('#anexos').html(rendered);

            if (IDENTIFICACAO_DO_BEM_MOD == 'VIEW') {
                $('.anexo-actions').remove();
                $('.anexados').find('.hidden-mode-view').remove();
            }

            function additionalComments() {
                console.log('Comentários adicionais');

                var additionalComments = "";

                $('[id^="devedor-row___"]').each(function() {

                    $this = $(this);

                    nomeDevedor = $this.find('[id^="nome_devedor"]').val();
                    cpfCnpjDevedor = $this.find('[id^="cpf_cnpj_devedor___"]').val();

                    additionalComments += `${nomeDevedor} - ${cpfCnpjDevedor}\n`
                });

                console.log('Additional comments', additionalComments);

                return additionalComments;
            }

            $('#anexos').find('.fileupload').each(function() {
                var $fileUpload = $(this);

                $fileUpload.fileupload({
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
                                    "parentId": grupoCooperativa.data.BNDUPasta,
                                    "additionalComments": additionalComments(),
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
                                    add($fileUpload.attr('data-anexo-id'), data.content.id, data.content.phisicalFile);
                                }
                            });
                        });
                    }
                });
            });
            
            // Credito section
            if (origem == 'Dação em pagamento') {
                $('#credito-section').show();
            } else {
            	$('#credito-section').hide();
            }
        }

        function add(anexoLstId, documentId, documentName) {
            var $anexos = $('[name="anexos"]');
            var anexoObj = JSON.parse($anexos.val());
            var anexo;

            anexo = { "id": documentId, "name": documentName, "lst": anexoLstId };

            anexoObj.push(anexo);

            $anexos.val(JSON.stringify(anexoObj));

            if (buscaDocumentosModal) {
                buscaDocumentosModal.remove();
            }

            render();
        }

        function remove(anexoLst, documentId) {
            var $anexos = $('[name="anexos"]');
            var anexoObj = JSON.parse($anexos.val());

            anexoObj = anexoObj.filter(anexo => anexo.id != documentId || anexo.lst != anexoLst);
            $anexos.val(JSON.stringify(anexoObj));

            render();
        }

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

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function onDrag(ev) {
            $('.devedor-anexo').find('li').css({ border: '1px solid red' });

            ev.dataTransfer.setData("id", ev.target.dataset.docId);
            ev.dataTransfer.setData("name", ev.target.dataset.docName);
        }

        function onDragEnd(ev) {
            $('.devedor-anexo').find('li').css({ border: '0' });
        }

        function onDrop(id, ev) {
            var documentId = ev.dataTransfer.getData("id");
            var documentName = ev.dataTransfer.getData("name");

            add(id, documentId, documentName);
        }

        function modal(anexoLstId) {
            selectedAnexoLstId = anexoLstId;

            descricaoAnexo = anexosLst.filter(function(anexoDesc) {
                return anexoDesc.id == selectedAnexoLstId;
            })[0];

            buscaDocumentosModal = FLUIGC.modal({
                title: 'Buscar Documentos',
                content: `
                    <div id="busca-anexo" class="col-md-12 busca-form">
                     <span class="descricao-anexo">${descricaoAnexo.descricao}</span>
                        <div class="barra-busca">
                            <input type="text" name="busca" id="busca-documento"/><button class="btn btn-primary btn-buscar" onclick="Bndu.Anexo.buscarAnexo()"><i class="fluigicon fluigicon-search icon-xs"></i>Buscar</button>
                        </div>

                        <div id="busca-resultado">
                        </div>
                    </div>`,
                id: 'busca-modal',
                actions: [{
                    'label': 'Anexar',
                    'bind': 'data-open-modal',
                }, {
                    'label': 'Cancelar',
                    'autoClose': true
                }]
            }, function (err, data) {
                if (err) {
                    // do error handling
                } else {
                    // do something with data
                }
            });
        }

        function buscarAnexo() {
            var $buscaResultado = $("#busca-resultado");
            var busca = $('#busca-documento').val();

            $.ajax({
                async : true,
                type : "POST",
                contentType: "application/json",
                url : '/api/public/search/advanced',

                data: JSON.stringify({
                    "searchType": "DOCUMENT",
                    "pattern": busca,
                    "ordering": "RELEVANT",
                    "limit": "10",
                    "contentSearch": "false",
                    "types": ["DOCUMENT"],
                    "documentTypes": ["FILEDOCUMENT"],
                    "folderToSearch": grupoCooperativa.data.BNDUPasta
                }),

                error: function() {
                },

                success: function(data) {
                    if (!data.content.items.length) {
                        $buscaResultado.html('<span class="no-result">Nenhum documento encontrado</span>');
                        return;
                    }

                    $buscaResultado.html("");

                    var resultado = '';

                    for (const item of data.content.items) {
                        resultado +=`
                            <li
                                data-doc-id="${item.fields.DocumentId}"
                                data-doc-name="${item.fields.DocumentDescription}"
                                onclick="javascript:Bndu.Anexo.add(${selectedAnexoLstId}, ${item.fields.DocumentId}, '${item.fields.DocumentDescription}')">
                                    ${item.fields.DocumentDescription}
                            </li>
                        `;
                    }

                    $buscaResultado.html(`<ul class="bloco-resultados">${resultado}</ul>`);
                },
            });
        }

        return {
            init,
            add,
            preview,
            modal,
            validate,
            anexosByOrigem,
            remove,
            allowDrop,
            onDrag,
            onDragEnd,
            onDrop,
            buscarAnexo
        }
    })(); // Anexo

    /**
     * Operacoes
     */
    var Operacoes = (function() {
        var totalDeOperacoes = 0;
        var dataMenorOperacao;

        function afterAppend() {
            $('.money').maskMoney({
                allowZero: true,
                thousands: '.',
                decimal: ',',
                precision: 2,
                affixesStay: false
            });

            FLUIGC.calendar('.calendar:not([readonly])');
        }

        function add() {
            var number = wdkAddChild('bndu_operacoes');

            var operacaoRow = document.getElementById('operacao-row___' + number)
            var $operacaoRows = $('#operacao-rows');

            $operacaoRows.append(operacaoRow.outerHTML);
            operacaoRow.remove();

            totalDeOperacoes = $operacaoRows.find('.operacao-row').size();

            afterAppend();
        }

        function remove() {
            var $operacaoRows = $('#operacao-rows');
            $operacaoRows.find('.operacao-row').last().remove();

            totalDeOperacoes = $operacaoRows.find('.operacao-row').size();
        }

        function atualizaValor() {
            var valorTotalDasOperacoes = 0;
            var inputDasOperacoes = $('#operacao-rows')
                .find('[name=^"_data_operacao___"]');

            if (inputDasOperacoes.length == 0) {
                return;
            }

            for (const valorOperacao of inputDasOperacoes) {

          
                console.log('data', valorOperacao.value);

                if (valorOperacao.value != "") {
                    // valorTotalDasOperacoes += money2Number(valorOperacao.value);
                }
            }

            // $('[name="valor_total_op"]').val(number2Money(valorTotalDasOperacoes));
        }

        function render() {
            $operacaoRows = $('#operacao-rows');

            $('[tablename="bndu_operacoes"]')
                .find('tr:not([detail])')
                .find('[id^="operacao-row"]')
                .each(function () {
                    $operacaoRows.append(this.outerHTML);
                    this.remove();
            });

            totalDeOperacoes = $operacaoRows.find('.operacao-row').size();
        }

        function init() {
            render();

            $('input[name="total_operacoes"]').change(function() {

                if (this.value > 30) {
                    this.value = 30;
                }

                if (this.value > totalDeOperacoes) {
                    var totalAdicionar = this.value - totalDeOperacoes;

                    for (var i = 0; i < totalAdicionar; i++) {
                        add();
                    }
                } else {
                    var totalRemover = totalDeOperacoes - this.value;

                    for (i = 0; i < totalRemover; i++) {
                        remove();
                    }
                }
            });
        }

        return {
            init,
            atualizaValor
        };
    })(); // Operações
    
    
    /**
     * Credito conta corrente
     */
    var CreditoContaCorrent = (function() {
        var totalDeOperacoes = 0;

        function afterAppend() {
            $('.money').maskMoney({
                allowZero: true,
                thousands: '.',
                decimal: ',',
                precision: 2,
                affixesStay: false
            });

            FLUIGC.calendar('.calendar:not([readonly])');
        }

        function add() {
            var number = wdkAddChild('bndu_credito_conta');

            var creditoContaRow = document.getElementById('credito-conta-row___' + number)
            var $creditoContaRows = $('#credito-conta-rows');

            $creditoContaRows.append(creditoContaRow.outerHTML);
            creditoContaRow.remove();

            afterAppend();
        }

        function remove() {
        	var $creditoContaRows = $('#credito-conta-rows');
        	$creditoContaRows.find('.credito-conta-row').last().remove();
        }

        function render() {
        	var $creditoContaRows = $('#credito-conta-rows');

            $('[tablename="bndu_credito_conta"]')
                .find('tr:not([detail])')
                .find('[id^="credito-conta-row"]')
                .each(function () {
                	$creditoContaRows.append(this.outerHTML);
                    this.remove();
            });
            
            if (IDENTIFICACAO_DO_BEM_MOD == 'VIEW') {
                $('.credito-conta-remover, #add-conta').remove();
            }
        }

        function init() {
            render();
        }

        return {
            init,
            add,
            remove
        };
    })(); // Credito conta corrente

    function beforeSendValidate(numState, nextState) {

        if (CURRENT_STATE == 0) {
            Classificacao.criarIncorporacao();

            return false;
        }

        var isValid = true;

        if (!origem) {
            alert('Por favor, selecione a origem');
            return false;
        }

        isValid = Anexo.validate();

        if (CURRENT_STATE == 61) {
            if (! $('#lancamento_confirmado_sisbr').prop('checked')) {
                alert('Por favor, confirme o lançamento no SISBR');
                return false;
            }
        }

        if (isValid) {
            var complementoAdd = jQuery('#complemento_add').val();

            if (complementoAdd != "" && movementSequence != undefined) {
                var aprovacao = $('[name="' + (CURRENT_STATE == 26 ? 'liberar_excecao' : 'aprovacao_documentos') + '"]:checked').val();
                var complementoAddValue = `<strong>${aprovacao == 'Y' ? 'Aprovado' : 'Recusado'}</strong>: ${complementoAdd}`;

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

    function tabsForm() {
		$('#tabs a').click(function(event) {
			event.preventDefault();
			$(this.hash).tab('show');
		});
        
        $('#selecionar-operacao-tab, #analise-tab, #excecao-tab').hide();

        $('#formulario-tab').tab('show').show();

        if (CURRENT_STATE == 0) {
            $('#selecionar-operacao-tab').tab('show').show();
            $('#tabs-container').hide();
        } else if (CURRENT_STATE == 26) {
	        $('#excecao-tab').tab('show').show();
	    } else if (CURRENT_STATE == 37) {
	        $('#analise-tab').tab('show').show();
	    } else if (CURRENT_STATE == 68) {
	        $('#excecao-tab').show();
	        $('#analise-tab').show();
	        $('.complemento-form').hide();
	    }
	}

    function loadComplements(state) {
        $.ajax({
            type : "GET",
            contentType: "application/json",
            url : `/api/public/2.0/workflows/findObservations/${NUM_PROCES}/${state}/0`,
            success: function(data) {
                $('#complementos-' + (state == 26 ? 'excecao' : 'analise') + '-list').html(`
                    ${data.content.map(observacao => `
                        <div class="user-info">
                            <span class="nome">${observacao.colleagueId} ${(state == 26 ? 'excecao' : 'analise')}</span>
                            <span class="data">${moment(observacao.observationDate).format('D/MM/YYYY à\\s hh:mm:ss')}</span>
                        </div>
                        <div class="parecer-text">${observacao.observation}</div>
                    `).join('')}
                `);
            }
        });
    }

    function init() {
        Classificacao.init();


        // Remove aba do campo de anexo
        $('#tab-attachments', window.parent.document).parent().remove();  
        
        
        if (CURRENT_STATE == 0) {
            var $workflowActions = $('#workflowActions', window.parent.document);
        
            $workflowActions.removeClass('btn-group');
            $workflowActions.find('.dropdown-toggle').remove();
        }
        

        moment.locale('pt-BR');

        cooperativaId = $('#numero_cooperativa').valOrText();

        if (cooperativaId == undefined || cooperativaId == "") {
            $.ajax({
                type : "GET",
                contentType: "application/json",
                async: false,
                url : `/api/public/2.0/groups/findGroupsByUser/${parent.WCMAPI.userCode}`,
                error: function() {
                    FLUIGC.toast({ message: 'Não foi possível recuperar o ID da Cooperativa', type: 'danger' })
                },
                success: function(data) {
                    data = data.content.filter(function(group) { return /COOPERATIVA-[0-9]{4}/.test(group.code) == true });
        
                    if (data.length) {
                        cooperativaId = data[0].code.replace('COOPERATIVA-', '');
                    }
                }
            });
      
        }
        
        console.log('Nr Cooperativa:', cooperativaId);
        $('#numero_cooperativa').val(cooperativaId);


        if (cooperativaId) {
            // Pega informacoes do grupo
            $.ajax({
                type : "GET",
                async: false,
                contentType: "application/json",
                url : '/portal/api/rest/wcm/service/group/findGroupDataByCode?groupCode=COOPERATIVA-' + cooperativaId,
                error: function() {
                    FLUIGC.toast({ message: 'Não foi possível recuperar informações do grupo da Cooperativa', type: 'danger' })
                },
                success: function(data) {
                    for (const gropoData of data.content) {
                        grupoCooperativa.data[gropoData.key] = gropoData.value;
                    }
                }
            });

            if (grupoCooperativa.data.BNDUPasta == null) {
                FLUIGC.toast({ message: 'Não foi possível recuperar o id da pasta de upload do BNDU', type: 'danger' });
            } 

            console.log('BNDU Pasta:', grupoCooperativa.data.BNDUPasta);
        }
 
        if (NUM_PROCES > 0 && NUM_PROCES != 63) {
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

                    if (content.tasksInfo.length > 0
                        && content.tasksInfo[0].hasOwnProperty('movementSequence')) {
                        movementSequence = content.tasksInfo[0].movementSequence;
                    }
                }
            });
        }

        $('.complement-form-' + (CURRENT_STATE == 26 ? 'excecao' : 'analise'))
            .html(`<textarea class="form-control" name="complemento_add" id="complemento_add"></textarea>`);

        loadComplements(26);
        loadComplements(37);

        Bens.init();
        Anexo.init();
        Operacoes.init();
        CreditoContaCorrent.init();

        tabsForm();

        $('#numero_processo').html(`<span class="form-control">${NUM_PROCES == 0 ? '(Gerado ao criar o processo)' : '#' + NUM_PROCES}</span>`);

        $('#data').html(moment().format('D/MM/YYYY'));
        $('.data-hora').html(moment().format('D/MM/YYYY - HH:mm:ss'));

        $(".money").maskMoney({
            allowZero: true,
            thousands: '.',
            decimal: ',',
            precision: 2,
            affixesStay: false
        });

        $('#busca-documento').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                alert('hey');
                $('#btn-busca').trigger('click');
            }
        });

        $('#check_docs').hide();

        if (FORM_MODE == 'VIEW') {
            $('.hidden-mode-view').hide();
        }

        if (CURRENT_STATE != 61) {
            $('#lancamento_confirmado_sisbr_container').hide();
        } else {
            $('input, select').click(function() {
                copyInput(this);
                FLUIGC.toast({ message: this.value + ' copiado para área de transferência', type: 'success' });
            });
        }
    }

    return {
        init,
        Bens,
        Anexo,
        Operacoes,
        CreditoContaCorrent,
        Classificacao,
        beforeSendValidate
    };
})();

window.onload = function() { Bndu.init(); };

var beforeSendValidate = Bndu.beforeSendValidate;
