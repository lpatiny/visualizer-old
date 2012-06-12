 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */




(function() {
      google.load('visualization', '1.0', {'packages':['corechart']});
      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(function() {
      		console.log('Chart API ready');
      });
 })();
 
 
 
if(typeof CI.Module.prototype._types.display_value == 'undefined')
	CI.Module.prototype._types.display_value = {};

CI.Module.prototype._types.display_value.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.display_value.View.prototype = {
	
	init: function() {	
		var html = "";
		html += '<div></div>';
		this.dom = $(html);
		this.module.getDomContent().html(this.dom);
	},
	
	onResize: function() {
		
	},
	
	update: function() {
		
		var moduleValue;
		var view = this;
		if(!(moduleValue = this.module.getDataFromRel('value').getData()))
			return;
		
		CI.DataType.toScreen(moduleValue, this.module, function(val) {
		
			view.dom.html(val);	
		})
		
	},
	
	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {}
}

 