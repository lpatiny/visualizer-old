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

	inDom: function() {},
	
	onResize: function() {
		
	
	},
	
	update: function() {
		
		var moduleValue;
		var view = this;
		
		var jpaths = this.module.getConfiguration().colsjPaths;
		if(!(moduleValue = this.module.getDataFromRel('list')))
			return;
			
		moduleValue = moduleValue.getData();
		
		var Table = new CI.Tables.Table({
			
			onLineHover: function(element) {
				var source = element._source;
				view.module.controller.lineHover(source);
			},
			
			onLineClick: function(element) {
				var source = element._source;
				view.module.controller.lineClick(source);
			},

			onPageChanged: function(newPage) {
				CI.Util.ResolveDOMDeferred(Table.getDom());
			}
		});
		
		
		var nbLines;
		if(nbLines = this.module.getConfiguration().nbLines)
			Table.setPagination(nbLines);
		
		var Columns = {};
		for(var j in jpaths) {
			var Column = new CI.Tables.Column(j);
			Column.setTitle(new CI.Title(j));
			
			if(jpaths[j].format)
				Column.format(jpaths[j].format);
			
			Table.addColumn(Column);
			Columns[j] = Column;
		}
	
		var list = CI.DataType.getValueIfNeeded(moduleValue);
		var Content = new CI.Tables.Content();
		var elements = [];
		view.buildElement(list, elements, jpaths);
		for(var i = 0, length = elements.length; i < length; i++)
			Content.addElement(elements[i]);
		Table.setContent(Content);
		Table.init(view.dom);

		CI.Util.ResolveDOMDeferred(Table.getDom());
	},

	buildElement: function(source, arrayToPush, jpaths, colorJPath) {
		var jpath;
		var box = this.module;
		
		for(var i = 0, length = source.length; i < length; i++) {
			var element = {};
			element.data = {};
			element._color;

			if(colorJPath)
				element._color = CI.DataType.getValueFromJPath(source[i], colorJPath);

			for(var j in jpaths) {
				jpath = jpaths[j];
				if(jpath.jpath)
					jpath = jpath.jpath;

					CI.DataType.asyncToScreenHtml(source[i], box, jpath).done(function(val) {


						element.data[j] = val;
					});
			}
			
			
			if(source[i].children) {
				element.children  = [];
				this.buildElement(source[i].children, element.children, jpaths);
			}
			
			element._source = source[i];
			
			arrayToPush.push(element);
		}
	},


	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
	
	}
}

 