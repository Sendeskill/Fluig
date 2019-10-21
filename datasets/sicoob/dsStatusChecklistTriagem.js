function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn("VALOR");
	
	dataset.addRow(new Array("Divergente"));
	dataset.addRow(new Array("OK"));
	dataset.addRow(new Array("Não aplicável"));
	dataset.addRow(new Array("Pendente"));
	dataset.addRow(new Array("Não Disponível"));
	
	return dataset;
}

function onMobileSync(user) {

}