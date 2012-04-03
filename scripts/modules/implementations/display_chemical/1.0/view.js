 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.display_chemical == 'undefined')
	CI.Module.prototype._types.display_chemical = {};

CI.Module.prototype._types.display_chemical.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.display_chemical.View.prototype = {
	
	init: function() {	
		var html = [];
		html.push('<div class="ci-displaychemical-chemical"></div>');
		this.dom = $(html.join(''));
		this.module.getDomContent().html(this.dom);
	},
	
	onResize: function() {
		
	
	},
	
	update: function() {

		var moduleValue;
		var view = this;
		
		if(!(moduleValue = this.module.getDataFromRel('chemical').getData()))
			return;
		
		this.chemical = moduleValue;
		var div = CI.dataType.toScreen(this.chemical, this);
		
		this.dom.html(div);
	},
	
	

	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
		asChemical: function(data) {
			return $('<div class="ci-displaylist-list">').each(function(i) {
					var div = $(this);
					div.append('<div class="ci-chemical-iupac"></div><div class="ci-chemical-mw"></div>');
					data.instance.getIUPAC(function(val) {
						div.children('.ci-chemical-iupac').html(val);
					});
					
					data.instance.getMW(function(val) {
						div.children('.ci-chemical-mw').html(val);
					});
					
				});
		}
		
	}
}
