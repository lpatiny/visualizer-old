 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.datamatrix_intersect == 'undefined')
	CI.Module.prototype._types.datamatrix_intersect = {};

CI.Module.prototype._types.datamatrix_intersect.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.datamatrix_intersect.Controller.prototype = {
	
	_accepts: [
		{rel: 'row', type: ["string", "integer", "image"], asObject: true},
		{rel: 'col', type: [], asObject: true},
		{rel: 'intersect', type: ["number", "string"], asObject: true}
	],
	
	getAcceptedTypes: function(rel) {
		
		for(var i in this._accepts)
			if(this._accepts[i].rel == rel)
				return this._accepts[i];
			
		return { data: rel, type: [], asObject: false };
	},
	
	init: function() {
		
		var module = this.module;
		
		
	}
}
