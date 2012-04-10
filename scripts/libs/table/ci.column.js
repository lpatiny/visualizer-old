
CI.Tables.Column = function(name, options) {
	
	this.title;
	this.options = $.extend(true, {}, CI.Tables.Column.prototype.defaults, options);
	
	this.name = name;
}


CI.Tables.Column.prototype = {
	
	defaults: {
		sortable: false,
		display: true,
		searchable: true
	},
	
	setTitle: function(title) {
		this.title = title;
	},
	
	getName: function() {
		return this.name;
	},
	
	buildHeader: function() {
		var html = [];
		html.push('<th>');
		html.push(this.title.getLabel());
		html.push('</th>');
		return html.join('');
	}
	
}