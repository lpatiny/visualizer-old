
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
