function beforeTaskCreate(colleagueId){
	var processo = getValue("WKNumProces");
	var state = getValue("WKNumState")

	// Executa no início do processo
	if (state == 4) {
		var campos   = hAPI.getCardData(processo);
		var contador = campos.keySet().iterator();
		
		var ids = "";

		while (contador.hasNext()) {
		    var id = contador.next();
		    
		    var matches = id.match(/id_operacao___([0-9]+)/);

		    if (matches) {
		        ids += campos.get("id_operacao___" + matches[1]) + ",";
		    }
		}
		
		ids = ids.slice(0, -1);
		
		log.info('LISTAGEM DOS IDS--------------------- ' + ids);
		
		var c1 = DatasetFactory.createConstraint("_action", "adicionarImportados", null, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("_token", "uBWF8A2K3xCv755sXoBH1qAmjOYzsghG", null, ConstraintType.MUST);
		var c3 = DatasetFactory.createConstraint("LiquidacaoCredito.Ids", ids, null, ConstraintType.MUST);
		
	    var dsLiquidacaoCredito = DatasetFactory.getDataset("dsLiquidacaoCredito", null, [ c1, c2, c3 ], null);
	}
}
