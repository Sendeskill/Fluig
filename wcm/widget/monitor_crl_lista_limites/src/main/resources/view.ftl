<style ></style>

<link rel="stylesheet" type="text/css" href="/webdesk/streamcontrol/13/0/0/style.css"/>


<div id="HelloWorld_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide"
     data-params="HelloWorld.instance({message: 'Hello world'})">

     <div id="fluig-sicoob">
        <div class="container" id="monitor_escolha">
            <div class="row">
                <div class="col-xs-12">
                    <p><b>Limite(s) a ser(em) enviado(s) ao Monitor CRL</b></p>
                </div>
            </div>

            <div class="row" id="filtros">
                <div class="form-group col-xs-8 col-md-2">
                    <label for="cooperativa">Cooperativa</label>
                    <input type="digits" name="cooperativa" class="form-control">
                </div>
                
                <div class="form-group col-xs-4 col-md-1">
                    <label for="PA">PA</label>
                    <input type="digits" name="PA" class="form-control">
                </div>
                
                <div class="form-group col-xs-12 col-md-3">
                    <label for="nome_cliente">Nome do cliente</label>
                    <input type="text" name="nome_cliente" class="form-control" />
                </div>

                <div class="form-group col-xs-12 col-md-3">
                    <label for="cpf_cnpj_cliente">CPF/CNPJ do Cliente</label>
                    <input type="text" name="cpf_cnpj_cliente" class="CPF-CNPJ form-control" />
                </div>

                <div class="form-group col-xs-12 col-md-2">
                    <label for="status_select">Status</label>
                    <select name="status_select" class="form-control">
                        <option>Analisado</option>
                        <option>Disponível para análise</option>
                        <option>Em análise</option>
                    </select>
                </div>

                <div class="form-group col-xs-12 col-md-4 col-lg-3">
                    <label for="periodo_i" class="col-xs-12 fs-no-padding">Período</label>
                    <div class="col-xs-5 fs-no-padding">
                        <input type="text" name="periodo_i" class="calendar form-control" placeholder="__/__/__" />
                    </div>
                    <div class="col-xs-2 fs-md-margin-top">
                        <span>até</span>
                    </div>
                    <div class="col-xs-5 fs-no-padding">
                        <input type="text" name="periodo_t" class="calendar form-control" placeholder="__/__/__"  />
                    </div>
                </div>

                <div class="form-group col-xs-12 col-md-5">
                    <label for="valor_de" class="col-xs-12 fs-no-padding">Valor</label>

                    <div class="row">
                        <div class="col-xs-4">
                            <div class="input-group col-xs-4">
                                <span class="input-group-addon">R$</span>
                                <input type="text" name="valor_de" class="fs-no-spin money form-control" data-thousands="." data-decimal=","/>
                            </div>
                        </div>
                        <div class="col-xs-2 fs-md-margin-top fs-lg-margin-left">
                            <span class="fs-float-right">até</span>
                        </div>
                        <div class="col-xs-4">
                            <div class="input-group col-xs-4">
                                <span class="input-group-addon">R$</span>
                                <input type="text" name="valor_ate"  class="fs-no-spin money form-control" data-thousands="." data-decimal=","/>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group col-xs-12 col-md-2">
                    <label for="modelos">Modelos</label>
                    <select name="modelos" class="form-control">
                        <option></option>
                    </select>
                </div>

                <div class="form-group col-xs-12 col-md-2 fs-xl-margin-top custom-checkbox custom-checkbox-sicoob">
                    <input type="checkbox" name="partes_relacionadas" id="partes_relacionadas">
                    <label for="partes_relacionadas"> Partes Relacionadas</label>
                </div>

                <button class="btn fs-float-right" show-message><i class="flaticon flaticon-filter icon-sm"></i>Filtrar</button>
            </div>

            <div class="row legenda">
                <div class="col-xs-12">
                    <i class="flaticon flaticon-edit-square em-analise icon-sm"></i> Em análise
                </div>
                <div class="col-xs-12">
                    <i class="flaticon flaticon-check-circle analisado icon-sm"></i> Analisado
                </div>
                <div class="col-xs-12">
                    <i class="flaticon flaticon-circle-initial analisar icon-sm"></i> Disponível para análise
                </div>
            </div>

            <div class="row">
                <div class="table-responsive table-datatable" id="limites-monitor">
                    <table class="table table-condensed table-striped" id="monitor-table">
                        <thead>
                            <tr>
                                <th>
                                    <div class="custom-checkbox custom-checkbox-sicoob">
                                        <input type="checkbox" name="status" value="all"/>
                                        <label></label>
                                    </div>
                                </th>
                                <th>Coop.</th>
                                <th>PA</th>
                                <th>Código</th>
                                <th>Nome do cliente</th>
                                <th>Modelo</th>
                                <th>Data</th>
                                <th style="display: none;">NRT</th>
                                <th>NRA</th>
                                <th>Auto</th>
                                <th style="display: none;">Valor LTC</th>
                                <th>Valor LCA</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row">
                <button class="btn fs-float-right" id="btn-analisar">Analisar</button>
            </div>
        </div>
    </div>
</div>
