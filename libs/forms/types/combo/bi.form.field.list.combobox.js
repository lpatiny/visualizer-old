
if(!BI.Forms.Fields.List)
	BI.Forms.Fields.List = {};
	

BI.Forms.Fields.List.Combo = function(main) {

	this.main = main;
	this.treeLoaded = false;
	this.divs = [];
	
	this.optionsIndexed = [];
	this.options;
}

BI.Forms.Fields.List.Combo.prototype = new BI.Forms.Fields.Combo();

$.extend(BI.Forms.Fields.List.Combo.prototype, {

	
	buildHtml: BI.Forms.FieldGeneric.buildHtml,
	
		
	initHtml: function() {
		
		
		var field = this;
		// Change the input value will change the input hidden value
		var input = this.main.dom.on('click', 'div.bi-formfield-field-container > div', function(event) {
			event.stopPropagation();
			field.main.toggleExpander($(this).index());
		});
		
		
		this.placeholder = this.main.dom.on('click', '.bi-formfield-placeholder-container > label', function(event) {
			event.stopPropagation();
			var index = $(this).index();
			field.main.fieldContainer.children().eq(index).trigger('click');
		});
		
		this.main.dom.on('click', '.bi-formfield-image-container > img', function(event) {
			event.stopPropagation();
			var index = $(this).index();
			field.main.fieldContainer.children().eq(index).trigger('click');
		});
		
		if(typeof this.options != "undefined")
			this.loadTree();
	},
	
	setText: function(index, text) {
		this.main.fields[index].field.html(text);
	},
	
	setValue: function(value) {
		dom.children('input').val(value);
		this.main.valueChanged(value);
	},
	
	addField: BI.Forms.FieldGeneric.addField,
	removeField: BI.Forms.FieldGeneric.removeField	
});