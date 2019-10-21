function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	
	newDataset.addColumn('Item');
	newDataset.addColumn('Subitem');
	newDataset.addColumn('Descricao');
	newDataset.addColumn('Tipo');
	
	newDataset.addRow(["1", "", "O tipo de tomador está corretamente classificado?", "Regularizar"]);
	newDataset.addRow(["", "1.01", "O tomador foi indevidamente classificado como Pessoa Física Assalariada - o rendimento não é exclusivo do trabalho com vínculo empregatício ou de aposentadoria/pensão.", ""]);
	newDataset.addRow(["", "1.02", "O tomador foi indevidamente classificado como Pessoa Física Autônoma - não se trata de pessoa com atividade remunerada e sem vinculo empregatício permanente.", ""]);
	newDataset.addRow(["", "1.03", "O tomador foi indevidamente classificado como Pessoa Física Cartão e Cheque - não se trata de pessoa física que deseje se relacionar com apenas os negócios de cartão e cheque especial.", ""]);
	newDataset.addRow(["", "1.04", "O tomador foi indevidamente classificado como Pessoa Física Produtor Rural Maior - não possui renda bruta anual superior a R$ 1.760 mil.", ""]);
	newDataset.addRow(["", "1.05", "O tomador foi indevidamente classificado como Pessoa Física Produtor Rural Menor - não possui renda bruta anual inferior ou igual a R$ 1.760 mil.", ""]);
	newDataset.addRow(["", "1.06", "O tomador foi indevidamente classificado como Pessoa Física Profissional Liberal - não se trata de profissional que possui título de habilitação expedido legalmente, como advogados, médicos, que em geral, não possuem vínculo permanente de trabalho e são remunerados com base em honorários.", ""]);
	newDataset.addRow(["", "1.07", "O tomador foi indevidamente classificado como Pessoa Jurídica Faturamento Maior - não se trata de pessoa jurídica de grande porte que possui faturamento anual maior que R$ 4,8 milhões.", ""]);
	newDataset.addRow(["", "1.08", "O tomador foi indevidamente classificado como Pessoa Jurídica Faturamento Menor - não se trata de pessoa jurídica de pequeno e médio porte que possui faturamento anual menor ou igual a R$ 4,8 milhões.", ""]);
	newDataset.addRow(["", "1.09", "O tomador foi indevidamente classificado como Pessoa Jurídica Microempresa e MEI - não se trata de microempreendedor Individual que trabalha por conta própria e que se encontra legalmente registrado como pequeno empresário ou microempresa com receita bruta igual ou inferior a R$ 360 mil ao ano.", ""]);
	newDataset.addRow(["", "1.10", "O tomador foi indevidamente classificado como Pessoa Jurídica Recém Constituída - não possui menos de um ano de mercado.", ""]);
	newDataset.addRow(["", "1.11", "O tomador foi indevidamente classificado como Pessoa Jurídica Produtor Rural Maior - não se trata de pessoa jurídica produtor rural de grande porte que possui faturamento anual maior que R$ 1.760 mil.", ""]);
	newDataset.addRow(["", "1.12", "O tomador foi indevidamente classificado como Pessoa Jurídica Produtor Rural Menor - não se trata de pessoa jurídica produtor rural de pequeno e médio porte que possui faturamento anual menor ou igual a R$ 1.760 mil.", ""]);

	newDataset.addRow(["2", "", "As informações cadastrais foram atualizadas?", "Rever Procedimento"]);			
	newDataset.addRow(["", "2.01", "As informações cadastrais do tomador não foram atualizadas por ocasião da implantação do limite.", ""]);
			
	newDataset.addRow(["3", "", "Os dados de balanços, questionários e balanços perguntados, foram preenchidos corretamente/de forma consistente?", "Regularizar"]);
	newDataset.addRow(["", "3.01", "O questionário e/ou os balanços não foram adequadamente preenchidos.", ""]);
	newDataset.addRow(["", "3.02", "O questionário e/ou os balanços estão desatualizados.", ""]);
			
	newDataset.addRow(["4", "", "Foram realizadas as consultas nos cadastros de restritivos e no SCR?", "Rever Procedimento"]);	
	newDataset.addRow(["", "4.01", "Não foram atualizadas as consultas Serasa e Bacen.", ""]);
	newDataset.addRow(["", "4.02", "Não foram realizadas as consultas Serasa e Bacen.", ""]);
			
			
	newDataset.addRow(["5", "", "Caso o cliente possua anotação(ões) restritiva(s), a classificação do risco foi feita considerando o(s) tipo(s) e condição(ões) da(s) anotação(ões)?", "Regularizar"]);
	newDataset.addRow(["", "5.01", "A nota de risco não foi agravada conforme as condições e critérios definidos na tabela de restritivos.", ""]);
	newDataset.addRow(["", "5.02", "A nota de risco não foi agravada conforme as condições e critérios definidos na tabela de restritivos personalizada.", ""]);
			
	newDataset.addRow(["6", "", "Há parecer fundamentado para embasar a decisão de atribuir nota de risco menor que a técnica?", "Regularizar"]);
	newDataset.addRow(["", "6.01", "Não foi embasada, com parecer fundamentado, a decisão de melhoria em até 3 níveis da nota de risco do associado que apresentou NRT entre \"R1\" e \"R20\" e que não possui anotação restritiva absoluta.", ""]);
	newDataset.addRow(["", "6.02", "Não foi embasada, com parecer fundamentado, a decisão de flexibilização para até \"R16\" da nota de risco do associado que apresentou NRT \"R99\" caso não tenha apresentado anotações restritivas absolutas ou relativas.", ""]);
	newDataset.addRow(["", "6.03", "Houve melhora da nota de risco de associado que apresentou anotação restritiva absoluta.", ""]); 
	
	newDataset.addRow(["7", "", "O Limite Atribuído foi aprovado em conformidade com o Limite Técnico?", "Regularizar"]);
	newDataset.addRow(["", "7.01", "O Limite de Crédito não foi atribuído de acordo com Limite Técnico apurado pela Cooperativa (CRL, CALCRED ou Met. Próp.).", ""]);
	newDataset.addRow(["", "7.02", "O Limite de Crédito foi atribuído em montante superior ao sugerido pela Central.", ""]);
    newDataset.addRow(["", "7.03", "O Limite de Crédito foi atribuído sem análise da Central.", ""]);
	newDataset.addRow(["", "7.04", "O portfólio não foi distribuído em conformidade aos limites técnicos aprovados.", ""]);
	
	newDataset.addRow(["8", "", "O Limite foi deferido em alçada competente?", "Regularizar"]);
	newDataset.addRow(["", "8.01", "O Limite de Crédito não foi deferido pela alçada competente da cooperativa.", ""]);
	newDataset.addRow(["", "8.02", "O Limite de Crédito foi atribuído em montante superior ao determinado pela alçada da Central.", ""]);
	newDataset.addRow(["", "8.03", "O Limite de Crédito foi atribuído sem envio para análise e posicionamento da alçada da Central.", ""]);
	
	newDataset.addRow(["9", "", "O prazo de vigência do limite foi cadastrado em conformidade?", "Regularizar"]);
	newDataset.addRow(["", "9.01", "Em se tratando de Limite de Crédito atribuído a associado ou grupo econômico em valor igual ou superior a 5% (cinco por cento) do PR da Singular, foi cadastrado prazo de vigência superior a 180 dias.", ""]);
	newDataset.addRow(["", "9.02", "Em se tratando de Limite de Crédito atribuído a Produtor Rural, o vencimento do limite está divergente do constante na súmula aprovada pelo Sicoob Central Unicoob.", ""]);
	newDataset.addRow(["", "9.03", "Em se tratando de Limite de Crédito atribuído a Pessoa Jurídica, o vencimento do limite está divergente do constante na súmula Calcred aprovada pelo Sicoob Central Unicoob.", ""]);
	newDataset.addRow(["", "9.04", "O prazo de vigência do limite não foi cadastrado em conformidade.", ""]);

	
	return newDataset;
}

function onMobileSync(user) {

}

