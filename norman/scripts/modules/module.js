

CI.Module = function(definition) {

	this.definition = $.extend({}, CI.Module.prototype.defaults, definition);
	
	function init() {
		var moduleType = this.def.type;
		
		this.model = new CI.Module._types[moduleType].model(this);
		this.view = new CI.Module._types[moduleType].view(this);
		this.controller = new CI.Module._types[moduleType].controller(this);
		
		this.dom = $(buildDom());
		this.domContent = this.dom.children().children('.ci-module-content');
		this.domWrapper = this.dom;
		
		this.view.init();
		this.model.init();
		this.controller.init();
	}
	
	
	function buildDom() {
		
		var html = [];
		html.push('<div class="ci-module-wrapper" data-module-id="');
		html.push(this.definition.id);
		html.push('" class="ci-module-');
		html.push(this.definition.type);
		html.push('"><div class="ci-module"><div class="ci-module-header"><div class="ci-module-header-title">');
		html.push(this.definition.title);
		html.push('</div>');
		html.push('</div><div class="ci-module-content">');
		
		html.push('</div>');
		html.push('</div>');
		return html.join('');
	}
	
	init();
};

CI.Module.prototype = {
	
	defaults: {
		id: -1,
		type: 'default'
	},

	
	updateView: function() {
		if(typeof this.view.update == 'function')
			return this.view.update();
			
		throw "The module has no update capability";
	},
	
	getDomContent: function() {
		if(typeof this.domContent !== 'undefined')
			return this.domContent;
			
		throw "The module has not been loaded yet";
	},
	
	getDomWrapper: function() {
		if(typeof this.domWrapper !== 'undefined')
			return this.domWrapper;
			
		throw "The module has not been loaded yet";
	},
	
	getDomView: function() {
		if(typeof this.view.getDom == 'function')
			return this.view.getDom();
			
		throw "The module's view doest not implement the getDom function";
	}
	
	getValue: function() {
		if(typeof this.model.getValue == 'function')
			return this.model.getValue();
		
		return;
	}
};
