function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn("CNPJ");
	dataset.addColumn("NOME_COOPERADO");
	dataset.addColumn("SITUACAO");
	
	dataset.addRow(new Array("11.111.111/1111-11", "Cesar", "REGULAR"));
	dataset.addRow(new Array("22.222.222/2222-22", "Junior", "REGULAR"));
	dataset.addRow(new Array("33.333.333/3333-33", "Marcos", "IRREGULAR"));
	dataset.addRow(new Array("44.444.444/4444-44", "Gabriel", "REGULAR"));
	dataset.addRow(new Array("55.555.555/5555-55", "João", "REGULAR"));
	dataset.addRow(new Array("66.666.666/6666-66", "Henrique", "REGULAR"));
	dataset.addRow(new Array("77.777.777/7777-77", "Flávio", "IRREGULAR"));
	dataset.addRow(new Array("88.888.888/8888-88", "Augusto", "IRREGULAR"));
	dataset.addRow(new Array("99.999.999/9999-99", "Maurício", "REGULAR"));
	dataset.addRow(new Array("12.345.678/1234-56", "Antonio", "REGULAR"));
	
	return dataset;
}

function onMobileSync(user) {

}