 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.hashmap_displayer == 'undefined')
	CI.Module.prototype._types.hashmap_displayer = {};

CI.Module.prototype._types.hashmap_displayer.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.hashmap_displayer.View.prototype = {
	
	init: function() {	
		this.dom = $("<div />").appendTo(this.module.getDomContent());
	},
	
	onResize: function() {
		
	},
	
	update: function() {
		
		html = [];
		var moduleValue = this.module.getValue();
		for(var i in moduleValue) {
			
			html.push('<table>');
			
			for(var j in moduleValue[i]) {
				html.push('<tr><td class="ci-label">');
				html.push(j);
				html.push('</td><td>');
				html.push(moduleValue[i][j]);
				html.push('</td></tr>');
			}
			
			html.push('</table>');
		}
		
		this.getDom().html(html.join(''));
	},
	
	getDom: function() {
		return this.dom;
	}
}
