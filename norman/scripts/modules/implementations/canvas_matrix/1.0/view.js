

if(typeof CI.Module.prototype._types.canvas_matrix == 'undefined')
	CI.Module.prototype._types.canvas_matrix = {};

CI.Module.prototype._types.canvas_matrix.View = function(module) {
	this.module = module;
	
}

CI.Module.prototype._types.canvas_matrix.View.prototype = {
	
	init: function() {	
		
		var html = [];
		html.push('Initial dom here');
		
		this.dom = $(html.join(''));
		this.module.getDomContent().html(dom);
	},
	
	update: function() {
		
		var moduleValue = this.module.getValue();
	},
	
	getDom: function() {
		return this.dom;
	}
}