 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
 
if(typeof CI.Module.prototype._types.display_value == 'undefined')
	CI.Module.prototype._types.display_value = {};

CI.Module.prototype._types.display_value.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.display_value.View.prototype = {
	
	init: function() {	
		var html = "";
		html += '<div></div>';
		this.dom = $(html).css('display', 'table').css('height', '100%').css('width', '100%');
		this.module.getDomContent().html(this.dom);
		
		this.update();
	},
	
	onResize: function() {
		
	},
	
	inDom: function() {},

	update: function() {
		
		var moduleValue;
		var view = this;
		var cfg = this.module.getConfiguration();
		
		if(moduleColor = this.module.getDataFromRel('color')) {
			color = moduleColor.getData();
			view.module.getDomContent().css('backgroundColor', color);
		}
		
		if(!(moduleValue = this.module.getDataFromRel('value')) || ((moduleValue = moduleValue.getData()) === null)) {
			
			if(cfg.defaultvalue)
				view.fillWithVal(cfg.defaultvalue);

		} else {

			if(moduleValue !== undefined)
				CI.DataType.toScreen(moduleValue, this.module).done(function(val) {
					view.fillWithVal(val);
				});
		}
	},
	
	fillWithVal: function(val) {
		
		var cfg = this.module.getConfiguration();
		
		var div = $("<div />").css({
			fontFamily: cfg.font || 'Arial',
			fontSize: cfg.fontsize || '10pt',
			color: cfg.frontcolor || '#000000',
			display: 'table-cell',
			'vertical-align': cfg.valign || 'top',
			textAlign: cfg.align || 'center',
			width: '100%',
			height: '100%'
		}).html(val);

		this.dom.html(div);
		CI.Util.ResolveDOMDeferred();

	},
	
	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {}
}

 