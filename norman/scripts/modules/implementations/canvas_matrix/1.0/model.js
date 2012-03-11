
if(typeof CI.Module.prototype._types.canvas_matrix == 'undefined')
	CI.Module.prototype._types.canvas_matrix = {};

CI.Module.prototype._types.canvas_matrix.Model = function(module) {
	
	this.module = module;
	this.data = [];
	
	for(var i = 0; i < model.definition.dataSource.length; i++) {
		this.data.push(new DataSource(this.module, model.definition.dataSource[i]));	
	}
	
	this.dataValue = null;
}

CI.Module.prototype._types.canvas_matrix.Model.prototype = {
	
	init: function() {	
		
	},
	
	
	/* 
	 * This function is a handler called from any DataSource object. 
	 * Its goal is to refresh the module with the new data
	 * 
	 * To finally refresh the view, simply call this.module.updateView();
	 * or don't if for any reason it's not necessary to update the module
	 */
	onDataChange: function(data) {
		/* Here you can transform the data coming from the DAO */
		this.dataValue = data;
		
		/* Triggers a module update */
		this.module.updateView();
	},
	
	getValue: function() {
		return this.dataValue;
	}
}
