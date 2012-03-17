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
	
	_accepts: [{rel: 'matrix', type: 'matrix'}],
	
	getAcceptedTypes: function(rel) {
		
		for(var i in this._accepts)
			if(this._accepts[i].rel == rel) {
				return this._accepts[i];
			}
			
		return { data: rel, type: [], asObject: false };
	},
	
	
	init: function() {
		
		var module = this.module;
		
		var actions;
		if(!(actions = this.module.definition.dataSend))	
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
				
				var moduleValue;
				if(!(moduleValue = module.getDataFromRel('matrix').getData()))
					return;
				
				var xLabel = moduleValue.xLabel;
				var yLabel = moduleValue.yLabel;
				var gridData = moduleValue.value;
				
				
				var xpx = e.pageX - $(e.target).offset().left;
				var ypx = e.pageY - $(e.target).offset().top;
				
				var x = Math.floor(xpx * xLabel.length / e.target.width);
				var y = Math.floor(ypx * yLabel.length / e.target.height);
				
				var dataKeyed = gridData[x][y];
				var value = false;
				for(var i = 0; i < actions.onPixelHover.length; i++) {
					
					var hashmap = false;
					switch(actions.onPixelHover[i].rel) {
						case 'row':
							hashmap = yLabel[y];	
						break;
						
						case 'col':
							hashmap = xLabel[x];
						break;
						
						case 'intersect':
							hashmap = false;
							value = dataKeyed;
						break;
					}
					
					if(!!hashmap) {
						var data = getDataToSend(hashmap, actions.onPixelHover[i].keys);
						CI.API.setSharedVar(actions.onPixelHover[i].varname, data);
					} else if(!!value)
						CI.API.setSharedVar(actions.onPixelHover[i].varname, value);
				}
			});
		
		if(actions.onPixelClick) {}
		// do something if you want !
	}
}
