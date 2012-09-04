 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.spectra_displayer == 'undefined')
	CI.Module.prototype._types.spectra_displayer = {};

CI.Module.prototype._types.spectra_displayer.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.spectra_displayer.View.prototype = {
	
	init: function() {
		
		var html = [];
		html.push('<div class="ci-canvas-jcamp"></div>');
		this.dom = $(html.join(''));
		this.module.getDomContent().html(this.dom);
	},
	
	inDom: function() {
	

	},
	
	onResize: function(width, height) {
		var data;
		if((data = this.dom.find('canvas').data('spectra')) != undefined) 
			data.resize(width, height - 5);
	},
	
	onProgress: function() {
		this.dom.html("Progress. Please wait...");
	},

	blank: function() {
		this.dom.html("");
	},

	update: function() {
			
		var moduleValue;
		var view = this;
		
		// Load the jcamp from the rel
		if(!(moduleValue = this.module.getDataFromRel('jcamp')))
			return;

		// Get the data associated to the datasource
		moduleValue = moduleValue.getData();

		// Display the jcamp to the screen using the value and the module ref
		// Check callee...
		CI.DataType.toScreen(moduleValue, view.module).done(function(val) {
			view.dom.html(val);
			CI.Util.ResolveDOMDeferred();
			CI.Grid.moduleResize(view.module);			
		});

	},
	
	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
		
		asString: function(val) {
			return val;
		}
		
	}
}
 