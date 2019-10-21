var testes = [];

var teste;

function onChange(obj) {
    teste[obj.name] = obj.value;
}

function openModal(Id) {

    if (Id) {
        teste = testes[Id];
    } else {
        teste = {
            Id: -1,
            CodigoM20: "",
            Processo: "",
            NivelRisco: "",
            Teste: "",
            Local: "",
            Periodicidade: "",
            ProcedimentosVerificacao: ""
        };
    }

    function serviceSalvarTeste(cb, filter) {
		var options = {
            url: '/api/public/ecm/dataset/search',
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({
                 "datasetId" : "dsMonitorControle",
                 "filterFields" : ["_action", "saveOrUpdate", "data", filter.data],
                 "limit" : "1000"
             }),
            loading: true
        };
        
		FLUIGC.ajax(options, cb);
	}

    var myModal = FLUIGC.modal({
        title: Id ? `Editar: ${Id}` : 'Novo',
        content: `
            <input type="text" hidden name="Id" value="${teste.Id}" id="Id">

            <div class="form-group col-md-3 col-lg-2">
                <label for="CodigoM20">CodigoM20</label>
                <input type="text" name="CodigoM20" value="${teste.CodigoM20}" onChange="onChange(this)" class="form-control">
            </div>
            <div class="form-group col-md-4 col-lg-3">
                <label>NivelRisco</label>
                <input type="text" name="NivelRisco" value="${teste.NivelRisco}" onChange="onChange(this)" class="form-control">
            </div>
            <div class="form-group col-md-3">
                <label>Local</label>
                <input type="text" name="Local" value="${teste.Local}" onChange="onChange(this)" id="local" class="form-control">
            </div>
             <div class="form-group col-md-3 col-lg-2">
                <label>Periodicidade</label>
                <input type="text" name="Periodicidade" value="${teste.Periodicidade}" onChange="onChange(this)" class="form-control">
            </div>
            <div class="form-group col-md-6">
                <label>Processo</label>
                <input type="text" name="Processo" value="${teste.Processo}" onChange="onChange(this)" class="form-control">
            </div>
            <div class="form-group col-md-12">
                <label>Teste</label>
                <textarea name="Teste" rows="6" class="form-control" onChange="onChange(this)">${teste.Teste}</textarea>
            </div>
            <div class="form-group col-md-12">
                <label>Procedimentos</label>
                <textarea name="ProcedimentosVerificacao" rows="5" class="form-control" onChange="onChange(this)">${teste.ProcedimentosVerificacao}</textarea>
            </div>
        `,
        id: 'modal-teste',
        size: 'large',
        salvar: function() {
            console.log('Ok', 'caiu no salvar');
        },
        actions: [{
            'label': 'Deletar Teste',
            'bind': 'deletar-teste'
        },{
            'label': 'Salvar',
            'bind': 'salvar-teste'
        },{
            'label': 'Fechar',
            'autoClose': true
        }]
    }, function(err, data) {

        if(err) {
            // do error handling
        } else {

            $("[deletar-teste]").click(function() {
                serviceApagarTaskList(function() {
                    $('#teste-' + $('#Id').val()).remove();

                    myModal.remove();

                }, {Id: $('#Id').val()});
            });

            $("[salvar-teste]").click(function() {

                var filter = {
                    data: JSON.stringify(teste)
                };
    
                serviceSalvarTeste(function(err, data) {
                    var template = `
                        <td>${teste.Id}</td>
                        <td>${teste.CodigoM20}</td>
                        <td>${teste.Processo}</td>
                        <td>${teste.NivelRisco}</td>
                        <td>${teste.Teste}</td>
                        <td>${teste.Local}</td>
                        <td>${teste.Periodicidade}</td>
                        <td>${teste.ProcedimentosVerificacao}</td>
                    `;

                    if (teste.Id == -1) {
                        $('[data-filtro]').trigger('click');
                    } else {
                        testes[teste.Id] = teste;
                    
                        $('#teste-' + teste.Id).html(template);
                    }

                    myModal.remove();
                }, filter);
            });
        }
    });
}

function serviceCreateTaskList(cb, filtro) {
    var options = {
        url: '/api/public/ecm/dataset/search',
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify({
             "datasetId" : "dsMonitorControle",
             "filterFields" : ["_action", "createTaskList", "local", filtro.local,  "Cooperativa", filtro.Cooperativa, "PA", filtro.PA, "ano", filtro.ano],
             "limit" : "1000"
         }),
        loading: true
    };

    FLUIGC.ajax(options, cb);
}

function serviceApagarTaskList(cb, filtro) {
    var options = {
        url: '/api/public/ecm/dataset/search',
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify({
             "datasetId" : "dsMonitorControle",
             "filterFields" : ["_action", "apagar", "Id", filtro.Id],
             "limit" : "1000"
         }),
        loading: true
    };

    FLUIGC.ajax(options, cb);
}

function createTaskList() {
    serviceCreateTaskList(function() {

    }, { "local": $('#local2').val(), "Cooperativa": $('[name="Cooperativa"]').val(), "PA": $('[name="PA"]').val(), "ano": $('[name="ano"]').val() });
}

var HelloWorld = SuperWidget.extend({
    message: null,

    init: function () {
        this.serviceLocais(function(err, data) {
			$('[name="local"]').html('');

			for (let local of data.content) {
				$('[name="local"]').append(`<option value="${local.Local}">${local.Local}</option>`);
			}
		});
    },

    serviceLocais: function (cb) {
		var options = {
			url: '/api/public/ecm/dataset/search',
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify({
				 "datasetId" : "dsMonitorControle",
				 "filterFields" : ["_action", 'locais'],
				 "limit" : "1000"
			 }),
			loading: true
		};

		FLUIGC.ajax(options, cb);
    },

    bindings: {
        local: {
            'filtro': ['click_filtro']
        }
    },

    filtro: function() {
        this.serviceGetMonitorControle(function(err, data) {
            $('#classif-table').find('tbody').html('');
            testes =  [];

			for (const teste of data.content) {
                testes[teste.Id] = teste;

                var template = `<tr id="teste-${teste.Id}" data-open-modal onClick="openModal(${teste.Id})">
                    <td>${teste.Id}</td>
                    <td>${teste.CodigoM20}</td>
                    <td>${teste.Processo}</td>
                    <td>${teste.NivelRisco}</td>
                    <td>${teste.Teste}</td>
                    <td>${teste.Local}</td>
                    <td>${teste.Periodicidade}</td>
                    <td>${teste.ProcedimentosVerificacao}</td>
                </tr>`;

				$('#classif-table').find('tbody').append(template);
            }
        }, { local: $('[id="local"]').val() });
    },

    showMessage: function () {
        $div = $('#helloMessage_' + this.instanceId);
        $message = $('<div>').addClass('message').append(this.message);
        $div.append($message);
    },

    serviceGetMonitorControle: function (cb, filtro) {
		var options,
		url = '/api/public/ecm/dataset/search',
		options = {
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify({
                "datasetId" : "dsMonitorControle",
                "filterFields" : ["local", filtro.local],
			 	"limit" : "1000000"
			 }),
			loading: true
        };
        
		FLUIGC.ajax(options, cb);
	},
});
