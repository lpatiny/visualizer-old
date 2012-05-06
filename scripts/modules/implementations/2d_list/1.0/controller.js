 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types['2d_list'] == 'undefined')
	CI.Module.prototype._types['2d_list'] = {};

CI.Module.prototype._types['2d_list'].Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types['2d_list'].Controller.prototype = {
	
	
	init: function() {
		
		var module = this.module;
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
		
	},
	
	cellHover: function(element) {
		
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
				
		for(var i = 0; i < actions.length; i++) {
			
			if(actions[i].event == "onHover") {
				var toSend = CI.Types.getValueFromJPath(actions[i].jpath, element);
				if(toSend != null)
					CI.API.setSharedVar(actions[i].name, toSend);
			}
		}
			
		
	},
	
	getConfigurationSend: function() {
		
		return {

			events: {
				
				onHover: {
					label: 'Hovers a cell',
					description: ''
				}
			},
			
			rels: {
				'cell': {
					label: 'Cell',
					description: 'Returns the selected cell element'
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
	},
	
	
	getModuleInformations: function() {
		
		return {
			moduleName: '2D list'
			
		}
	},
	
	doConfiguration: function(section) {
		
		var groupfield = new BI.Forms.GroupFields.List('module');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Text',
			name: 'colnumber'
		});
		field.setTitle(new CI.Title('Columns number'));
		
		var options = CI.Types._jPathToOptions(this.module.model.getjPath('list'));
		var field = groupfield.addField({
			type: 'Combo',
			name: 'valjPath'
		});
		field.implementation.setOptions(options);
		field.setTitle(new CI.Title('Value jPath'));
		
		
		var field = groupfield.addField({
			type: 'Combo',
			name: 'colorjPath'
		});
		field.implementation.setOptions(options);
		field.setTitle(new CI.Title('Color jPath'));
		
		return true;
	},
	
	doSaveConfiguration: function(confSection) {
		
		var group = confSection[0].module[0];
		
		var colnumber = group.colnumber[0];
		var valjpath = group.valjPath[0];
		var colorjpath = group.colorjPath[0];
		
		this.module.definition.configuration = {
			colnumber: colnumber,
			valjpath: valjpath,
			colorjpath: colorjpath
		};
	}
	
	


}
