 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.chemicalarray == 'undefined')
	CI.Module.prototype._types.chemicalarray = {};

CI.Module.prototype._types.chemicalarray.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.chemicalarray.View.prototype = {
	
	init: function() {	
		var html = [];
		html.push('<table cellpadding="0" cellspacing="0">');
		html.push('</table>');
		this.dom = $(html.join(''));
		this.module.getDomContent().html(this.dom);
		
	},
	
	onResize: function() {
		
	
	},
	
	update: function() {

		var moduleValue;
		var view = this;
		
		if(!(moduleValue = this.module.getDataFromRel('chemicals').getData()))
			return;
		
		this.chemicals = moduleValue;
		for(var i = 0; i < this.chemicals.length; i++) {
			
			var tr = $("<tr>").append('<td>').children().each(function() {
				var td = $(this);
				view.chemicals[i].instance.getIUPAC(function(val) {
					console.log(val);
					td.html(val);
				});
			}).end();
			this.dom.append(tr);
			
		}
	},
	

	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
		chemical: function(data) {
			return data.instance.getIUPAC();
		}
		
	}
}
