<div id="HelloWorld_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide"
    data-params="HelloWorld.instance({message: 'Hello world'})">
    
    <div id="fluig-sicoob">
        
        <div class="tabs" id="tabs-container">
             <ul class="nav nav-tabs" role="tablist" id="tabs">
                <li class="active"><a href="#gerar" role="tab" data-toggle="tab">Gerar Testes</a></li>
                <li><a href="#testes_monitor" role="tab" data-toggle="tab">Editar tabela de testes</a></li>
            </ul>
        </div>
        
    
        <div class="tab-content">
            <div class="container-fluid tab-pane active" id="gerar">
                <div id="form-busca" class="row">
                    <div class="col-xs-12 col-md-2 col-md-offset-1">
                        <label for="local">Local </label>
                        <select name="local" id="local2" class="form-control">
                        
                        </select>
                    </div>
                        
                    <div class="col-xs-12 col-sm-6 col-md-2 ">
                        <label for="coop">Cooperativa </label>
                        <input type="text" name="Cooperativa" id="Cooperativa" class="form-control">
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-2 ">
                        <label for="PA">PA </label>
                        <input type="text" name="PA" id="PA" class="form-control">
                    </div>
                    
                    <div class="col-xs-12 col-md-2 ">
                        <label for="ano">Ano</label>
                        <input type="text" name="ano" id="ano" class="form-control">
                    </div>

                    <div class="col-xs-12 fs-xl-margin-top col-md-2">
                        <button onClick="createTaskList()" class="btn btn-primary">Gerar Testes</button>
                    </div>
                </div>
            </div>
            
            <div class="container-fluid tab-pane" id="testes_monitor">
                <div class="row">

                    <div class="col-xs-6 col-md-2">
                        <div class="form-group">
                            <label for="local">Local</label>
                            <select name="local" id="local" class="form-control">
                                
                            </select>
                        </div>
                    </div>

                    <div class="col-xs-6 col-md-2 col-lg-1 fs-xl-margin-top">
                        <button class="btn btn-second" data-filtro><i class="flaticon flaticon-filter icon-sm"></i> Listar</button>
                    </div>
                    
                    <div class="col-xs-12 col-md-2 col-md-offset-7 float-right">
                        <div>
                            <button class="btn btn-primary" id="criar-pro" onClick="openModal()"><i class="fluigicon fluigicon-plus icon-sm"></i> Criar Teste</button>
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-md-12">
                        <table class="default-table" id="classif-table" class="unselectable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CodigoM20</th>
                                    <th>Processo</th>
                                    <th>Nível Risco</th>
                                    <th>Teste</th>
                                    <th>Local</th>
                                    <th>Periodicidade</th>
                                    <th>ProcedimentosVerificacao</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>