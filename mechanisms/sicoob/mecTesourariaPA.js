function resolve(process,colleague){
	
	var userList = new java.util.ArrayList();
	
	var numCoop = hAPI.getCardValue("numCooperativa");
	var numPA   = hAPI.getCardValue("numPACooperativa");
	
	var grupo = "UNIDADE-" + numCoop + "_" + numPA;
	
	var FLUIG_HOST = "http://fluig.dev.unicoob.local/portal";
	
    // OAuth variables
    var OAUTH_APP_PUBLIC      = "6aa69a8a-486b-4b0d-a9ae-a184a1408cf9";
    var OAUTH_APP_PRIVATE     = "e86877e1-a2d0-414c-bb3b-000274e446d2-60b987de-7f98-4545-9d65-6017f853ce7d";
    var OAUTH_USER_APP_PUBLIC = "b53e209c-c8f7-496e-b17d-72f54ff494cf";
    var OAUTH_USER_APP_SECRET = "cd9865b7-fce2-4678-96ef-cb10f39af8b67b7a61a1-484d-482d-a124-17db0de77264";

	var myApiConsumer = oauthUtil.getGenericConsumer(OAUTH_APP_PUBLIC,OAUTH_APP_PRIVATE,OAUTH_USER_APP_PUBLIC,OAUTH_USER_APP_SECRET);
	var data = myApiConsumer.get(FLUIG_HOST + "/api/rest/wcm/service/group/findGroupsUserRoleByCode?space=&groupCode=" + grupo);
	
	var objData = JSON.parse(data);
	
	var dados = objData.content;
	
	if (dados == null) {
		//userList.add('Pool:Role:ANALISTA_FLUIG');
	} else {
		for (var i = 0; i < dados.length; i++) {	
			if (dados[i].childGroupCode != null) {
				
				var codGrupo = dados[i].childGroupCode;
				var descGrupo = buscaGrupo(codGrupo);
				
				if (descGrupo.toUpperCase().indexOf("CAIXA-") != -1 
						|| descGrupo.toUpperCase().indexOf("TESOUREIRO-") != -1 
						|| descGrupo.toUpperCase().indexOf("ASSIST PAC-") != -1 
						|| descGrupo.toUpperCase().indexOf("ASSIST ADM-") != -1) {
					userList.add('Pool:Group:' + codGrupo);
				}
			}
		}
	}

	return userList;
}

function buscaGrupo(codGrupo) {
	var fields        = null;
	var constraints   = new Array();
	constraints.push(DatasetFactory.createConstraint("groupPK.groupId", codGrupo, codGrupo, ConstraintType.MUST));
	var sortingFields = null;
	
	var dataset = DatasetFactory.getDataset('group', fields, constraints, sortingFields);
	
	var count = dataset.rowsCount;
	
	if (count == 0) {
		return "";
	} else {
		return dataset.getValue(0, "groupDescription");
	}
}