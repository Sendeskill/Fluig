function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	
	newDataset.addColumn('Item');
	newDataset.addColumn('Subitem');
	newDataset.addColumn('Descricao');
	
	newDataset.addRow(["1", "", "As informações relacionadas a faturamento/renda foram atualizadas?"]);
	newDataset.addRow(["", "1.01", "As informações relacionadas a faturamento /renda do tomador não foram atualizadas por ocasião da implantação do limite."]);
	
	newDataset.addRow(["2", "", "Quando exigido, o limite de crédito foi encaminhado para deferimento da Central?"]);			
	newDataset.addRow(["", "2.01", "Se PF Rural, o limite foi atribuído acima da alçada da Cooperativa, sem envio para deferimento da Central."]);
	newDataset.addRow(["", "2.02", "Se PJ, o limite atribuído é superior ao limite calculado para o Grupo Homogêneo e superior à alçada da Cooperativa."]);
	newDataset.addRow(["", "2.03", "Se PJ Maior, o limite não foi deferido pela Central."]);
	newDataset.addRow(["", "2.04", "Se PJ Maior, o limite foi deferido em valor superior ao estabelecido pela Central."]);
			
	newDataset.addRow(["3", "", "Se PJ Maior, foi preenchido o balanço e questionário e agravada a nota de risco no caso da existência de restritivos?"]);
	newDataset.addRow(["", "3.01", "O questionário e/ou os balanços estão desatualizados."]);
	newDataset.addRow(["", "3.02", "Não foram atualizadas as consultas Serasa e Bacen."]);
	newDataset.addRow(["", "3.03", "A nota de risco não foi agravada conforme as condições e critérios definidos na tabela de restritivos."]);
	newDataset.addRow(["", "3.04", "O prazo de vigência do limite não foi cadastrado em conformidade."]);
	newDataset.addRow(["", "3.05", "Observada mais de uma inconsistência na análise de PJ Maior."]);
		
	newDataset.addRow(["4", "", "Se limite reclassificado, não foram realizadas adequações relacionadas a classificação (modelo) e/ou limites atribuídos?"]);	
	newDataset.addRow(["", "4.01", "Houve reclassificação automática do tomador, porém, não foi ajustada a classificação (modelo) e o limite atribuído."]);
	newDataset.addRow(["", "4.02", "Houve reclassificação automática do tomador, porém, não foi ajustada a classificação (modelo)."]);
	newDataset.addRow(["", "4.03", "Houve reclassificação automática do tomador, porém, não foi ajustado o limite atribuído."]);
			
	return newDataset;
}
