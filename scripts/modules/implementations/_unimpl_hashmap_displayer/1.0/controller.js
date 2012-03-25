 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.hashmap_displayer == 'undefined')
	CI.Module.prototype._types.hashmap_displayer = {};

CI.Module.prototype._types.hashmap_displayer.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.hashmap_displayer.Controller.prototype = {
	
	init: function() {
		
		var module = this.module;
	
	}
}
