 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.display_value == 'undefined')
	CI.Module.prototype._types.display_value = {};

CI.Module.prototype._types.display_value.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.display_value.Controller.prototype = {
	
	
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
		"value": {
			type: ['string', 'number'],
			label: 'Any string or number',
			description: ''
		}
	},
	
	
	moduleInformations: {
		moduleName: 'Display a value'
	},
	
	doConfiguration: function(section) {
		
		return true;
	},
	
	doFillConfiguration: function() {
	
		
	},
	
	
	doSaveConfiguration: function(confSection) {
	
	}
	

}
