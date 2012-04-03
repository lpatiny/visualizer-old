

CI.EntryPoint = function(structure, data, options, onLoad) {
	
	this.options = options;
	this.onLoad = onLoad;
	
	var entryPoint = this;
	
	
	function init() {
		if(typeof structure == "object")
			doStructure(structure);
		else
			doGetStructure(structure);
	}
	
	function doStructure(structure) {
		
		CI.Grid.init(structure.grid);
		for(var i = 0; i < structure.modules.length; i++) {
			var Module = new CI.Module(structure.modules[i]); 
			CI.modules[structure.modules[i].id] = Module;
			CI.Grid.addModule(Module);
		}
		
		CI.DataSource.prototype._bindEvent();
		
		if(typeof data == "object")
			doData(data);
		else
			doGetData(data);
		
	}
	
	function doGetStructure(structure) {
		jQuery.getJSON(structure, {}, function(structure) {
			doStructure(structure);
		});
	}
	
	function doData(page) {
		entryPoint.loaded(page);
	}
	
	function doGetData(data) {
		jQuery.getJSON(data, {}, function(data) {
			doData(data);	
		});
	}
	
	init();
}


CI.EntryPoint.prototype = {

	






	loaded: function(data) {
		
		this.data = data;
		
		for(var i in this.data) {
			CI.dataType.instanciate(this.data[i]);
			CI.API.setSharedVar(i, this.data[i], true);
			
		}
		
		
		
		if(typeof this.onLoad == 'function')
			this.onLoad(this, this.data);
	},

	
	
}
	
	
