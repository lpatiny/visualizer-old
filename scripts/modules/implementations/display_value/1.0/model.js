 /*
 * model.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.display_value == 'undefined')
	CI.Module.prototype._types.display_value = {};
CI.Module.prototype._types.display_value.Model = function(module) { }
$.extend(CI.Module.prototype._types.display_value.Model.prototype, CI.Module.prototype._impl.model);
$.extend(CI.Module.prototype._types.display_value.Model.prototype, {
	
	getValue: function() {
		return this.dataValue;
	},
	
	getjPath: function(rel, accepts) {		
	}
});
