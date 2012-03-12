

CI.DataSource = function(module, sourceName, sourceData) {
	
	this.module = module;
	this.sourceName = sourceName;
	this.sourceData = sourceData;
	this.data = null;
	
	// No action required ?
	if(this.sourceData == null)
		return;
	
	if(typeof this.sourceData.type == "undefined")
		return;
	
	
	// What is the required action ?
	switch(this.sourceData.type) {
		
		case 'url':
			this.sourceUrl();
		break;
		
		default:
			
		break;
	}
}


CI.DataSource.prototype = {
	
	setData: function(data) {
		this.data = data;
	},
	
	getData: function() {
		return this.data;
	},
	
	getSourceData: function() {
		return this.sourceData;
	},
	
	eraseAjaxData: function() {
		this.sourceData = {};
	},
	
	setAjaxData: function(data) {
		
		if(typeof this.sourceData.data )
		this.sourceData.data = $.extend(this.sourceData.data, data);	
	},
	
	doGetAjaxData: function() {
	
		if(this.sourceData.type == "url")
			return this.sourceUrl();
			
		throw "Impossible to get the data. DataSource does not support it"
	},
	
	sourceUrl: function() {
		
		if(typeof this.sourceData.url == 'undefined')
			return;
		
		if(typeof this.sourceData.dataType == "undefined")
			this.sourceData.dataType = 'html';
		
		if(typeof this.sourceData.method == 'undefined' || ['post', 'get'].indexOf(this.sourceData.method.toLowerCase()) == -1)
			this.sourceData.method = 'get';
			
		if(typeof this.sourceData.data == 'undefined')
			this.sourceData.data = {};
			
		var ajaxMethod = this.sourceData.method.toLowerCase();
		
		if(this.sourceData.dataType == 'json');
			ajaxMethod += 'JSON';
		
		if(typeof jQuery[ajaxMethod] !== "function") {
			throw "jQuery doesn't support ajax method : " + ajaxMethod;
			return;
		}	
		
		var source = this;
		jQuery[ajaxMethod](this.sourceData.url, this.sourceData.data, function(response, xhr) {
			source.data = response;
			
			CI.API.setSharedVar(source.sourceName, response);
		});
	}
}
