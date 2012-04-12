if(!window[_namespaces['table']].Tables) window[_namespaces['table']].Tables = {};

window[_namespaces['table']].Tables.Content = function() {
	
	this.elements = [];
	this.table;
	this.seach;
	this.pagination;
	this.page;
	this.entryCount = 0;
}


window[_namespaces['table']].Tables.Content.prototype = {
	
	setTable: function(table) {
		this.table = table;
	},
	
	addElement: function(elJson) {
		this.elements.push(elJson);
		this.entryCount++;
	},
	
	build: function() {
		var j = 0;
		var html = [];
		
		for(var i = 0; i < this.elements.length; i++) {
			if(!this.doSearch(this.elements[i]))
				continue;
			j++;
			if(j < (this.page - 1) * this.pagination || j >= this.page * this.pagination)
				continue;
			html.push(this.buildElement(this.elements[i], i));
		}
		this.table.setContentHtml(html.join(''));
	},
	
	buildElement: function(element, index) {
		var html = [];
		var columns = this.table.getColumns();
		html.push('<tr data-element-id="');
		html.push(index);
		html.push('">');
		for(var i = 0; i < columns.length; i++) {
			var name = columns[i].getName();
			
			var elVal = element[name];
			if(typeof elVal != "undefined") {
				html.push(columns[i].buildElement(elVal));
			} else
				html.push('<td></td>');
			
		}
		html.push('</tr>');
		
		return html.join('');
	},
	
	doSearch: function(element) {
	
		if(typeof this.search == "undefined" || this.search == null)
			return true;
		
		var columns = this.table.getColumns();
		var val;
		for(var i = 0; i < columns.length; i++) {
			if(typeof(val = element[columns[i].getName]) !== "undefined") {
				if(this.seach.test(val))
					return true;
			}
		}
		return false;
	},
	
	setPagination: function(pagination) {
		this.pagination = pagination;
	},
	
	setPage: function(page) {
		this.page = page;
		
	},
	
	setSearch: function(search) {
		
		this.search = null;
		if(search == null)
			return;
		
		var metachars = ["[", "\\", "^", "$", ".", "|", "?", "*", "+", "(", ")"];
		for(var i = 0; i < metachars.length; i++)
			search.replace(metachars[i], "\\" + metachars[i]);
		search = search.toLowerCase();
		this.search = new RegExp(search);
	},
	
	sort: function(col, asc) {
		var elName = col.getName();
		
		this.elements.sort(function(a, b) {
			if(!a[elName]) return -1;
			if(!b[elName]) return 1;
			return a[elName] < b[elName];
		});
		
		if(!asc)
			this.elements.reverse();
		
	}
}