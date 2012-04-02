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
				
		if(typeof actions.onPixelHover !== "undefined") 
			$(this.module.getDomView()).on('mousemove', 'canvas', function(e) {
				
				function getDataToSend(hashmap, toselect) {
					var dataToSendType = typeof toselect, dataToSend;
					if(dataToSendType == 'string')
						dataToSend = hashmap[toselect]
					else if(dataToSendType == 'object') {
						dataToSend = {};
						for(var i in toselect)
							dataToSend[toselect[i]] = hashmap[toselect[i]];
					} else
						dataToSend = hashmap;
					return dataToSend;
				}
				
				
				var cellX = 1;
				var cellY = 1;
				
				var moduleValue;
				if(!(moduleValue = module.getDataFromRel('matrix').getData()))
					return;
				
				var xLabel = moduleValue.xLabel;
				var yLabel = moduleValue.yLabel;
				var gridData = moduleValue.value;
				
				//Positions relative to top-left of canvas
				var xpx = e.pageX - $(e.target).offset().left;
				var ypx = e.pageY - $(e.target).offset().top;
				
				//offset by the position of the grid within the canvas
				xpx += module.view.moduleCenterX * module.view.lastImageData.width - $(e.target).width()/2
				ypx += module.view.moduleCenterY * module.view.lastImageData.height - $(e.target).height()/2
				
				//grid coordinates
				var x = Math.floor(xpx / module.view.lastCellWidth);
				var y = Math.floor(ypx / module.view.lastCellHeight);
				if (x<0 || y<0 || x>=gridData.length || y>=gridData[0].length)
					return;
					
				var dataKeyed = gridData[x][y];
				var value = false;
				for(var i = 0; i < actions.onPixelHover.length; i++) {
					
					var hashmap = false;
					switch(actions.onPixelHover[i].rel) {
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
					
					if(!!hashmap) {
						var data = CI.Types.getValueFromJPath(actions.onPixelHover[i].key, hashmap);
						CI.API.setSharedVar(actions.onPixelHover[i].varname, data);
					} else if(!!value)
						CI.API.setSharedVar(actions.onPixelHover[i].varname, value);
				}
			});
		
		if(actions.onPixelClick) {
		}
		var view = this.module.view;
		// do something if you want !
	},
	
	getConfigurationSend: function() {
		
		return {

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
		}
	}
}
