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
		},

		preferences: {
			type: ["object"],
			label: 'Preferences',
			description: 'The preferences'
		}
	},
	
	moduleInformations: {
		moduleName: 'Loading plot'
	},
	
	doConfiguration: function(section) {
		
		var section2 = new BI.Forms.Section('_module_layers', {multiple: true});
		section2.setTitle(new CI.Title('Layer'));
		section.addSection(section2, 1);

		var groupfield = new BI.Forms.GroupFields.List('config');
		section2.addFieldGroup(groupfield);


		/* */
		var opts = [];
		var data = this.module.getDataFromRel('loading');
		var jpaths = [];
		if(data && data.value)
			for(var i = 0; i < data.value.series.length; i++) 
				opts.push({title: data.value.series[i].label, key: data.value.series[i].category });
		var field = groupfield.addField({
			type: 'Combo',
			name: 'el'
		});
		field.implementation.setOptions(opts);
		field.setTitle(new CI.Title('Layer'));
		/* */


		var field = groupfield.addField({
			type: 'Combo',
			name: 'type'
		});
		field.implementation.setOptions([{key: 'ellipse', title: 'Ellipse / Circle'}, {key: 'pie', title: 'Pie Chart'}]);
		field.setTitle(new CI.Title('Display as'));


		/* */
		var field = groupfield.addField({
			type: 'Combo',
			name: 'colorjpath'
		});
		field.setTitle(new CI.Title('Color'));
		

		/* */


		var field = groupfield.addField({
			type: 'Checkbox',
			name: 'display_labels'
		});
		field.setTitle(new CI.Title('Labels'))
		
		field.implementation.setOptions({'display_labels': 'Display', 'forcefield': 'Activate force field'});


		return true;
	},
	
	doFillConfiguration: function() {
		
		var cfgLayers = this.module.getConfiguration().layers || [];
		
		var titles = [];
		var layers = [];
		for(var i = 0; i < cfgLayers.length; i++) {

			var cfgLocalLayer = { groups: {config: [{ el: [cfgLayers[i].layer], type: [cfgLayers[i].display] }] } };
			layers.push(cfgLocalLayer)
		}

		el = { sections: {
			_module_layers: layers
			}
		};
		return el;
	},
	
	doSaveConfiguration: function(confSection) {

		var group = confSection[0]._module_layers;
		
		var layers = [];
		for(var i = 0; i < group.length; i++) {
			layers.push({ layer: group[i].config[0].el[0], display: group[i].config[0].type[0] });
		}
	
		this.module.getConfiguration().layers = layers;	
	},

	export: function() {
		
	}

}
