
if(typeof CI.Module.prototype._types.canvas_matrix == 'undefined')
	CI.Module.prototype._types.canvas_matrix = {};

CI.Module.prototype._types.canvas_matrix.Controller = function(module) {
	this.module = module;
	
}

CI.Module.prototype._types.canvas_matrix.Controller.prototype = {
	
	init: function() {
		
		var actions;
		if(!(actions = this.module.definition.dataActions))	
			return;
			
		if(actions.onPixelHover)
			this.module.getDomView().on('mousemove', 'canvas', function() {
				
				var cellX = 1;
				var cellY = 1;
				
				var data = this.module.module.getData();
				
				var dataKeyed = data[cellY][cellX];
				var dataToSendType = typeof actions.onPixelHover.keys;
				
				var dataToSend;
				if(dataToSendType == 'string')
					dataToSend = dataKeyed[actions.onPixelHover.keys]
				else if(dataToSendType == 'object') {
					dataToSend = {};
					for(var i in actions.onPixelHover.key)
						dataToSend[actions.onPixelHover.key[i]] = dataKeyed[actions.onPixelHover.key[i]];
				} else
					dataToSend = dataKeyed;
				
				CI.API.setSharedVar(actions.onPixelHover.sharedVar, dataToSend);
			});
		
		if(actions.onPixelClick) {}
		// do something if you want !
	}
}
