function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn("Coop");
	dataset.addColumn("PA");
	dataset.addColumn("nome_cliente");
	dataset.addColumn("data");
  dataset.addColumn("status");
  dataset.addColumn("documento");
  
  dataset.addRow(["999","123","Junior Rodrigues","2019-12-11","D","00979403995"]);
  dataset.addRow(["999","123","Lucas Karger","2019-12-11","A","32415423000169"]);
  dataset.addRow(["999","321","Roberto Robes","2019-12-15","D","00979403995"]);

  return dataset;
}