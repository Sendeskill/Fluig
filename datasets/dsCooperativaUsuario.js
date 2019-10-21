function defineStructure() {

}


function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();
	
	newDataset.addColumn("cooperativaId");
	newDataset.addColumn("erro");
	
    var user = getValue("WKUser");
    var c2f1 = 'Cooperativa_%';
    
    var c1 = DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", user, user, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("colleagueGroupPK.groupId", c2f1, c2f1, ConstraintType.MUST);
    
    c2.setLikeSearch(true);
    
    var constraints   = new Array(c1, c2);
    var datasetGrupos = DatasetFactory.getDataset("colleagueGroup", null, constraints, null);
    
    try {
    	var erroGrupo = 'Usuário não está em um grupo de cooperativa. ex: Cooperativa_9999';
    	
	    if (datasetGrupos.rowsCount == 0) {
	    	throw new Error(erroGrupo);
	    }

	    var groupId = datasetGrupos.getValue(0, "colleagueGroupPK.groupId");
        var cooperativaId = String(groupId).replace('COOPERATIVA-', '');
        
        
        if (cooperativaId == "") {
        	throw new Error(erroGrupo);
        }
        
        newDataset.addRow(new Array(cooperativaId, null));
	    
    } catch(e) {
    	newDataset.addRow(new Array(null, e.message));
    }
    
    return newDataset;
}

function onMobileSync(user) {

}