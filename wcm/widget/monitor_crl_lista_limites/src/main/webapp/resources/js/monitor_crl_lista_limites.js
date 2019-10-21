var HelloWorld = SuperWidget.extend({
    message: null,

    init: function () {
        //code
    },

    bindings: {
        local: {
            'show-message': ['click_showMessage']
        }
    },

    showMessage: function () {
       console.log('Show message!');
    }
});

function number2Money(num) {

    if (isNaN(num)) {
        num = '0';
    }

    return Number(num).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

function money2Number(num) {
    return Number(num.replace(/[^0-9,]+/g, '').replace(',', '.'));
}


$(function() {

    var resultadoPesquisa = [];

    function serviceSearchMonitorCRL(cb) {
		var options = {
            url: '/api/public/ecm/dataset/search',
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({
                "datasetId" : "dsMonitorCRLVerify",
                "filterFields" : [
                    "NumCooperativa", $('[name="cooperativa"]').val(),
                    "NumPa", $('[name="PA"]').val(),
                    "NomeCliente", $('[name="nome_cliente"]').val(),
                    'Modelo', '',
                    'DataLimite', '',
                    'CpfCnpj', '',
                    'Periodo1', $('[name="periodo_i"]').val(),
                    'Periodo2', $('[name="periodo_t"]').val(),
                    'ValorLCA1', '',
                    'ValorLCA2', ''
                ],
                "limit" : "1000"
             }),
            loading: true
        };
        
		FLUIGC.ajax(options, cb);
    }
    
    function serviceCreateMonitorCRL(cb, data) {
        var options = {
            url: '/api/public/ecm/dataset/search',
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({
                 "datasetId" : "dsMonitorCRLVerify",
                 "filterFields" : ["_action", "createMonitorCRL", "data", data],
                 "limit" : "1000"
             }),
            loading: true
        };
    
        FLUIGC.ajax(options, cb);
    }


    $('[show-message]').click(function() {


        $tabela = $('#monitor-table').find('tbody');

        $tabela.html('');

        serviceSearchMonitorCRL(function(err, data) {

            var i = 0;

            for (let monit of data.content) {

                monit.ValorLCA = number2Money(monit.ValorLCA);
                monit.DataLimite = moment(monit.DataLimite).format('DD/MM/YYYY');

                resultadoPesquisa[i] = monit;

                $tabela.append(`
                <tr class="analisar">
                    <td>
                        <div class="custom-checkbox custom-checkbox-sicoob">
                            <input type="checkbox" name="status_${i}" id="status_${i}" value="${i}"/>
                            <label for="status_${i}"></label>
                        </div>
                    </td>
                    <td class="cooperativa">${monit.NumCooperativa}</td>
                    <td>${monit.NumPa}</td>
                    <td>${monit.CodigoCliente}</td>
                    <td>${monit.NomeCliente}</td>
                    <td>${monit.Modelo}</td>
                    <td>${monit.DataLimite}</td>
                    
                    <td>${monit.NRA}</td>
                    <td>${monit.Auto}</td>
                    
                    <td>R$ ${monit.ValorLCA}</td>
                    <td class="status"><i class="flaticon flaticon-circle-initial icon-sm"></i></td>
                </tr>
                `);

                i++;
            }
        });
    });

    $('#btn-analisar').click(function() {

        var selecionados = []

        $('[name^="status_"]:checked').each(function(index, element) {
            selecionados.push(resultadoPesquisa[element.value]);
        });

        var filtro_data = JSON.stringify(selecionados);

        serviceCreateMonitorCRL(function(err, data) {
            console.log('Data', data)
        }, filtro_data);
  
    });
    
    FLUIGC.calendar('.calendar', {
		useCurrent: false
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

    $('.CPF-CNPJ').mask(CpfCnpjMaskBehavior, cpfCnpjpOptions);
});
