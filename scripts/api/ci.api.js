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

CI.API.setSharedVar = function(varName, varData) {
	
	CI.sharedData[varName] = varData;
	$(document).trigger('sharedDataChanged', [varName, varData]);
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
				allModules[i] = CI.modules[i]
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
