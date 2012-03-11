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
		allModules.getDomContent().trigger('sharedDataChanged', [varName, varData]);		
	}
}

CI.API.getSharedVar = function(varName) {
	
	return CI.sharedData[varName];
}
