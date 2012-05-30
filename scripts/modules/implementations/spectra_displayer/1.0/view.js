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
			data.resize(width, height);
	},
	
	update: function() {
console.log("Variable received in spectra displayer");
		var moduleValue;
		var view = this;
		
		if(!(moduleValue = this.module.getDataFromRel('jcamp').getData()))
			return;
			/*
		var url = moduleValue;
		var query = new CI.Util.AjaxQuery({
			url: url,
			dataType: 'text',
			success: function(data) {
				
				var spectra = ChemDoodle.readJCAMP(data);
		  		view.spectra.loadSpectrum(spectra);
			}
		});
		*/
	
	
		CI.DataType.getValueFromJPath(moduleValue, '', function(val) {
			view.dom.html(CI.DataType.toScreen(val, view.module));
			$(document).trigger('checkAsyncLoad', [ view.dom ]);
		});
		
		
		CI.Grid.moduleResize(this.module);
			
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
 