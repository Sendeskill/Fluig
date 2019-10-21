function afterLogin(login) {
	/*
	// Busca um serviço customizado cadastrado no Fluig e invoca um método específico dele
	var provider = ServiceManager.getServiceInstance("CustomService"); 
    var serviceLocator = provider.instantiate("com.fluig.sample.service.CustomService_Service"); 
    var service = serviceLocator.getCustomServicePort();
    service.addUserSession(login);
    */
	
	log.info("LOGIN ======================");
	log.info(login);
}