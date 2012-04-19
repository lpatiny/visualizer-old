 /*
 * module.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

/**
 * modules is a HashMap, mapping module.id to the module
 * @see example in init.js
 */
CI.modules = {};

/**
 * Creates a new base Module
 * @class The base class for all Modules to extend
 * @param {object} definition An object containing options for the grid (is merged into {@link defaults})
 * @param {integer} [definition.id] The id of the module
 * @param {string} [definition.type] A string identifying the type of this module
 * @param {object} [definition.size] An object definining the size of the module (containing width and height)
 * @param {object} [definition.position] An object definining the position of the module (containing x and y)
 */
CI.Module = function(definition) {

	//this.definition = $.extend(true, definition, CI.Module.prototype.defaults);
	// WRONG ! We need to keep the pointer.
	this.definition = definition;
	
	
	this.cfgModule = $.extend(true, {}, definition.configuration);
	
	
	/**
	 * @function Initialises the module, constructs the DOM within the module, and initialises the MVC
	 */
	this.init = init;
	function init() {
		
		//define object properties
		var module = this;
		var moduleType = this.definition.type;
		
		//Construct the DOM within the module
		this.dom = $(this.buildDom());
		this.domContent = this.dom.children().children('.ci-module-content').children('.ci-module-content-overflow');
		this.domHeader = this.dom.children().children('.ci-module-header');
		this.domWrapper = this.dom;
		this.viewExpander = $('<div class="ci-module-expand">...</div>');
		
		var moduleConstruct = CI.Module.prototype._types[moduleType];
		
		if(!(moduleConstruct && moduleConstruct.View && moduleConstruct.Controller && moduleConstruct.Model)) {
			throw 'Module ' + moduleType + ' not fully implemented';
			return 
		}
		
		//Initialises the MVC pattern for the module
		this.view = new CI.Module.prototype._types[moduleType].View(this);
		this.controller = new CI.Module.prototype._types[moduleType].Controller(this);
		this.model = new CI.Module.prototype._types[moduleType].Model(this);
		
		this.view.init();
		this.controller.init();
		this.model.init();
		
		this.dom.find('.ci-configure').bind('click', function(event) {
			$(document).trigger('configModule', module);
		});
	}
	
	/**
	 * Construct the basic dom for the module
	 */
	this.buildDom = buildDom;
	function buildDom() {
		
		var html = [];
		html.push('<div class="ci-module-wrapper ci-module-');
		html.push(this.definition.type);
		html.push('" data-module-id="');
		html.push(this.definition.id);
		html.push('"><div class="ci-module"><div class="ci-module-header"><div class="ci-module-header-title">');
		html.push(this.definition.title);
		html.push('</div>');
		html.push('<div class="ci-module-header-toolbar">');
		html.push('<ul>');
		html.push('<li class="ci-configure">Configure</li>')
		html.push('</ul>');
		html.push('</div>');
		html.push('</div><div class="ci-module-content"><div class="ci-module-content-overflow">');
		
		html.push('</div></div>');
		html.push('</div>');
		return html.join('');
	}
	
	this.init();
};
/**
 * Overrideable prototype
 */
