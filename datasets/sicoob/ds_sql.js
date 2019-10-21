function createDataset(fields, constraints, sortFields) {
	log.info("#### DS SQL ####");

    var newDataset = DatasetBuilder.newDataset();
    var ic         = new javax.naming.InitialContext();
    var created    = false;
    var query      = '';
    var filtro     = '';
    var banco      = '';
    var zoom       = 0;
    var dataSource = "jdbc/";
    var servico    = "FluigDS";

	if(constraints != null) {
		if(constraints.length > 0) {
        	
			for (var i = 0; i < constraints.length; i++) {
        		if (constraints[i].fieldName == 'select') {
        			query = constraints[i].initialValue;
        		} else if (constraints[i].fieldName == 'servico') {
        			servico = constraints[i].initialValue;
        		} else if (constraints[i].fieldName == 'zoom') { // quando for campo ZOOM no formulário
        			zoom = constraints[i].initialValue;
        		} else if (constraints[i].fieldName == 'sqlLimit') {
        		} else {
        			var campo = constraints[i].fieldName;
        			var valor = constraints[i].initialValue;        			
        			filtro += "AND " + campo + " LIKE '%" + valor + "%' ";
        		}
        	}
		}
	}

	//query = query.toUpperCase();
	if(query.indexOf(" WHERE ")==-1) { // NÃO ACHOU
		filtro = " WHERE 1=1 " + filtro;
	} else { // ACHOU
	}
	
	query = query + filtro;
	
	if (zoom == 1) {
		//query = decodeURIComponent(query);
		query = query.replace("+%27", " '").replace("%27+", "'");
	}
	//query = query.toUpperCase();

	log.info("#### QUERY ####");
	log.info(query);
	
	var ds = ic.lookup(dataSource + "/" + servico);

    try {
    	var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(query);
        var columnCount = rs.getMetaData().getColumnCount();
        
        while(rs.next()) {
        	if(!created) {
        		for(var i = 1; i <= columnCount; i++) {
        			newDataset.addColumn(rs.getMetaData().getColumnName(i));
        		}
                
        		created = true;
        	}
            
        	var Arr = new Array();
            
        	for(var i = 1; i <= columnCount; i++) {
        		var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                
        		if(null!=obj) {
        			Arr[i-1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
        		} else {
                	Arr[i-1] = "null";
                }
        	}
            
        	newDataset.addRow(Arr);
        }
    } catch(e) {
    	log.info("ERRO ==============> " + e.message);
    	newDataset.addColumn("ERRO");
    	newDataset.addRow(new Array(e.message));
    } finally {
    	if(stmt != null) stmt.close();
        if(conn != null) conn.close();                     
    }
    
    return newDataset;
}