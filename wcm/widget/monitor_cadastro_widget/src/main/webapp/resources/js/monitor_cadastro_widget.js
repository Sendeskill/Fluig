//Aqui cria os processos das rows selecionadas
function serviceCreateMonitorCadastro(cb, data) {
    const options = {
        url: '/api/public/ecm/dataset/search',
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify({
                "datasetId" : "dsMonitorCadastro",
                "filterFields" : ["_action", "createMonitorCadastro", "data", data],
                "limit" : "1000"
            }),
        loading: true
    };
    FLUIGC.ajax(options, cb);
}

//Aqui faz a consulta das rows para a tabela
function serviceSearchMonitorCadastro(cb) {
    const options = {
        url: '/api/public/ecm/dataset/search',
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify({
            "datasetId" : "dsMonitorCadastro",
            "filterFields" : [
                "NumCooperativa", $('[name="cooperativa"]').val(),
                "NumPa", $('[name="PA"]').val(),
                "NomeCliente", $('[name="nome_cliente"]').val(),
                "Periodo1", $('[name="periodo_i"]').val(),
                "Periodo2", $('[name="periodo_t"]').val(),
                "statusSelect", $('[name="status_select"]').val()
            ],
            "limit" : "1000"
        }),
        loading: true
    };
    FLUIGC.ajax(options, cb);
}

$(function(){
    var resultadoPesquisa = [];

    FLUIGC.calendar('.calendar', {
        useCurrent: false
    });

    $('#btn-filtrar').on('click',function() {
        const tabela = $('#monitor-table').find('tbody');
        const status = $('[name="status_select"]').val();

        var icon;
        if(status === 'D')
            icon = 'flaticon-circle-initial';
        else if(status === 'A')
            icon = 'flaticon-check-circle analisado';
        else
            icon = 'flaticon-edit-square em-analise';
    
        $('#btn-analisar').hide();
        tabela.html('');

        serviceSearchMonitorCadastro(function(err, data) {
            var i = 0;

            for (let monit of data.content) {
                monit.data     = moment(monit.data).format('DD/MM/YYYY');
                monit.data_ult = moment(monit.data_ult).format('DD/MM/YYYY');
    
                resultadoPesquisa[i] = monit;
                
                tabela.append(`
                    <tr class="analisar">
                        <td>
                            <div class="custom-checkbox custom-checkbox-sicoob">
                                <input type="checkbox" name="status_${i}" id="status_${i}" value="${i}"/>
                                <label for="status_${i}"></label>
                            </div>
                        </td>
                        <td class="status"><i class="flaticon ${icon} icon-sm"></i></td>
                        <td class="cooperativa">${monit.coop}</td>
                        <td>${monit.pa}</td>
                        <td>${monit.cod_cliente}</td>
                        <td>${monit.documento}</td>
                        <td>${monit.nome_cliente}</td>
                        <td>${monit.data}</td>
                        <td>${monit.data_ult}</td>
                    </tr>
                `);
                
                i++;
            }
            
            $('#btn-analisar').show();
        });
    });
    
    $('#btn-analisar').on('click',function() {
        var selecionados = []
    
        $('[name^="status_"]:checked').each(function(index, element) {
            selecionados.push(resultadoPesquisa[element.value]);
        });
    
        const filtro_data = JSON.stringify(selecionados);
    
        serviceCreateMonitorCadastro(function(err, data) {
            console.log('DataInsert', data);
        }, filtro_data);
    });
});