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
				(function(data, jpath, name) {
					CI.DataType.getValueFromJPath(data, jpath, function(toSend) {
						CI.API.setSharedVar(name, toSend);	
					});
				}) (data, actions[i].jpath, actions[i].name);
			}
		}
	},
	
	configurationReceive: {
		"chart": {
			type: ['chart'],
			label: 'Formatted data for a chart',
			description: ''
		}	
	},
	
	moduleInformations: {
		moduleName: 'Chart'
	},
	
	doConfiguration: function(section) {
		
		var groupfield = new BI.Forms.GroupFields.List('module');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Combo',
			name: 'charttype'
		});
		field.implementation.setOptions([{ title: "Horizontal Bar Chart", key: "hbarchart"}, { title: "Vertical Bar Chart", key: "vbarchart"}, { title: "Line chart", key: "linechart"}]);
		field.setTitle(new CI.Title('Chart type'));
	

		var field = groupfield.addField({
			type: 'Text',
			name: 'linewidth'
		});
		field.setTitle(new CI.Title('Line width'));
		
		
		var field = groupfield.addField({
			type: 'Text',
			name: 'pointsize'
		});
		field.setTitle(new CI.Title('Point size'));
		

		return true;
	},
	
	doFillConfiguration: function() {
	
		var cfg = this.module.getConfiguration();
		var linewidth = cfg.linewidth || 0;
		var charttype = cfg.charttype || "linechart";
		var pointsize = cfg.pointsize || 7;
		
		return {
			module: [{
				linewidth: [linewidth],
				pointsize: [pointsize],
				charttype: [charttype]
			}]
		}
	},
	
	
	doSaveConfiguration: function(confSection) {
		
		var group = confSection[0].module[0];
		
		var linewidth = group.linewidth[0];
		var charttype = group.charttype[0];
		var pointsize = group.pointsize[0];

		this.module.definition.configuration = {
			linewidth: linewidth,
			pointsize: pointsize,
			charttype: charttype
		};

		
	}
}
