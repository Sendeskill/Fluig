function resolve(process, colleague){
	var numero_cooperativa = hAPI.getCardValue('numero_cooperativa');
	
	log.info('Número Cooperativa Atribuição Personalizada' + numero_cooperativa);
	
	var setor = "Diretor__" + numero_cooperativa;

	var cGrupo = DatasetFactory.createConstraint("colleagueGroupPK.groupId", setor, setor, ConstraintType.MUST);
	var constraintsGroup = new Array(cGrupo);
    var colleagues = DatasetFactory.getDataset("colleagueGroup", null, constraintsGroup, null);

    var userList = new java.util.ArrayList();
   
    for (var i = 0; i < colleagues.rowsCount; i++) {
        userList.add(colleagues.getValue(i, "colleagueGroupPK.colleagueId"));
    }

	return userList;
}
