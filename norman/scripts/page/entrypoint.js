

CI.EntryPoint = function(options, onLoad) {
	
	this.options = options;
	this.onLoad = onLoad;
	
	
	switch(this.options.type) {
		
		case 'url':
			this.doFetchUrl();		
		break;
	}
	
	CI.DataSource.prototype._bindEvent();
}


CI.EntryPoint.prototype = {

	loaded: function(data) {
		
		this.data = data;
		
		for(var i in this.data)
			CI.API.setSharedVar(i, this.data[i], true);
		
		if(typeof this.onLoad == 'function')
			this.onLoad(this, this.data);
	},

	doFetchUrl: function() {
		
		var entryPoint = this;
		var url = this.options.url;
		var type = this.options.dataType;
		var func;
		
		switch(type) {
			
			default:
			case 'json':
			
				func = 'getJSON';
			break;
		}
		
		jQuery[func](url, {}, function(data) {
			entryPoint.loaded(data);
		});
	}
	
	
}
	
	
