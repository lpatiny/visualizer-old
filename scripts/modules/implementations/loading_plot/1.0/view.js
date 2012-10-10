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

			var datas = json.scatter.value.series[0].data;
			for(var i = 0, l = datas.length; i < l; i++) {
				var pie = new Fierm.Circle(datas[i].x, datas[i].y, datas[i]);
				svg.add(pie);
			}

			var datas = json.scatter.value.series[1].data;
			for(var i = 0, l = datas.length; i < l; i++) {
				var pie = new Fierm.Pie(datas[i].x, datas[i].y, datas[i]);
				svg.add(pie);
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

 