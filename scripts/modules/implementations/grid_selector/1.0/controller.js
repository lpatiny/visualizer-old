 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.grid_selector == 'undefined')
	CI.Module.prototype._types.grid_selector = {};

CI.Module.prototype._types.grid_selector.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.grid_selector.Controller.prototype = {
	
	
	init: function() {
		
		var module = this.module;
		var actions;
		this._currentValue = {};
		if(!(actions = this.module.definition.dataSend))	
			return;
	},

	selectorChanged: function(col, line, value) {
		this._currentValue[col] = this._currentValue[col] || {};
		this._currentValue[col][line] = value;
		this.module.getConfiguration()._data = this._currentValue;

		var obj = {};
		obj[col] = {};
		obj[col][line] = value;
		this.sendEvent(obj);
	},

	setSelector: function(select) {
		this._currentValue = select;
		this.module.getConfiguration()._data = this._currentValue;	

		this.sendEvent(this._currentValue);
	},


	sendEvent: function(obj) {
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
		for(var i = 0; i < actions.length; i++) {
			if(actions[i].event == "onChangePref") {
				CI.Repo.set(actions[i].name, obj);
			}
		}
	},
	
	configurationSend: {

		events: {

			onChangePref: {
				label: 'A preference has been changed',
				description: 'When a preference changes'
			}
			
		},
		
		rels: {
			'listPref': {
				label: 'Preference grid',
				description: ''
			}
		}
		
	},
	
	configurationReceive: {
		preferences: {
			type: ["array"],
			label: 'Preferences',
			description: 'A list of preferences'
		}		
	},
	
	
	moduleInformations: {
		moduleName: 'Selector Grid'
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
		/*
		var cols = this.module.getConfiguration().colsjPaths;
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
		/*
		var group = confSection[0].cols[0];
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
		//return this.module.view.table.exportToTabDelimited();
	}
}
