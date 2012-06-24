 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */




(function() {
      google.load('visualization', '1.0', {'packages':['corechart']});
      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(function() {
      		console.log('Chart API ready');
      });
 })();
 
 
 
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
 	     //
		this.module.getDomContent().html(this.dom);
	},
	
	onResize: function() {
		
		if(this.chart)
			this.drawChart();
	},
	
	update: function() {
		
		var moduleValue;
		var view = this;
		
		if(!(moduleValue = this.module.getDataFromRel('chart')))
			return;
		
		
		var cfg = this.module.getConfiguration();
			
		moduleValue = moduleValue.getData();
		var type = CI.DataType.getType(moduleValue);
		var moduleValue = CI.DataType.getValueIfNeeded(moduleValue);
		
		try {
			console.log(type);
			switch(type) {
					
					
				case 'barChart':
				case 'xyChart':
					
					var data = [[ moduleValue.xAxis.label ]];
					
					if (moduleValue.serieLabels && moduleValue.serieLabels.length>0) {
						for(var i = 0, k = moduleValue.serieLabels.length; i < k; i++) {
							data[0].push(moduleValue.serieLabels[i]);
						}
					}
					
					for(var i = 0, k = moduleValue.x.length; i < k; i++) {
						data.push([moduleValue.x[i]]);
					}
					
					for(var i = 0, k = moduleValue.series.length; i < k; i++) {
						
						for(var j = 0, l = moduleValue.series[i].length; j < l; j++) {
							var val = moduleValue.series[i][j];
							
							if(val.value)
								val = val.value;
							data[j + 1].push(val);	
						}
					}
					
					this.data = data;
					this.chartData = google.visualization.arrayToDataTable(data);
					
					switch(type) {
						
						case 'xyChart': 
							
							this.chart = new google
								.visualization
								.ScatterChart(document.getElementById('module-' + this.module.id));
						
						break;
						case 'barChart':
						
							this.chart = new google
								.visualization
								.BarChart(document.getElementById('module-' + this.module.id));
					}
				
				
					google.visualization.events.addListener(this.chart, 'onmouseover', function(e) {
						var row = e.row;
						var col = e.column;
						var rowData = moduleValue.series[col - 1][row];
						view.module.controller.hoverEvent(rowData);
					});
	
					this.chartOptions = {
					          title: moduleValue.title,
					          hAxis: {title: moduleValue.xAxis.label, minValue: moduleValue.xAxis.minValue, maxValue: moduleValue.xAxis.maxValue},
					          vAxis: {title: moduleValue.yAxis.label},
					          legend: 'none',
					          pointSize: cfg.pointsize || 7,
					          lineWidth: cfg.linewidth || 0
					       };
				       
					this.drawChart();
				return;
			}
		} catch(e) {
			this.dom.mask("Error while creating the chart");
			console.log(e);
		}		
	},
	
	
	drawChart: function() {
		
		this.chartOptions.width = this.module.domContent.parent().width();
		this.chartOptions.height = this.module.domContent.parent().height();
		this.chart
			.draw(this.chartData, this.chartOptions);		

	},
	
	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
	
	}
}

 