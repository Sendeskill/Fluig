function displayFields(form, customHTML) {

    var CURRENT_STATE = getValue("WKNumState");
    var CURRENT_USER = getValue("WKUser");
    var IDENTIFICACAO_DO_BEM_MOD = 'EDIT';
    var ACTIVE = getValue("active");

    
    var indexOperacoes = form.getChildrenIndexes("bndu_operacoes");

    for (var i = 1; i <= indexOperacoes.length; i++) {
    	form.setEnabled('id_operacao___' + i, false);
    	form.setEnabled('data_operacao___' + i, false);
        form.setEnabled('valor_operacao___' + i, false);
        form.setEnabled('numero_contrato_operacao___' + i, false);
    }
    
    form.setEnabled('total_operacoes', false);
    form.setEnabled('valor_total_op', false);
    
    

    if (CURRENT_STATE != 0 && CURRENT_STATE != 73) {
    	 form.setEnabled('numero_cooperativa', false);
         form.setEnabled('origem', false);
    }
    

    if (CURRENT_STATE != 0 && CURRENT_STATE != 73 && CURRENT_STATE != 68) {
        IDENTIFICACAO_DO_BEM_MOD = 'VIEW';

        var indexBem = form.getChildrenIndexes("bndu_bem");
        var indexDevedores = form.getChildrenIndexes("bndu_devedores");
        var indexOperacoes = form.getChildrenIndexes("bndu_operacoes");
        var creditoConta = form.getChildrenIndexes("bndu_credito_conta");

        for (var i = 1; i <= indexBem.length; i++) {
            form.setEnabled('valor_do_bem___' + i, false);
            form.setEnabled('data_do_laudo_de_avaliacao___' + i, false);
            form.setEnabled('data_do_dominio_do_bem___' + i, false);
            form.setEnabled('descricao_do_bem___' + i, false);
        }

        for (var i = 1; i <= indexDevedores.length; i++) {
            form.setEnabled('nome_devedor___' + i, false);
            form.setEnabled('cpf_cnpj_devedor___' + i, false);
        }

        for (var i = 1; i <= indexOperacoes.length; i++) {
        	form.setEnabled('id_operacao___' + i, false);
            form.setEnabled('data_operacao___' + i, false);
            form.setEnabled('valor_operacao___' + i, false);
            form.setEnabled('numero_contrato_operacao___' + i, false);
        }
        
        for (var i = 1; i <= creditoConta.length; i++) {
        	form.setEnabled('data_operacao_conta___' + i, false);
            form.setEnabled('data_credito_conta___' + i, false);
            form.setEnabled('conta_operacao___' + i, false);
            form.setEnabled('valor_credito___' + i, false);
        }

        form.setEnabled('tipo_de_bem', false);

        form.setEnabled('valor_total_dos_bens', false);
        form.setEnabled('total_bens', false);
        form.setEnabled('valor_total_op', false);

        form.setEnabled('valor_rendas_atraso_60', false);
        form.setEnabled('valor_a_ser_contabilizado', false);
        form.setEnabled('receitas_a_realizar', false);

        form.setEnabled('total_operacoes', false);
        form.setEnabled('data_baixa', false);
        
        if (CURRENT_STATE != 26) {
            form.setEnabled('liberar_excecao', false);
        }

        if (CURRENT_STATE != 37) {
            form.setEnabled('aprovacao_documentos', false);
        }
    }


    if (CURRENT_STATE != 61) {
        form.setEnabled('lancamento_confirmado_sisbr', false);
    }

    customHTML.append('<script>');
    customHTML.append("var IDENTIFICACAO_DO_BEM_MOD = '" + IDENTIFICACAO_DO_BEM_MOD + "';");
    customHTML.append("var CURRENT_STATE = " + CURRENT_STATE + ";");
    customHTML.append("var CURRENT_USER = '" + CURRENT_USER + "';");
    customHTML.append("var NUM_PROCES = " + getValue("WKNumProces") + ";");
    customHTML.append("var FORM_MODE = '" + form.getFormMode() + "';");
    customHTML.append("var ACTIVE = '" + JSON.stringify(ACTIVE) + "';");
    customHTML.append("var ORIGEM_VALUE = '" + form.getValue('origem') + "';");
    customHTML.append('</script>');
}
