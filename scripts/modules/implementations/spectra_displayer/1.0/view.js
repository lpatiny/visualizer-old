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
		this.canvasid = 'spectra_displayer_' + this.module.getId();
		this.canvas = $("<canvas />").attr('id', this.canvasid).appendTo(this.dom);
		this.module.getDomContent().html(this.dom);
		
	},
	
	inDom: function() {
		this.spectra = new ChemDoodle.PerspectiveCanvas(this.canvasid, '0', '0');
		this.spectra.specs.plots_showYAxis = true;
		this.spectra.specs.plots_flipXAxis = false;
	},
	
	onResize: function(width, height) {
		
		this.spectra.resize(width, height);
	},
	
	update: function() {

		var moduleValue;
		var view = this;
		
		if(!(moduleValue = this.module.getDataFromRel('jcamp').getData()))
			return;
			
		var url = moduleValue;
		var query = new CI.Util.AjaxQuery({
			url: url,
			dataType: 'text',
			success: function(data) {
				
				var spectra = ChemDoodle.readJCAMP(data);
		  		view.spectra.loadSpectrum(spectra);
			}
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
 