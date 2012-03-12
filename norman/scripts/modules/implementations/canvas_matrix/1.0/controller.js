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
		/*
		 * Binds sharedDataChanged event that triggers a view update.
		 * Don't call it you want to manually controll the view update
		 */
		CI.Module.prototype._impl.controller.doBindDataChange.call(this);
		
		var actions;
		if(!(actions = this.module.definition.dataActions))	
			return;
			
		
		//getDomView
			
		if(typeof actions.onPixelHover !== "undefined")
			$(this.module.getDomView()).on('mousemove', 'canvas', function(e) {
				
				var cellX = 1;
				var cellY = 1;
				
				var gridData = module.model.getValue();
				for(var i in gridData) {
					gridData = gridData[i];
					break;
				}
				
				var xpx = e.pageX - $(e.target).offset().left;
				var ypx = e.pageY - $(e.target).offset().top;
				
				var x = Math.floor(xpx * gridData.rows / e.target.width);
				var y = Math.floor(ypx * gridData.cols / e.target.height);
				
				var valKeyed = gridData.dataMatrix[x][y];
				var dataKeyed = gridData.data[x][y];
			
				//var dataKeyed = data[cellY][cellX];
				var dataToSendType = typeof actions.onPixelHover.keys;
				
				var dataToSend;
				if(dataToSendType == 'string')
					dataToSend = dataKeyed[actions.onPixelHover.keys]
				else if(dataToSendType == 'object') {
					dataToSend = {};
					for(var i in actions.onPixelHover.keys)
						dataToSend[actions.onPixelHover.keys[i]] = dataKeyed[actions.onPixelHover.keys[i]];
				} else
					dataToSend = dataKeyed;
				
				CI.API.setSharedVar(actions.onPixelHover.sharedVar, dataToSend);
			});
		
		if(actions.onPixelClick) {}
		// do something if you want !
	}
}
