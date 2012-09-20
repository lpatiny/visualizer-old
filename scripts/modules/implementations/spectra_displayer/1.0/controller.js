 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.spectra_displayer == 'undefined')
	CI.Module.prototype._types.spectra_displayer = {};

CI.Module.prototype._types.spectra_displayer.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.spectra_displayer.Controller.prototype = {
	
	init: function() {
	},

	zoomChanged: function(min, max) {
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
		for(var i = 0; i < actions.length; i++) {
			CI.API.blankSharedVar(actions[i].name);
			if(actions[i].event == "onZoomChange") {
				//console.log('Ok set');
				CI.API.setSharedVarFromJPath(actions[i].name, {type: 'fromTo', value: {from: min, to: max}}, actions[i].jpath);
			}
		}
	},
	
	configurationSend: {
		
		events: {
			onZoomChange: {
				label: 'on zoom change',
				description: 'When the zoom changes'
			}
		},
		
		rels: {
			'fromTo': {
				label: 'From - To',
				description: 'Sends the coordinates of the zoom'
			}
		}
	},
	
	configurationReceive: {
		jcamp: {
			type: 'jcamp',
			label: 'jcamp data',
			description: 'A jcamp file'
		},

		fromTo: {
			type: 'fromTo',
			label: 'From - To data',
			description: 'From - To data'
		}
	},

	moduleInformations: {
		moduleName: 'Jcamp display (CDWC)'
	},



	
	doConfiguration: function(section) {
		var groupfield = new BI.Forms.GroupFields.List('gencfg');
		section.addFieldGroup(groupfield);

		var field = groupfield.addField({
			type: 'Options',
			name: 'mode'
		});

		field.setTitle(new CI.Title('Mode'));
		field.implementation.setOptions({ 'peaks': 'Display as peaks', 'curve': 'Display as a curve' });
		return true;
	},
	
	doFillConfiguration: function() {
		
		var mode = this.module.getConfiguration().mode || 'peaks';
		
		return {
			
			gencfg: [{
				mode: [mode]
			}]
			
		}
		
	},
	
	doSaveConfiguration: function(confSection) {
		this.module.getConfiguration().mode = confSection[0].gencfg[0].mode[0];
		console.log(this.module.getConfiguration().mode);
	}
}
