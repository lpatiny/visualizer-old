

if(!BI.Forms.Fields.Table)
	BI.Forms.Fields.Table = {};
	

BI.Forms.Fields.Table.Color = function(main) {
	this.main = main;
	this.divs = [];
}

BI.Forms.Fields.Table.Color.prototype = new BI.Forms.Fields.Color();

$.extend(BI.Forms.Fields.Table.Color.prototype, {

	initHtml: function() {
		
		
		var field = this;
		// Change the input value will change the input hidden value
		
		this.fillExpander();
		this._picker = this.main.domExpander.find('.bi-formfield-colorpicker').farbtastic(function(color) {
			field._hasChanged(color);
		});
		
	},
	
	
	
	addField: function(position) {
		var div = $("<div />");
		this.divs.splice(position, 0, div)
		var input = $("<input />");
		return { html: div, field: div, input: input, index: position };
	},
	
	removeField: function(position) {
		this.divs.splice(position, 1)[0].remove();
	},

	startEditing: function(position) {
		var field = this.main.fields[position];
		field.field.html(this.main.getValue(position));
		$.farbtastic(this._picker).setColor(this.main.getValue(position));
		//this.main.fields[position].input.remove();
		this.main.toggleExpander(position);
	},

	stopEditing: function(position) {
		var field = this.main.fields[position];
		//this.main.changeValue(position, this.main.fields[position].input.val());
		
		this.main.hideExpander();
	},


	_setValueText: function(index, value) {

		this.main.fields[index].html.html(value);
		this.main.changeValue(index, value);
	}

});