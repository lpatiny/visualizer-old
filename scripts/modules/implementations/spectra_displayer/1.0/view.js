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
		console.log(CI.Types.getValueFromJPath('', moduleValue, [], null, this, true));
		this.dom.html(CI.dataType.toScreen(CI.Types.getValueFromJPath('', moduleValue, [], null, this, true), this));
		$(document).trigger('checkAsyncLoad', [ this.dom ]);
		
			
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
 