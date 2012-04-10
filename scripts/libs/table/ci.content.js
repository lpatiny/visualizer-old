
CI.Tables.Content = function() {
	
	this.elements = [];
	this.table;
	this.seach;
	this.pagination;
	this.page;
}


CI.Tables.Content.prototype = {
	
	setTable: function(table) {
		this.table = table;
	},
	
	addElement: function(elJson) {
		this.elements.push(elJson);
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
				html.push('<td>');
				html.push(elVal)
				html.push('</td>');
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
	}
}

