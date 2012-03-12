 /*
 * model.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.hashmap_displayer == 'undefined')
	CI.Module.prototype._types.hashmap_displayer = {};

CI.Module.prototype._types.hashmap_displayer.Model = function(module) {
	
	/*
	 * Sets
	 * (array) this.data
	 * (json) this.dataValue    -- Could be any type of data provided by any DataSource object. 
	 */
	CI.Module.prototype._impl.model.init(module, this);
	
	// Call anything else if you want. The prototyped init() function can also be used.
}

CI.Module.prototype._types.hashmap_displayer.Model.prototype = {
	
	// Usually you don't really to init a model. But who knows. Please leave it.
	init: function() {	
		
	},
	
	
	/* 
	 * This function is a handler called from any DataSource object. 
	 * Its goal is to refresh the module with the new data
	 * 
	 * To finally refresh the view, simply call this.module.updateView();
	 * or don't if for any reason it's not necessary to update the module
	 */
	onDataChange: function(dataName, dataVal) {
		/* Here you can transform the data coming from the DAO */
		this.dataValue[dataName] = dataVal;
		
		/* Triggers a module update */
		this.module.updateView();
	},
	
	getValue: function() {
		return this.dataValue;
	}
}
