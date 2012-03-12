 /*
 * model.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.datamatrix_intersect == 'undefined')
	CI.Module.prototype._types.datamatrix_intersect = {};

CI.Module.prototype._types.datamatrix_intersect.Model = function(module) {
	
	CI.Module.prototype._impl.model.init(module, this);
	this.treatedDataValue = {};
}

CI.Module.prototype._types.datamatrix_intersect.Model.prototype = {
	
	// Usually you don't really to init a model. But who knows. Please leave it.
	init: function() {	
		CI.Module.prototype._impl.model.afterInit(this.module);
	},
	
	
	onDataChange: function(dataName) {
		
		// This part of the code could be simplified, but this is to show the proof of concept
		// of data manipulation from the model
		
		switch(this.data[dataName].getSourceData().rel) {
			
			case 'row':
				this.treatedDataValue['row'] = this.data[dataName].getData();
			break;
			
			case 'col':
				this.treatedDataValue['col'] = this.data[dataName].getData();
			break;
			
			case 'intersect':
				this.treatedDataValue['intersect'] = this.data[dataName].getData();
			break;
		}
		
		/* Triggers a module update */
		this.module.updateView();
	},
	
	getValue: function() {
		return this.treatedDataValue;
	}
}