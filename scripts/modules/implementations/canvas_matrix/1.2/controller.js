 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.canvas_matrix == 'undefined')
	CI.Module.prototype._types.canvas_matrix = {};

CI.Module.prototype._types.canvas_matrix.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.canvas_matrix.Controller.prototype = {
	
	
	init: function() {
		
		var module = this.module;
		var actions;
		if(!(actions = this.module.definition.dataSend))	
			return;
		
		
		$(this.module.getDomContent()).on('mousemove', 'canvas', $.debounce(250, function(e) {
		
			var moduleValue;
			if(!(moduleValue = module.getDataFromRel('matrix')))
				return;
			
			moduleValue = moduleValue.getData();
			var pxPerCell = module.view.getPxPerCell();
			var shift = module.view.getXYShift();
			
			
			e.offsetX = (e.offsetX || e.pageX - $(e.target).offset().left); 
			e.offsetY = (e.offsetY || e.pageY - $(e.target).offset().top);
			
			var x = Math.floor((e.offsetX - shift.x) / pxPerCell) - 1;
			var y = Math.floor((e.offsetY - shift.y) / pxPerCell) - 1;
			
			moduleValue = moduleValue.value;
			var xLabel = moduleValue.xLabel;
			var yLabel = moduleValue.yLabel;
			var gridData = moduleValue.data;
			
			if (x < 0 || y < 0 || y >= gridData.length || x >= gridData[0].length)
				return;
			
			var dataKeyed = gridData[x][y];
			var value = false;
			
			for(var i in actions) {
				
				var j = i;
				
				if(actions[i].event == "onPixelHover") {
					

					var hashmap = false;
					switch(actions[i].rel) {
						case 'row':
							//yLabel[y].id = x + ", " + y;
							hashmap = yLabel[y];	
						break;
						
						case 'col':
							//yLabel[x].id = x + ", " + y;
							hashmap = xLabel[x];
						break;
						
						case 'intersect':
							hashmap = false;
							value = dataKeyed;
						break;
					}
					
					(function(h, jpath, name, value, hashmap) {
						
						if(!!hashmap) {
							var data = CI.DataType.getValueFromJPath(hashmap, jpath, function(value) {
								CI.API.setSharedVar(name, value);
							});
							
						} else if(!!value)
							var data = CI.DataType.getValueFromJPath(value, jpath, function(value) {
								CI.API.setSharedVar(name, value);
							});
						
						
					}) (j, actions[j].jpath, actions[j].name, value, hashmap);
				}
			}
		}));
			
		if(actions.onPixelClick) {
		}
		var view = this.module.view;
		// do something if you want !
	},
	
	configurationSend: {

		events: {
			onPixelHover: {
				label: 'mouse hover pixel',
				description: 'When the mouses moves over a new pixel of the data matrix'
			},
			onPixelClick: {
				label: 'click on a pixel',
				description: 'When the users click on any pixel'
			},
			onPixelDblClick: {
				label: 'double click on a pixel',
				description: 'When the user double clics on any pixel'
			}
		},
		
		rels: {
			'row': {
				label: 'Row',
				description: 'Sends the information description the row'
			},
			
			'col': {
				label: 'Column',
				description: 'Sends the information description the column'
			},
			
			'intersect': {
				label: 'Intersection',
				description: 'Sends the information description the intersection where the mouse is located'
			}
		}
	},
	
	configurationReceive: {
		'matrix': {
			type: 'matrix',
			label: 'Matrix',
			description: 'Receives the matrix to display'
		}
	},
	
	moduleInformations: {
		moduleName: 'Distance matrix'
	},
	
	
	
	doConfiguration: function(section) {
		
		var groupfield = new BI.Forms.GroupFields.List('opts');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Checkbox',
			name: 'highcontrast'
		});
		field.implementation.setOptions({ 'true': 'Take data min/max as boundaries'});
		field.setTitle(new CI.Title('Contrast'));
		
		
		var groupfield = new BI.Forms.GroupFields.Table('colors');
		section.addFieldGroup(groupfield);
		
		var field = groupfield.addField({
			type: 'Color',
			name: 'color'
		});
		field.setTitle(new CI.Title('Color'));
		
		return true;
	},
	
	doFillConfiguration: function() {
		
		var cols = this.module.getConfiguration().colors || [];
		var highcontrast = this.module.getConfiguration().highContrast || false;

		return {
			
			opts: [{
				highcontrast: [highcontrast ? ['true'] : []]
			}], 
			
			colors: [{
				color: cols
			}]
		}
		
	},
	
	
	doSaveConfiguration: function(confSection) {
		
		var group = confSection[0].colors[0];
		
		var colors = [];
		for(var i = 0; i < group.length; i++)
			colors.push(group[i].color);
		
		this.module.getConfiguration().colors = colors;
		this.module.getConfiguration().highContrast = confSection[0].opts[0].highcontrast[0][0];
		
		/*var coltitle = group.colnumber;
		var coljpath = group.valjPath;
		
		
		this.module.definition.configuration = {
			colnumber: colnumber,
			valjpath: valjpath,
			colorjpath: colorjpath
		};*/
	}
	

}