CI.Module.prototype = {
	
	/**
	 * Used to define default module properties. On creation, the definition passed is merged with this object 
	 * @type object
	 * @hide
	 */
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

	/**
	 * Contains the names of all types of module
	 */
	_types: {},
	
	
	/**
	 * Called when the data behind the module needs updating
	 * @param dataName The name of the piece of data being updated
	 * @param dataName The new value of the data being updated
	 */
	onDataChange: function(dataName, dataVal) {
		
		if(typeof this.model.onDataChange == 'function')
			return this.model.onDataChange(dataName, dataVal);
		
		throw "The model does not implement any dataChange function";
	},
	
	/**
	 * Called to update the view (normally after a change of data)
	 */
	updateView: function() {
		if(typeof this.view.update == 'function')
			return this.view.update();
			
		throw "The module has no update capability";
	},
	
	/** 
	 * Returns the DOM object which corresponds to the module's content
	 */
	getDomContent: function() {
		if(typeof this.domContent !== 'undefined')
			return this.domContent;
			
		throw "The module has not been loaded yet";
	},
	
	/** 
	 * Returns the DOM object which corresponds to the module's wrapper
	 */
	getDomWrapper: function() {
		if(typeof this.domWrapper !== 'undefined')
			return this.domWrapper;
			
		throw "The module has not been loaded yet";
	},
	
	/** 
	 * Returns the DOM object which corresponds to the module's view
	 */
	getDomView: function() {
		if(typeof this.view.getDom == 'function')
			return this.view.getDom();
			
		throw "The module's view doest not implement the getDom function";
	},
	
	/** 
	 * Returns the DOM object which corresponds to the module's header
	 */
	getDomHeader: function() {
		if(typeof this.domHeader !== 'undefined')
			return this.domHeader;
			
		throw "The module has not been loaded yet";
	},
	
	getConfiguration: function() {
		return this.cfgModule;
	},
	
	getAcceptedTypes: function(rel) {
		
		var accept = this.controller.getConfigurationReceive();
		
		if(accept[rel])
			return accept[rel];
		
		return { data: rel, type: [], asObject: false };
	},
	
	
	getDataFromRel: function(rel) {
	
		for(var i in this.definition.dataSource)
			if(this.definition.dataSource[i].rel == rel)
				return this.model.data[this.definition.dataSource[i].name];
		return;
	},
	
	getDataRelFromName: function(name) {
		
		for(var i in this.definition.dataSource)
			if(this.definition.dataSource[i].name == name)
				return this.definition.dataSource[i].rel;
				
		return false;
	},
	
	inDom: function() {
		
		if(typeof this.view.inDom == "function")
			this.view.inDom();
		if(typeof this.controller.inDom == "function")
			this.controller.inDom();
		if(typeof this.model.inDom == "function")
			this.model.inDom();
		
	},
	// Useless
	/*
	getKeysByRel: function(rel, sent) {
		
		if(!sent) {
			var data = this.getDataFromRel(rel);
			if(typeof data == "undefined")
				return false;
			return data.getDataKeys();
		} else {
			return this.model.getKeysFromRel(rel);
		}
	},
	*/
	/** 
	 * Returns the data for the module's model
	 */
	getValue: function() {
		if(typeof this.model.getValue == 'function')
			return this.model.getValue();
		
		return;
	},
	
	/** 
	 * Returns the current position of the module
	 */
	getPosition: function() {
		return this.definition.position;
	},
	
	/** 
	 * Returns the current size of the module
	 */
	getSize: function() {
		return this.definition.size;
	},
	
	getId: function() {
		return this.definition.id;
	},
	
	setSourceVars: function(vars) {
		
		this.definition.dataSource = vars;
	},
	
	setSendVars: function(vars) {
		this.definition.dataSend = vars;
	}
};

/*
 * Static functions
 */
CI.Module.prototype._impl = {
	
	model: {
		
		/**
		 * Set up the model (MVC) for a module. The model contains the data concerning the module.
		 * @param module the module to which this model is associated
		 * @param model the model being associated
		 */
		init: function(module, model) {
			
			var sourceName, sourceAccepts;
			
			module.model = model;
			model.module = module;
			model.data = [];
			model.dataValue = [];
			
			//loop through the data provided in the definition and copy it into the model as a DataSource
			var sources = module.definition.dataSource;
			
			for(var i = 0; i < sources.length; i++) {
				sourceName = sources[i].name;
				
				if(typeof sources[i].rel == "undefined") {
					throw {display: true, notify: true, message: "The rel of any datasource need to be specified"};
					return;
				}
				sourceRel = sources[i].rel;
				jPath = sources[i].jpath;
				
				sourceData = null;
				sourceAccepts = module.getAcceptedTypes(sourceRel);
				
				model.data[sourceName] = new CI.DataSource(model.module, sourceName, sourceAccepts, jPath);
				model.dataValue[sourceName] = null;
			}
		}
	},
	
	controller: {
		/**
		 * Initialise the given module's controller (mvc)
		 */
		init: function(module, controller) {
			
			controller.module = module;
			
		}
	}
	
	
}