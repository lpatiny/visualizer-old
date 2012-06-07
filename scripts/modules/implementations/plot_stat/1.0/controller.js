 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.plot_stat == 'undefined')
	CI.Module.prototype._types.plot_stat = {};

CI.Module.prototype._types.plot_stat.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.plot_stat.Controller.prototype = {
	
	
	init: function() {
		
		var module = this.module;
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
	
	},
	
	configurationSend: {

		events: {
		
		},
		
		rels: {
			
		}
		
	},
	
	configurationReceive: {
		"lineChart": {
			type: 'xyChart',
			label: 'Scatter plot',
			description: 'A scatter plot'
		}	
	},
	
	
	moduleInformations: {
		moduleName: 'Statistical Plot'
	},
	
	
	
	
	doConfiguration: function(section) {
		
		return true;
	},
	
	doFillConfiguration: function() {
	
		
	},
	
	
	doSaveConfiguration: function(confSection) {
	
	}
	

}
