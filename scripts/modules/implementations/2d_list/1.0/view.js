 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types['2d_list'] == 'undefined')
	CI.Module.prototype._types['2d_list'] = {};

CI.Module.prototype._types['2d_list'].View = function(module) {
	this.module = module;
}

CI.Module.prototype._types['2d_list'].View.prototype = {
	
	init: function() {	
		var html = [];
		html.push('<div class="ci-displaylist-list-2d"></div>');
		this.dom = $(html.join(''));
		this.module.getDomContent().html(this.dom);
	},
	
	onResize: function() {
		
	
	},
	
	update: function() {
		
		var moduleValue;
		var view = this;
		
		var valJpath = this.module.getConfiguration().valjpath;
		var colorJpath = this.module.getConfiguration().colorjpath;
		var cols = this.module.getConfiguration().colnumber || 4;
		
		
		if(!(moduleValue = this.module.getDataFromRel('list').getData()))
			return;
		
		this.list = CI.Util.getValue(moduleValue);
		
		var html = '<table cellpadding="3" cellspacing="0">';
		for(var i = 0; i < this.list.length; i++) {
			colId = i % cols;
			if(colId == 0)
				html += '<tr>';
			html += '<td';
			
			if(colorJpath) {
				html += ' style="background-color: ';
				html += CI.dataType.toScreen(CI.Types.getValueFromJPath(colorJpath, this.list[i], this.list, i, this), this);
				html += '"';
			}
			
			html += '>';
			html += CI.dataType.toScreen(CI.Types.getValueFromJPath(valJpath, this.list[i], this.list, i, this), this);
			html += '</td>';
			if(colId == cols)
				html += '</tr>';
		}
		
		if(i % cols != 0) {
			while(i % cols != 0) {
				html += '<td></td>';
				i++;
			}
			html += '</tr>';
		}
		html += '</table>';
		this.dom.html(html);
		
		$(document).trigger('checkAsyncLoad', [ this.dom ]);
	},
	

	getDom: function() {
		return this.dom;
	},
	
	typeToScreen: {
		
		asChemical: function(chemical) {
			CI.dataType.instanciate(chemical);
			return chemical.instance.getIUPAC();
		},
		
		asString: function(val) {
			return val;
		}
		
	}
}