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
		
		var jpaths = this.module.getConfiguration().colsjPaths;
		if(!(moduleValue = this.module.getDataFromRel('list').getData()))
			return;
		
		var Table = new CI.Tables.Table({
			
			onLineHover: function(element) {
				var source = element._source;
				view.module.controller.lineHover(source);
			}
		});
		
		var Columns = {};
		for(var j in jpaths) {
			var Column = new CI.Tables.Column(j);
			Column.setTitle(new CI.Title(j));
			
			if(jpaths[j].format)
				Column.format(jpaths[j].format);
			
			Table.addColumn(Column);
			Columns[j] = Column;
		}
		
		this.list = CI.Util.getValue(moduleValue);
		
		var Content = new CI.Tables.Content();
		var elements = [];
		this.buildElement(this.list, elements, jpaths);
		for(var i = 0, length = elements.length; i < length; i++)
			Content.addElement(elements[i]);
		
		Table.setContent(Content);
		Table.init(this.dom);
		
		
		$(document).trigger('checkAsyncLoad', [ this.dom ]);
	},
	

	buildElement: function(source, arrayToPush, jpaths) {
		var jpath;
		for(var i = 0, length = source.length; i < length; i++) {
			var element = {};
			element.data = {};
			for(var j in jpaths) {
				jpath = jpaths[j];
				if(jpath.jpath)
					jpath = jpath.jpath;
					
				element.data[j] = CI.dataType.toScreen(CI.Types.getValueFromJPath(jpath, source[i], element.data, j, this), this);
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
		
		
		asString: function(val) {
			return val;
		}
		
	}
}

/*
 * 
 * 


clearLog();
var mfRange = "C1-30H1-60O0-10N0-10";
var MM = 300.123;
var fragments = [100.123, 130.123];
var fragLength = fragments.length;

var result = [];

// we gave a target monoisotopic mass, we just retrieve possible molecular formula
var possibleMF=ChemCalc.mfFromMonoisotopicMass(MM, {mfRange: mfRange}).results;

// for the 10 best molecular formula, we try to find the one that would have a
// possible fragment with a mass of targetMass2
for (var i=0; i<possibleMF.length && i<10; i++) {
	result[i] = {};
	result[i].mf = possibleMF[i].mf;
	result[i].error = possibleMF[i].error;
	result[i].em = possibleMF[i].em;
	var intersection = ChemCalc.mfRangeIntersection(mfRange, possibleMF[i].mf, {});
	result[i].children = [];
	
	for(var j = 0; j < fragLength; j++) {
		result[i].children[j] = {
			mf: fragments[j],
			children: []
		};
		var possibleMFInt = ChemCalc.mfFromMonoisotopicMass(fragments[j], {mfRange: intersection.mf}).results;
		for (var k = 0; k < possibleMFInt.length && k < 10; k++) {
			result[i].children[j].children[k] = {};
			result[i].children[j].children[k].mf = possibleMFInt[k].mf;
			result[i].children[j].children[k].em = possibleMFInt[k].em;
			result[i].children[j].children[k].error = possibleMFInt[k].error;
		}

	}

}

jexport("possibleMF",result,"array");






*/
 