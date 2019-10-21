var Alx = {
    Table: function(tablename, fieldIndex, fieldParentIndex) {
        this.tablename = tablename;
        this.fieldIndex = fieldIndex;
        this.fieldRelationIndex = undefined;
        this.fieldParentIndex = fieldParentIndex;
        this.autoAdd = false;
    
        this.$tableElement = $('[tablename="' + this.tablename + '"]');
    
        this.$tableElement.hide();
    
        this.afterAdd = function(number, element) { };
        this.afterRender = function(number, element) { };
        this.afterRenderAll = function(total, element) { };
    
        this.children = [];
    
        this.addChild = function (alx) {
            alx.fieldRelationIndex = this.fieldIndex;
            this.children[alx.tablename] = alx;
        };
    
        this.getChild = function(name) {
            return this.children[name];
        };
    
        this.add = function(element) {
            var lastNumber;
    
            if (this.fieldIndex) {
                lastNumber = Number($('input[name^="' + this.fieldIndex + '___"]').last().val()) + 1 || 1;
            }
    
            var number = wdkAddChild(this.tablename);
            var $containerRows;
    
            if (element && this.fieldParentIndex) {
                $element = $(element);
    
                $currentContainerRows =  $element.closest('[alx-container-rows]');
    
                if (this.tablename == $currentContainerRows.attr('alx-container-rows')) {
                    $containerRows = $currentContainerRows;
                } else {
                    $containerRows = $element.closest('[alx-row]').find('[alx-container-rows="' + this.tablename + '"]');
                }
    
            } else {
                $containerRows = $('[alx-container-rows="' + this.tablename + '"]');
            }
    
            var $trLast = this.$tableElement.find('tr:last');
    
            var alxRowId = this.tablename + '___' + number;
            
            var $elementRow = $trLast.find('td').children();
            $elementRow.attr('alx-row', alxRowId);
    
            $containerRows.append($elementRow[0].outerHTML);
            
            $trLast.remove();
    
            $elementRow = $('[alx-row="' + alxRowId + '"]');
    
            var $inputBase = $elementRow
                .find('input,select,textarea').first();
    
            var number = $inputBase.prop('name').split('___')[1];
    
            if (lastNumber) {
                $('[name="' + this.fieldIndex + '___' + number + '"]').val(lastNumber);
            }
    
            if (this.fieldRelationIndex) {
                var relationId = $containerRows.parent()
                    .find('[name^="' + this.fieldRelationIndex + '___"]').first().val();
     
                $('[name="' + this.fieldParentIndex + '___' + number + '"]').val(relationId);
            }
    
            this.afterAdd(number, $elementRow[0]);
    
            return number;
        };
    
        this.remove = function(that) {
           $(that).closest('[alx-row]').remove();
        };
        
        this.removeAll = function(that) {
            $(that).closest('[alx-row]').find('[alx-container-rows="' + this.tablename + '"]').html('');
        };
    
         this.count = function(that) {
            return $(that).closest('[alx-row]').find('[alx-container-rows="' + this.tablename + '"]').find('[alx-row]').length;
        };
    
        this.render = function() {
            $containerRows = $('[alx-container-rows="' + this.tablename + '"]');
            
            self = this;
    
            var $rows = self.$tableElement.find('tbody').find('tr:not([detail])');
                
            $rows.each(function () {
                    var $elementRow = $(this).find('td').children();
    
                    $inputBase = $elementRow.find('input,select,textarea').first();
    
                    var number = $inputBase.prop('name').split('___')[1];
    
                    var alxRowId = self.tablename + '___' + number;
    
                    $elementRow.attr('alx-row', alxRowId);
                    $containerRows.append($elementRow[0].outerHTML);
    
                    this.remove();
    
                    $elementRow = $('[alx-row="' + alxRowId + '"]');
    
                    self.afterRender(number, $elementRow[0]);
    
                    self.renderChild($elementRow, self.children);
            });
    
    
            return $rows.length;
        };
    
        this.renderChild = function($elementRow, children) {
            var child = Object.values(children);
    
            var self = this;
    
            if (child.length) {
                for (var i = 0; i < child.length; i++) {
                                                        
                    relationIndexId = $elementRow.find('[name^="' + child[i].fieldRelationIndex + '___"]').val();
                    $containerParentRows = $elementRow.find('[alx-container-rows="' + child[i].tablename + '"]');
    
                    $tableParent = $elementRow.find('[tablename="' + child[i].tablename + '"]');
    
                    var $rows = child[i].$tableElement.find('tbody').find('tr:not([detail])');
    
                    $rows.each(function() {
                        var $elementRow = $(this).find('td').children();
                        var parentIndexId = $elementRow.find('[name^="' + child[i].fieldParentIndex + '___"]').val();
    
                        if (relationIndexId == parentIndexId) {
                            $inputBase = $elementRow.find('input,select,textarea').first();
    
                            var number = $inputBase.prop('name').split('___')[1];
    
                            var alxRowId = child[i].tablename + '___' + number;
                        
                            $elementRow.attr('alx-row', alxRowId);
                            $containerParentRows.append($elementRow[0].outerHTML);
    
                            this.remove();
    
                            $elementRow = $('[alx-row="' + alxRowId + '"]');
    
                            child[i].afterRender(number, $elementRow[0]);
    
                            self.renderChild($elementRow, child[i].children);
                        }
                    });
                }
            }
        };
    }
};
