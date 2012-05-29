 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.plot_stat == 'undefined')
	CI.Module.prototype._types.plot_stat = {};

CI.Module.prototype._types.plot_stat.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.plot_stat.View.prototype = {
	
	init: function() {	
		var html = [];
		html.push('<div class="ci-plot"><div id="module-' + this.module.id + '"></div></div>');
		this.dom = $(html.join(''));

		google.load('visualization', '1.0', {'packages':['corechart']});
		
  	     //
		this.module.getDomContent().html(this.dom);
	},
	
	onResize: function() {
		
	
	},
	
	update: function() {
		
		var moduleValue;
		var view = this;
		
		var lastDataReceived = this.module.model.lastDataName;
		var relLastDataReceived = this.module.getDataRelFromName(lastDataReceived);
		
		if(!(moduleValue = this.module.getDataFromRel(relLastDataReceived).getData()))
			return;
		
		switch(rel) {
			
			case 'roc':
				
				var data = [["TTR", "FTP"]];
				for(var i = 0; i < moduleValue.ROCx.length; i++) {
					data.push([moduleValue.ROCx[i], moduleValue.ROCy[i]]);
				}
			return;	
				new google.visualization.LineChart(document.getElementById('module-' + this.module.id)).
      				draw(data, {curveType: "function",
                  			width: 500, height: 400,
                  			vAxis: {maxValue: 10}}
          			);
				
			
			break;
			
			
			
			
		}
	},
	
	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
	
	}
}

 