$(document).ready(function(){

	var btnCollapse = `<button data-toggle="collapse" data-target=".collapsable" class="btn-collapse">
							<i class="flaticon flaticon-chevron-up"></i>
						</button>` ;

	var naoCampos = `<tr class="nao-itens collapsable collapse in">
				        <td class="add_item">
				        	<button class="additem-btn"><i class="flaticon flaticon-circle-plus icon-md"></i></button>
				        </td>
				       
				       	<td colspan="2" class="descricao_item nao-fields">
					        <textarea name="descricao_nao" placeholder="Descrição" class="form-control"></textarea>
					    </td>
						<td class="anexo-item nao-fields">
					        <button><i class="flaticon flaticon-paperclip icon-sm"></i></button>
					    </td>
			        	<td class="ordem_item nao-fields">
					        <label for="ordem_item">Ordem:</label>
					        <br>
					        <input type="text" name="ordem_item" value="3.01" readonly class="fs-no-border form-control"/>
						</td>
		        	</tr>
		        	
		        	<tr class="space collapsable collapse in">
		        		<td></td>
		        		<td></td>
		        		<td></td>
		        		<td></td>
		        		<td></td>
		        	</tr>`;

	var justCampos = ` <tr class="justif-campo collapsable collapse in">
							<td colspan="2" class="descricao_item ">
							    <textarea name="descricao_just" placeholder="Justificativa" class="form-control"></textarea>
							</td>
						</tr>
						        	
						<tr class="space collapsable collapse in">
					   		<td></td>
			        		<td></td>
			        		<td></td>
			        		<td></td>
			        		<td></td>
			        	</tr>`;

	var linha;
	$('input[type="radio"]').change( function(){
		$('.collapsable').collapse('hide');
		$('tr').removeClass('selected');
		$('.btn-collapse').html('<i class="flaticon flaticon-chevron-down"></i>');

		linha = $(this).parents('tr');

		if (linha.next().hasClass('nao-itens') && linha.find('.nao-opt').is(':checked') == false ){
			linha.next().next().remove();
			linha.next().remove();
			open = 0;
			linha.find('.btn-collapse').remove();
			addLinha();

		}else if(linha.next().hasClass('justif-campo') && (linha.find('.justificativa-opt').is(':checked') == false) ){
			linha.next().next().remove();
			linha.next().remove();
			open = 0;
			linha.find('.btn-collapse').remove();
			addLinha();

		}else{
			addLinha();
		}
	});

	function addLinha(){
		if (linha.find('.nao-opt').is(':checked')){
				linha.addClass('selected');
				$(naoCampos).insertAfter(linha);
				linha.find('.analise-desc').append(btnCollapse);
				
			}else if (linha.find('.justificativa-opt').is(':checked')){
				linha.addClass('selected');
				$(justCampos).insertAfter(linha);
				linha.find('.analise-desc').append(btnCollapse);
			}
		};

});