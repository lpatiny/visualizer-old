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
		if(!(actions = this.module.definition.dataActions))	
			return;
			
		
		//getDomView
			
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
				
				var gridData = module.model.getValue();
				for(var i in gridData) {
					gridData = gridData[i];
					break;
				}
				
				var xpx = e.pageX - $(e.target).offset().left;
				var ypx = e.pageY - $(e.target).offset().top;
				
				var x = Math.floor(xpx * gridData.nbRows / e.target.width);
				var y = Math.floor(ypx * gridData.nbCols / e.target.height);
				
				
				var dataKeyed = gridData.dataMatrix[x][y];
				
				for(var i in actions.onPixelHover) {
					
					var hashmap = false;
					switch(i) {
						case 'row':
							hashmap = gridData.rows[y];	
						break;
						
						case 'col':
							hashmap = gridData.cols[x];
						break;
						
						case 'intersect':
							hashmap = dataKeyed;
						break;
					}
					
					if(!!hashmap) {
						var data = getDataToSend(hashmap, actions.onPixelHover[i].keys);
						console.log(data);
						console.log(hashmap);
						console.log(actions.onPixelHover[i].keys);
						CI.API.setSharedVar(actions.onPixelHover[i].sharedVar, data);
						
					}
				}
				
				
				
			});
		
		if(actions.onPixelClick) {}
		// do something if you want !
	}
}
