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
				(function(element, actionName, jpath) {
					
					CI.API.setSharedVarFromJPath(actionName, element, jpath);
					/*CI.DataType.getValueFromJPath(element, jpath, function(toSend) {
						CI.API.setSharedVar(actionName, toSend);	
					});*/
				}) (element, actions[i].name, actions[i].jpath)
			}
		}
	},
	
	
	
	lineClick: function(element) {
		
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
				
		for(var i = 0; i < actions.length; i++) {
			if(actions[i].event == "onSelect") {
				(function(element, actionName, jpath) {
					
					CI.API.setSharedVarFromJPath(actionName, element, jpath);
					/*CI.DataType.getValueFromJPath(element, jpath, function(toSend) {
						CI.API.setSharedVar(actionName, toSend);	
					});*/
				}) (element, actions[i].name, actions[i].jpath)
			}
		}
	},
	
	configurationSend: {

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
		
	},
	
	configurationReceive: {
		list: {
			type: ['array'],
			label: 'List',
			description: 'Any list of displayable element'
		}		
	},
	
	
	moduleInformations: {
		moduleName: 'Grid'
	},
	
	
	
	
	doConfiguration: function(section) {
		
		var groupfield = new BI.Forms.GroupFields.Table('cols');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Text',
			name: 'coltitle'
		});
		field.setTitle(new CI.Title('Columns title'));
		
		var options = [];
		if(data = this.module.getDataFromRel('list'))
			data = data.getData();
		
		if(data != null)
			CI.DataType.getJPathsFromElement(data[0], options);
		
		var field = groupfield.addField({
			type: 'Combo',
			name: 'coljpath'
		});
		field.implementation.setOptions(options);
		field.setTitle(new CI.Title('Value jPath'));
		
		return true;
	},
	
	doFillConfiguration: function() {
		
		var cols = this.module.getConfiguration().colsjPaths;
		var titles = [];
		var jpaths = [];
		for(var i in cols) {
			titles.push(i);
			jpaths.push(cols[i].jpath);
		}


		return {
			cols: [{
				coltitle: titles,
				coljpath: jpaths
			}]
		}
		
	},
	
	
	doSaveConfiguration: function(confSection) {
		
		var group = confSection[0].cols[0];
		
		var cols = {};
		for(var i = 0; i < group.length; i++)
			cols[group[i].coltitle] = { jpath: group[i].coljpath };
		
		this.module.getConfiguration().colsjPaths = cols;
		
		/*var coltitle = group.colnumber;
		var coljpath = group.valjPath;
		
		
		this.module.definition.configuration = {
			colnumber: colnumber,
			valjpath: valjpath,
			colorjpath: colorjpath
		};*/
	}
	

}
