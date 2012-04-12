
if(!window[_namespaces['table']].Tables) window[_namespaces['table']].Tables = {};

window[_namespaces['table']].Tables.Table = function(options) {
	
	this.options = $.extend(true, {}, window[_namespaces['table']].Tables.Table.prototype.defaults, options);
	this.pagination = 20;
	this.page = 1;
	this.search = null;
	this.content;
	this.cols = [];
}


window[_namespaces['table']].Tables.Table.prototype = {
	
	defaults: {
		cssPrefix: _namespaces['table'].toLowerCase() 
	},
	
	addColumn: function(col) {
		this.cols.push(col);
		col.setTable(this);
	},
	
	removeCol: function(col) {
		
		if(typeof col == "number")
			this.cols.splice(col, 1);
		else
			for(var i = 0; i < this.cols.length; i++) 
				if(this.cols[i] == col)
					this.cols.splice(i, 1);
	},
	
	setContent: function(content) {
		this.content = content;
		this.content.setTable(this);
		this.content.setPagination(this.pagination);
		this.content.setPage(this.page);
		this.content.setSearch(this.search);
	},
	
	setContentHtml: function(html) {
		this.contentHtml = html;
		this.body.html(html);
	},
	
	setPagination: function(elPerPage) {
		this.pagination = elPerPage;
		this.execFuncContent('setPagination', [this.pagination]);
	},
	
	setPage: function(page) {
		this.page = page;
		this.execFuncContent('setPage', [this.page]);
		this.commitContent();
	},
	
	execFuncContent: function(funcName, vars) {
		if(typeof this.content !== "undefined")
			this.content[funcName].apply(this.content, vars);
	},
	
	buildTable: function() {
		
		var html = [];
		html.push('<table cellpadding="0" cellspacing="0" class="');
		html.push(this.options.cssPrefix);
		html.push('-table">');
		html.push('<thead><tr>');
		for(var i = 0; i < this.cols.length; i++)
			html.push(this.cols[i].buildHeader());
		html.push('</tr></thead>');
		html.push('<tbody>');
		html.push('</tbody>');
		html.push('</table>');
		this.dom = $(html.join(''));
		this.body = this.dom.children('tbody');
		return this.dom;
	},
	
	afterInit: function() {
		var inst = this;
		this.dom.on('click', 'th', function() {
			var thName = $(this).data('colname');
			var col = inst.getColumn(thName);
			inst.selectColumn(col);
		});
		
		this.dom.on('click', 'th .ci-table-sort span', function() {
			var el = $(this);
			var asc = el.hasClass('triangle-up');
			var col = inst.getColumn($(this).parents('th:eq(0)').data('colname'));
			inst.content.sort(col, asc);
			inst.commitContent();
			
		});
		
		for(var i = 0; i < this.cols.length; i++) {
			this.cols[i].afterInit();
		}
	},
	
	getColumn: function(name) {
		
		for(var i = 0; i < this.cols.length; i++) {
			
			if(this.cols[i].getName() == name)
				return this.cols[i];
		}
	},
	
	getColumns: function() {
		return this.cols;
	},
	
	selectColumn: function(column, exclusive) {
		
		if(typeof column == "number")
			column = this.cols[column];
			
		if(exclusive) 
			for(var i = 0, length = this.cols.length; i < length; i++)
				this.cols[i].select(false);
			
		column.select(!column.isSelected());
	//	this.commitContent();
	},
	
	commitContent: function() {
		this.body.html(this.content.build());
		this.addPagination();
	},
	
	init: function(dom) {
		this.buildTable();
		this.commitContent();
		
		dom.html(this.dom);
		
		this.afterInit();
	},
	
	addPagination: function() {
		
		var inst = this;
		var pages = Math.ceil(this.content.entryCount / this.pagination);
		var page = this.page;
		
		var html = [];
		
		html.push('<tr class="ci-table-pagination"><td colspan="');
		html.push(this.cols.length);
		html.push('">');
		
		for(var i = 1; i <= pages; i++) {
			html.push('<span data-page="');
			html.push(i);
			html.push('" class="');
			html.push(i == page ? 'ci-selected' : '');
			html.push('">');
			html.push(i);
			html.push('</span>');
		}
		
		html.push('</td></tr>');
		
		var top = $(html.join('')).on('click', 'span', function() {
			
			inst.setPage($(this).data('page'));
		});
		
		var bottom = top.clone(true);
		console.log(this.body);
		console.log(top);
		this.body.prepend(top).append(bottom);
	}
}

