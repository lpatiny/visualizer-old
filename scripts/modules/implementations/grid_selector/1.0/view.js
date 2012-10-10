 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.grid_selector == 'undefined')
	CI.Module.prototype._types.grid_selector = {};

CI.Module.prototype._types.grid_selector.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.grid_selector.View.prototype = {
	
	init: function() {	
		this.dom = $('<div class="ci-display-grid-selector"></div>');
		this.module.getDomContent().html(this.dom);
		var self = this;
	},

	inDom: function() {},
	
	onResize: function() {
	},
	
	blank: function() {
		this.domTable.empty();
		this.table = null;
	},

	update2: {

		preferences: function(moduleValue) {
		
			if(!moduleValue)
				return;
			moduleValue = moduleValue.value;
			if(!moduleValue)
				return;
			var cols = moduleValue.categories;
			var lines = moduleValue.variables;

			var selectors = [];
			for(var j = 0, k = cols.length; j < k; j++) {
				selectors.push();
			}

			html = '<table>';
			for(var i = -1, l = lines.length; i < l; i++) {
				html += '<tr data-lineid="' + i + '">';

				if(i == -1) // First line
					html += '<td></td>';
				else
					html += '<td>' + lines[i].label + '</td>';
				
				for(var j = 0, k = cols.length; j < k; j++) {

					if(i == -1)
						html += '<th width="' + (cols[j].selectorType == 'checkbox' ? '190' : '') + '" data-colid="' + j + '">' + cols[j].label + '</th>';
					else
						html += '<td data-colid="' + j + '">' + this.getSelector(cols[j], lines[i]) + '</td>';
				}
				html += '</tr>';
			}
			html += '</table>';
			
			this.dom.html(html);
			this.setEvents();
		}
	},

	setEvents: function() {
	//	$(this.dom).find('input').customInput();
		$(this.dom).find('.ci-rangebar').each(function() {
			var $this = $(this);
			var min = $this.data('defaultmin');
			var max = $this.data('defaultmax');
			$this.slider({
				range: true,
				min: $(this).data('minvalue'),
				max: $(this).data('maxvalue'), 
				step: 0.01,
				values: [min, max],
				slide: function(event, ui) {
					$(this).next().val(ui.values[0] + '-' + ui.values[1]);
				}
			});
		});
	},

	getSelector: function(col, line) {
		if(col.selectorType == 'checkbox') {
			var id = CI.Util.getNextUniqueId();
			return '<input type="checkbox" id="' + id + '" name="selector[' + col.name + '][' + line.name + ']" /><label for="' + id + '">&nbsp;</label>';
		} else if(col.selectorType == 'range') {
			return '<div class="ci-rangebar" data-minvalue="' + col.minValue + '" data-maxvalue="' + col.maxValue + '" data-defaultmin="' + col.defaultMinValue + '" data-defaultmax="' + col.defaultMaxValue + '"></div><input type="hidden" name="selector[' + col.name + '][' + line.name + ']" />';
		}
	},

	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
	
	}
}

 