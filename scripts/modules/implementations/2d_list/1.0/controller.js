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
					
		for(var i = 0; i < actions.length; i++) {
			
			var j = i;
			if(actions[i].event == "onHover") {
				
				this.module.getDomView().on('hover', 'table td', function() {
					
					var tdIndex = $(this).index();
					var trIndex = $(this).parent().index();
					
					var cols = module.getConfiguration().colnumber || 4;
					
					var elementId = trIndex * cols + tdIndex;
					if(!(moduleValue = module.getDataFromRel('list').getData()))
						return;
					var value = CI.DataType.getValueIfNeeded(moduleValue);
					var k = j;
					
					CI.API.setSharedVarFromJPath(actions[k].name, value[elementId], actions[j].jpath);
				});
				
			}
		}
	},
	/*
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
	*/
	configurationSend:  {

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
	},
	
	configurationReceive: {
		list: {
			type: 'array',
			label: 'List',
			description: 'Any list of displayable element'
		
		}
	},
	
	moduleInformations: {
			moduleName: '2D list'
	},
	
	doConfiguration: function(section) {
		
		var groupfield = new BI.Forms.GroupFields.List('module');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Text',
			name: 'colnumber'
		});
		field.setTitle(new CI.Title('Columns number'));
		
		
		var jpaths = [];
		if(data = this.module.getDataFromRel('list')) {
			data = data.getData();
			if(data != null)
				CI.DataType.getJPathsFromElement(data[0], jpaths);
		}

		var field = groupfield.addField({
			type: 'Combo',
			name: 'valjPath'
		});
		field.implementation.setOptions(jpaths);
		field.setTitle(new CI.Title('Value jPath'));
		
		
		var field = groupfield.addField({
			type: 'Combo',
			name: 'colorjPath'
		});
		//options.unshift({ title: 'None', key: 'none'});
		field.implementation.setOptions(jpaths);
		field.setTitle(new CI.Title('Color jPath'));
		
		return true;
	},
	
	doFillConfiguration: function() {
		
		var valJpath = this.module.getConfiguration().valjpath || "";
		var colorJpath = this.module.getConfiguration().colorjpath || "none";
		var cols = this.module.getConfiguration().colnumber || 4;
		
		return {
			module: [{
				colnumber: [cols],
				valjPath: [valJpath],
				colorjPath: [colorJpath]
			}]
		}
		
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
