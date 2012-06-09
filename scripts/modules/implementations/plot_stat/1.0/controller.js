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
			onHover: {
				label: 'Hovers an element',
				description: 'Pass the mouse over a line to select it'
			}
		},
		
		rels: {
			'element': {
				label: 'The selected element data',
				description: 'Returns the selected element'
			}
		}
		
	},
	
	hoverEvent: function(data) {
		
			
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
				
		for(var i = 0; i < actions.length; i++) {
			if(actions[i].event == "onHover") {
				var j = i;
				CI.DataType.getValueFromJPath(data, actions[j].jpath, function(toSend) {
					CI.API.setSharedVar(actions[j].name, toSend);	
				});
			}
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
