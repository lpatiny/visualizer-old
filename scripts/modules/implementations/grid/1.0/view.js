 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.grid == 'undefined')
	CI.Module.prototype._types.grid = {};

CI.Module.prototype._types.grid.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.grid.View.prototype = {
	
	init: function() {	
		var html = [];
		html.push('<div class="ci-displaylist-list"></div>');
		this.dom = $(html.join(''));
		this.module.getDomContent().html(this.dom);
	},
	
	onResize: function() {
		
	
	},
	
	update: function() {

		var moduleValue;
		var view = this;
		
		if(!(moduleValue = this.module.getDataFromRel('list').getData()))
			return;
		
		var jpaths = this.module.getConfiguration().colsjPaths;
		var Table = new CI.Tables.Table();
		var Columns = {};
		for(var j in jpaths) {
			var Column = new CI.Tables.Column(j);
			Column.setTitle(new CI.Title(j));
			Table.addColumn(Column);
			Columns[j] = Column;
		}
		
		this.list = moduleValue.value;
		console.log(this.list);
		var Content = new CI.Tables.Content();
		for(var i = 0, length = this.list.length; i < length; i++) {
			var element = {};
			for(var j in jpaths)
				element[j] =  CI.dataType.toScreen(CI.Types.getValueFromJPath(jpaths[j], this.list[i], element, j), this);
			Content.addElement(element);
		}
		Table.setContent(Content);
		Table.init(this.dom);
	},
	

	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
		asChemical: function(data) {
			
			return $('<div class="ci-displaylist-element"></div>').each(function(i) {
					var div = $(this);
					data.instance.getIUPAC(function(val) {
						console.log(div);
						div.html(val);
					});
				});
		},
		
		asString: function(val) {
			return val;
		}
		
	}
}
