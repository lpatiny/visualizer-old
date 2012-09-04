 /*
 * ci.api.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


/**
 * Represents the source of any type of data (i.e. is updatable through e.g. ajax)
 * @namespace 
 */
CI.API = {};

CI.API.blankSharedVar = function(varName) {
	CI.sharedData[varName] = null;
	$(document).trigger('sharedDataChanged', [varName]);
}

// Stores a deferred
CI.API.setSharedVar = function(varName, varData) {
	
	var filters = CI.API.getSharedFilters(varName);
	var def = $.Deferred();
	for(var i = 0, l = filters.length; i < l; i++)
		def.pipe(filters[i]);

	CI.sharedData[varName] = def;
	def.resolve(varData);

	console.log(varData);
	$(document).trigger('sharedDataChanged', [varName, def]);
}

CI.API.getSharedVar = function(varName) {
	
	return CI.sharedData[varName];
}

CI.API.getModulesFromSharedVar = function(varName) {
	
	var allModules = {}, source = [];
	
	for(var i in CI.modules) {
		source = CI.modules[i].definition.dataSource;
	
		for(var j = 0; j < source.length; j++) {
			if(source[j].name == varName) {
				allModules[i] = CI.modules[i];
				break;
			}
		}
	}
	
	return allModules;
}

CI.API.resendAllVars = function() {
	for(var i in CI.sharedData) {
		CI.API.setSharedVar(i, CI.sharedData[i]);
	}
}


CI.API.setSharedVarFromJPath = function(name, value, jpath) {
	
	CI.DataType.getValueFromJPath(value, jpath).done(function(returned) {
		CI.API.setSharedVar(name, returned);
	});
}

CI.API.getSharedFilters = function(varName) {
	var filters = Entry.getConfiguration().variableFilters;
	var toReturn = [];
	if(filters[varName]) {
		var filters = filters[varName];
		for(var i = 0; i < filters.length; i++)
			if(CI.VariableFilters[filters[i]])
				toReturn.push(CI.VariableFilters[filters[i]].process);
	}
	return toReturn;
}