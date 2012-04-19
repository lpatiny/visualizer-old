 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.grid == 'undefined')
	CI.Module.prototype._types.grid = {};

CI.Module.prototype._types.grid.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.grid.Controller.prototype = {
	
	
	init: function() {
		
		var module = this.module;
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
			/*	
		if(typeof actions.onEntryHover !== "undefined") {
			
			module.getDomView().on('mouseenter', 'div.ci-displaylist-element', function() {
				
				var index = $(this).index();
				for(var i = 0; i < actions.onEntryHover.length; i++) {
					switch(actions.onEntryHover[i].rel) {
						case 'element':
							var toSend = module.view.list[index];	
						break;
					}
					
					if(!!toSend) {
						var data = CI.Types.getValueFromJPath(actions.onEntryHover[i].key, toSend);
						CI.API.setSharedVar(actions.onEntryHover[i].name, data);
					}
				}
				
			});
		}*/
	},
	
	lineHover: function(element) {
		
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
				
		for(var i = 0; i < actions.length; i++) {
			
			if(actions[i].event == "onHover") {
				CI.API.setSharedVar(actions[i].name, element);
			}
		}
			
		
	},
	
	getConfigurationSend: function() {
		
		return {

			events: {
				onSelect: {
					label: 'Select a line',
					description: 'Click on a line to select it'
				},
				
				onHover: {
					label: 'Hovers a line',
					description: 'Pass the mouse over a line to select it'
				}
			},
			
			rels: {
				'element': {
					label: 'Row',
					description: 'Returns the selected row in the list'
				}
			}
		}
	},
	
	getConfigurationReceive: function() {
		return {
			list: {
				type: 'array',
				label: 'List',
				description: 'Any list of displayable element'
			}
		}
	}

}
