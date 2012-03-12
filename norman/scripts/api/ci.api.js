 /*
 * ci.api.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


CI.API = {};

CI.API.setSharedVar = function(varName, varData) {
	
	CI.sharedData[varName] = varData;
	var allModules = CI.API.getModulesFromSharedVar(varName);
	
	for(var i in allModules) {
		allModules[i].getDomContent().trigger('sharedDataChanged', [varName, varData]);		
	}
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
