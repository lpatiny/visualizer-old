
/**
 * Represents the source of any type of data (i.e. is updatable through e.g. ajax)
 * @Class
 * @namespace 
 * @param {Module} module the module to which this data is bound
 * @param {string} sourceName the name of this data object
 * @param {object} sourceData The actual data object (requires at least type to be set)
 */
CI.DataSource = function(module, sourceName, sourceAccepts, jPath) {
	
	this.module = module;
	this.sourceName = sourceName;
	this.sourceAccepts = sourceAccepts;
	this.data = null;
	this.jPath = jPath;

	
	if(typeof CI.DataSource.prototype._dataSources[sourceName] == "undefined")
		CI.DataSource.prototype._dataSources[sourceName] = [];
	CI.DataSource.prototype._dataSources[sourceName].push(this);
}


CI.DataSource.prototype = {
	
	/* Static functions */
	_bindEvent: function() {
		
		$(document).bind('sharedDataChanged', function(event, varName, varVal) {

			if(varVal == undefined) {
				for(var i = 0; i < allSources.length; i++)
					allSources[i].blank();
				return;
			}

			var allSources = CI.DataSource.prototype._dataSources[varName];

			if(typeof allSources == "undefined")
				return;

			varVal.then(function(val) {
				for(var i = 0; i < allSources.length; i++)
					allSources[i].setData(val);
			}, null, function(val) {
					allSources[i].setProgress(val);
			});
		});
	},
	
	_dataSources: [],
	
	blank: function() {
		this.data = null;
		if(this.module.view.blank)
			this.module.view.blank();
	}

	setData: function(data) {
		if(this.buildData(data) !== false)
			return this.module.model.onDataChange(this.sourceName);
		return false;
	},

	setProgress: function(data) {
		if(this.module.view.onProgress)
			this.module.view.onProgress();
	},

	buildData: function(data) {
		
		var dataRebuilt = {};

		if(!(this.sourceAccepts.type instanceof Array))
			this.sourceAccepts.type = [this.sourceAccepts.type];
		
		var dataType = CI.DataType.getType(data);

		var mustRebuild = false;

		for(var i = 0; i < this.sourceAccepts.type.length; i++) {
			
			if(this.sourceAccepts.type[i] == dataType) {
				return this.data = data;
			}
/*			
			else if(asObject && CI.DataType.getType(data) == CI.DataType.Structures.Object) {
				
				for(var j in data) {
					if(CI.DataType.getType(data[j]) == this.sourceAccepts.type[i]) {
						dataRebuilt[j] = data[j];
						mustRebuild = true;
					}
				}
			}
			*/
		}
		
			
		if(mustRebuild)
			return this.data = dataRebuilt;
			
		return false;
	},
	
	getData: function() {
		return this.data;
	},
	
	forceSetData: function(data) {
		this.data = data;
	},
	
	getDataKeys: function() {
		
		if(typeof this.data != 'object')
			return false;
			
		var keys = [];
		for(var i in this.data)
			keys.push(i);
			
		return keys;
	},
	
	getjPath: function() {
		return this.jPath;
	}
}
