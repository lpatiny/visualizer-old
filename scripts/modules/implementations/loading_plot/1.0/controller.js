 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.loading_plot == 'undefined')
	CI.Module.prototype._types.loading_plot = {};

CI.Module.prototype._types.loading_plot.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.loading_plot.Controller.prototype = {
	
	
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
		loading: {
			type: ["loading"],
			label: 'Loading variable',
			description: 'The main variable'
		}		
	},
	
	
	moduleInformations: {
		moduleName: 'Loading plot'
	},
	
	
	
	
	doConfiguration: function(section) {
		/*
		
		var groupfield = new BI.Forms.GroupFields.List('gencfg');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Text',
			name: 'nblines'
		});
		field.setTitle(new CI.Title('Lines per page'));
		
		var data = this.module.getDataFromRel('list');
		var jpaths = [];
		
		if(CI.DataType.getType(data) == 'array') 
			CI.DataType.getJPathsFromElement(data[0], jpaths);
		else if(CI.DataType.getType(data) == 'arrayXY')
			CI.DataType.getJPathsFromElement(data, jpaths);
		
		var field = groupfield.addField({
			type: 'Combo',
			name: 'colorjpath'
		});
		
		field.implementation.setOptions(jpaths);
		field.setTitle(new CI.Title('Color jPath'));

		var field = groupfield.addField({
			type: 'Checkbox',
			name: 'displaySearch'
		});
		field.implementation.setOptions({ 'allow': 'Allow searching'});
		field.setTitle(new CI.Title('Searching'));
		


		var groupfield = new BI.Forms.GroupFields.Table('cols');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Text',
			name: 'coltitle'
		});
		field.setTitle(new CI.Title('Columns title'));
		
		var field = groupfield.addField({
			type: 'Combo',
			name: 'coljpath'
		});
		field.implementation.setOptions(jpaths);
		field.setTitle(new CI.Title('Value jPath'));
		*/
		return true;
	},
	
	doFillConfiguration: function() {
		
		/*var cols = this.module.getConfiguration().colsjPaths;
		var nblines = this.module.getConfiguration().nbLines || 20;
		var colorjPath = this.module.getConfiguration().colorjPath || '';
		var search = this.module.getConfiguration().displaySearch || false;
		
		var titles = [];
		var jpaths = [];
		for(var i in cols) {
			titles.push(i);
			jpaths.push(cols[i].jpath);
		}


		return {
			
			gencfg: [{
				nblines: [nblines],
				colorjpath: [colorjPath],
				displaySearch: [[search ? 'allow' : '']]
			}],
			
			cols: [{
				coltitle: titles,
				coljpath: jpaths
			}]
		}
		*/
	},
	
	doSaveConfiguration: function(confSection) {
		/*var group = confSection[0].cols[0];
		var cols = {};
		for(var i = 0; i < group.length; i++)
			cols[group[i].coltitle] = { jpath: group[i].coljpath };
		this.module.getConfiguration().colsjPaths = cols;
		this.module.getConfiguration().nbLines = confSection[0].gencfg[0].nblines[0];
		this.module.getConfiguration().colorjPath = confSection[0].gencfg[0].colorjpath[0];
		this.module.getConfiguration().displaySearch = !!confSection[0].gencfg[0].displaySearch[0][0];
		*/
	},

	export: function() {
		
	}

}
