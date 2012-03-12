 /*
 * module.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

// HashMap moduleId => Module (See init.js)
CI.modules = {};

CI.Module = function(definition) {

	this.definition = $.extend(true, {}, CI.Module.prototype.defaults, definition);
	
	this.init = init;
	function init() {
		
		var moduleType = this.definition.type;
		
		this.model = new CI.Module.prototype._types[moduleType].Model(this);
		this.view = new CI.Module.prototype._types[moduleType].View(this);
		this.controller = new CI.Module.prototype._types[moduleType].Controller(this);
		
		this.dom = $(this.buildDom());
		this.domContent = this.dom.children().children('.ci-module-content');
		this.domHeader = this.dom.children().children('.ci-module-header');
		this.domWrapper = this.dom;
		
		
		
		this.view.init();
		this.model.init();
		this.controller.init();
	}
	
	this.buildDom = buildDom;
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
	
	this.init();
};

CI.Module.prototype = {
	
	defaults: {
		id: -1,
		type: 'default',
		
		size: {
			width: 10,
			height: 15
		},
		
		position: {
			top: 0,
			left: 0
		}
	},

	// All modules implementations will come into this object
	_types: {},
	
	
	onDataChange: function(dataName, dataVal) {
		
		if(typeof this.model.onDataChange == 'function')
			return this.model.onDataChange(dataName, dataVal);
		
		throw "The model does not implement any dataChange function";
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
	},
	
	getDomHeader: function() {
		if(typeof this.domHeader !== 'undefined')
			return this.domHeader;
			
		throw "The module has not been loaded yet";
	},
	
	getValue: function() {
		if(typeof this.model.getValue == 'function')
			return this.model.getValue();
		
		return;
	},
	
	getPosition: function() {
		return this.definition.position;
	},
	
	getSize: function() {
		return this.definition.size;
	}
};

/*
 * Static functions
 */
CI.Module.prototype._impl = {
	
	model: {
		
		init: function(module, model) {
			
			var sourceName, sourceData;
			
			/**
			 * Set up the model for a module
			 */
			model.module = module;
			model.data = [];
			model.dataValue = [];
			
			for(var i = 0; i < module.definition.dataSource.length; i++) {
				sourceName = module.definition.dataSource[i].name;
				
				sourceData = null;
				if(typeof module.definition.dataSource[i].data !== "undefined")
					sourceData = module.definition.dataSource[i].data;
				
				
				model.data.push(new CI.DataSource(model.module, sourceName, sourceData));
				model.dataValue[sourceName] = null;
			}
		}
	},
	
	controller: {
		
		init: function(module, controller) {
			
			controller.module = module;
			
		},
		
		doBindDataChange: function() {
			
			var controller = this;
			this.module.getDomContent().bind('sharedDataChanged', function(event, dataName, dataVal) {
				
				event.stopPropagation();
				event.preventDefault();
				
				controller.module.onDataChange(dataName, dataVal);
				
			});
		}
	}
	
	
}