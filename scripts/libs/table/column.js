if(!window[_namespaces['table']].Tables) window[_namespaces['table']].Tables = {};

window[_namespaces['table']].Tables.Column = function(name, options) {
	
	this.title;
	this.options = $.extend(true, {}, window[_namespaces['table']].Tables.Column.prototype.defaults, options);
	this.name = name;
}


window[_namespaces['table']].Tables.Column.prototype = {
	
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
	
	setTable: function(table) {
		this.table = table;
	},
	
	afterInit: function() {
		this.th = this.table.dom.children('thead').children('tr').children('th[data-colname=' + this.getName() + ']');
		this.index = this.th.index();
		
	},
	
	buildHeader: function() {
		var html = [];
		html.push('<th data-colname="');
		html.push(this.name);
		html.push('">');
		
		html.push(this.title.getLabel());
		
		html.push('<div class="ci-table-sort"><span class="triangle-up"></span><span class="triangle-down"></span></div>');
		html.push('</th>');
		return html.join('');
	},
	
	select: function(bln) {
		this.selected = bln;
		var index = this.index;
		this.table.dom.children('tbody').children('tr').each(function() {
			
			$(this).children('td:eq(' + index + ')')[bln ? 'addClass' : 'removeClass']('ci-selected');
		});
	},
	
	isSelected: function() {
		return this.selected;
	},
	
	buildElement: function(element) {
		return ['<td class="', (this.isSelected() ? 'ci-selected' : ''), '">', element, '</td>'].join('');
	}
}