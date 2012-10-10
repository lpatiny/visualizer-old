 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.loading_plot == 'undefined')
	CI.Module.prototype._types.loading_plot = {};

CI.Module.prototype._types.loading_plot.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.loading_plot.View.prototype = {
	
	init: function() {	
		this.dom = $('<div class="ci-display-loading-plot"></div>');
		this.module.getDomContent().html(this.dom);

		var self = this;
	},

	inDom: function() {},
	
	onResize: function(w, h) {
		this._w = w - 10;
		this._h = h - 10;
		if(this._w && this._h && this._svg)
			this._svg.setSize(this._w, this._h);
	},
	
	blank: function() {
		
		this.table = null;
	},

	update2: {

		preferences: function(moduleValue) {

			for(var i in moduleValue) {

			}

		},


		loading: function(moduleValue) {
		
			if(!moduleValue)
				return;

			Fierm.initZoom = 8000;
			Fierm.zoom = Fierm.initZoom;

			var svg = new Fierm.SVG();
			this._svg = svg;

			if(this._w && this._h)
				svg.setSize(this._w, this._h);

			svg.setViewBoxWidth(1, 1);
			svg.bindTo(this.dom);

			var Springs = new Fierm.SpringLabels();

			svg.initZoom();
			Fierm.SVGElement.prototype.Springs = Springs;

			if(!moduleValue.value || !moduleValue.value.series)
				return;

			var cfg = this.module.getConfiguration();
			var layers = cfg.layers;

			for(var i = 0; i < layers.length; i++) {
				var layerId = layers[i].layer;
				var type = layers[i].display || 'ellipse';
				
				for(var j = 0; j < moduleValue.value.series.length; j++) {
					if(moduleValue.value.series[j].category == layerId) {
						var datas = moduleValue.value.series[j].data;
						for(var k = 0, l = datas.length; k < l; k++) {
							console.log(type);
							if(type == 'pie')
								svg.add(new Fierm.Pie(datas[k].x, datas[k].y, datas[k]));
							else if(type == 'ellipse')
								svg.add(new Fierm.Ellipse(datas[k].x, datas[k].y, datas[k]));
						}
						break;
					}
				}
			}

			svg.ready();
			Springs.resolve();
		}
	},

	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
	
	}
}

 