

CI.EntryPoint = function(structureUrl, dataUrl, options, onLoad) {
	
	
	this.options = options;
	this.onLoad = onLoad;
	
	var entryPoint = this;
	
	jQuery.getJSON(structureUrl, {}, function(pagedef) {
		
		CI.Grid.init(pagedef.grid);
		for(var i = 0; i < pagedef.modules.length; i++) {
			var Module = new CI.Module(pagedef.modules[i]); 
			CI.modules[pagedef.modules[i].id] = Module;
			CI.Grid.addModule(Module);
		}
		
		CI.DataSource.prototype._bindEvent();
				
		jQuery.getJSON(dataUrl, {}, function(data) {
			entryPoint.loaded(data);	
		});
	});
}


CI.EntryPoint.prototype = {

	loaded: function(data) {
		
		this.data = data;
		
		for(var i in this.data)
			CI.API.setSharedVar(i, this.data[i], true);
		
		if(typeof this.onLoad == 'function')
			this.onLoad(this, this.data);
	},

	
	
}
	
	
