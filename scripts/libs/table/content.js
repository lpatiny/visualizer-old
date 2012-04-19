if(!window[_namespaces['table']].Tables) window[_namespaces['table']].Tables = {};

window[_namespaces['table']].Tables.Content = function() {
	
	this.elements = [];
	this.table;
	this.seach;
	this.pagination;
	this.page;
	this.entryCount = 0;
	this.reIndexedElements = {};
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
		
		this.reIndexedElements = {};
		this.index = 0;
		
		this.supNav = [];
		
		for(var i = 0; i < this.elements.length; i++) {
			if(!this.doSearch(this.elements[i]))
				continue;
			j++;
			if(j < (this.page - 1) * this.pagination || j >= this.page * this.pagination)
				continue;
			
			html.push(this.buildElement(this.elements[i], 0, 0, this.elements.length == i + 1));
		}
		
		this.table.setContentHtml(html.join(''));
	},
	
	buildElement: function(element, parent, level, last) {
		
		this.index++;
		var html = [];
		var columns = this.table.getColumns();
		html.push('<tr data-element-id="');
		html.push(this.index);
		var index = this.index;
		html.push('" data-parent-id="');
		html.push(parent);
		html.push('" class="');
		html.push(parent !== 0 ? 'ci-table-hidden' : '');
		html.push('">');
		
		var hasChildren = false;
		
		this.reIndexedElements[index] = element;
		
		if(level > 0)
			this.supNav[level] = last ? 'corner' : 'cross';
		for(var i = 0; i < columns.length; i++) {
			var name = columns[i].getName();
			
			hasChildren = false;
			if(element.children)
				hasChildren = true;
			
			var elVal = element.data[name];
			html.push(columns[i].buildElement(((typeof elVal != "undefined") ? elVal : ''), i == 0, this.supNav, hasChildren, level));
			
		}
		html.push('</tr>');
		
		if(element.children) {
			if(level > 0)
				this.supNav[level] = last ? 'space' : 'barre';
			for(var i = 0, len = element.children.length; i < len; i++) {
				html.push(this.buildElement(element.children[i], index, level + 1, i == len - 1));
				
			}
		}
		
		if(level > 0)
			delete this.supNav[level]; 
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
			if(!a.data[elName]) return 1;
			if(!b.data[elName]) return -1;
			return a.data[elName] > b.data[elName];
		});
		if(!asc)
			this.elements.reverse();
	},
	
	getElementById: function(id) {
		return this.reIndexedElements[id];
	}
}