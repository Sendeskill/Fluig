<div class="super-widget wcm-widget-class fluig-style-guide">
  <div id="fluig-sicoob">
     <div class="container" id="monitor_escolha">
         <div class="row">
             <div class="col-xs-12">
                 <p><b>Limites a serem enviados ao Monitor de Cadastro</b></p>
             </div>
         </div>
         <div id="filtros">
             <div class="row">
                 <div class="col-md-3">
                     <label>Cooperativa</label>
                     <input type="text" name="cooperativa" class="form-control" placeholder="Informe a Cooperativa">
                 </div>
                 <div class="col-md-3">
                     <label>PA</label>
                     <input type="text" name="PA" class="form-control" placeholder="Informe a PA">
                 </div>
                 <div class="col-md-6">
                     <label>Nome do cliente</label>
                     <input type="text" name="nome_cliente" class="form-control" placeholder="Informe o Nome do Cliente">
                 </div>
             </div>
             <div class="row">
                 <div class="col-md-3">
                     <label>Data de</label>
                     <div class="input-group">
                         <div class="input-group-addon"><i class="fluigicon fluigicon-calendar icon-sm"></i></div>
                         <input type="text" name="periodo_i" class="calendar form-control" placeholder="__/__/__">
                     </div>
                 </div>
                 <div class="col-md-3">
                     <label>Data até</label>
                     <div class="input-group">
                         <div class="input-group-addon"><i class="fluigicon fluigicon-calendar icon-sm"></i></div>
                         <input type="text" name="periodo_t" class="calendar form-control" placeholder="__/__/__">
                     </div>
                 </div>
                 <div class="col-md-3">
                     <label>Status</label>
                     <select name="status_select" class="form-control">
                         <option value="D">Disponível para análise</option>
                         <option value="A">Analisado</option>
                         <option value="E">Em análise</option>
                     </select>
                 </div>
                 <div class="col-md-3" style="text-align: center;">
                     <br>
                     <button class="btn" id="btn-filtrar"><i class="flaticon flaticon-filter icon-sm"></i>Filtrar</button>
                 </div>
             </div>
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
                         <tr style="cursor: default;">
                             <th>
                                 <!-- <div class="custom-checkbox custom-checkbox-sicoob">
                                     <input type="checkbox" name="status" value="all">
                                     <label></label>
                                 </div> -->
                             </th>
                             <th>Status</th>
                             <th>Coop.</th>
                             <th>PA</th>
                             <th>Código</th>
                             <th>CPF/CNPJ</th>
                             <th>Nome</th>
                             <th>Cadastro</th>
                             <th>Últ. Renovação</th>
                         </tr>
                     </thead>
                     <tbody>  
                     </tbody>
                 </table>
             </div>
         </div>
         <div class="row">
             <div class="col-md-12">
                 <button class="btn fs-float-right" id="btn-analisar" style="display:none;">Analisar</button>
             </div>
         </div>
     </div>
 </div>
</div>