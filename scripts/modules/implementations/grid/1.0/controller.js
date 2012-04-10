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
	
	getConfigurationSend: function() {
		
		return {

			events: {
				onEntryHover: {
					label: 'mouse over a grid',
					description: 'When the mouses moves over a cell'
				}
			},
			
			rels: {
				'row': {
					label: 'Selected row',
					description: 'Returns the selected element in the list'
				},
				
				'col': {
					label: 'Selected coll',
					description: 'Returns the selected element in the list'
				},
				
				'interset': {
					label: 'Selected cell',
					description: 'Returns the selected element in the list'
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
