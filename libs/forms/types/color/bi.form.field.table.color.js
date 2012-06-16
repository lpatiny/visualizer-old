

if(!BI.Forms.Fields.Table)
	BI.Forms.Fields.Table = {};
	

BI.Forms.Fields.Table.Color = function(main) {
	this.main = main;
}

BI.Forms.Fields.Table.Color.prototype = new BI.Forms.Fields.Color();

$.extend(BI.Forms.Fields.Table.Color.prototype, {


	buildHtml: function() {},
	
		
	initHtml: function() { },
	
	addField: function(position) {
		var div = $("<div />");
		this.divs.splice(position, 0, div)
		this.input = $("<input />");
		return { html: div, index: position };
	},
	
	removeField: function(position) {
		this.divs.splice(position, 1)[0].remove();
	},

	startEditing: function(position) {
		this.divs[position].hide().after(this.input.val(this.main.getValue(position)));
		this.input.focus();
	},

	stopEditing: function(position) {
		this.divs[position].show().html(this.input.val());
		this.input.remove();
		this.main.changeValue(position, this.input.val());
	},


	setValue: function(index, value) {
	
		this.main.fields[index].html.html(value);
		this.main.changeValue(index, value);
	}
});