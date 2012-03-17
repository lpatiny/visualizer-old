
CI.dataType = {
	
	getType: function(data) {
		
		var type = typeof data;
		
		if(type == 'object') {
			
			if(data instanceof Array)
				return 'array';
				
			if(typeof data.type == "undefined")
				return 'object';
			else
				return data.type;
		}

		if(type == "undefined")
			throw {notify: true, display: false, message: "The type cannot be undefined"};
			
		if(type == "function")
			throw {notify: true, display: false, message: "The type cannot be a function"};
			
		return type;
	},
	
	toScreen: function(val, view) {
		var repoFuncs = typeof view.toScreen == 'object' ? view.toScreen : {}; 
		return CI.dataType.typeToScreen(val, repoFuncs);	
	},
	
	
	typeToScreen: function(val, repoFuncs) {
	
		if(!val)
			return;
			
		//var name, repoTypes, repoFuncs;
		
		/*if(typeof p3 != "undefined") {
	   	    name = p1, 
		    repoTypes = p2,
		    repoFuncs = p3;
		} else
		    repoFuncs = p1;
		*/
		var type;
		
		var toFunc = val;
		// Unimplemented
		/*if(typeof repoTypes !== "undefined" && typeof repoTypes[val.type] != "undefined")
			type = repoTypes[val.type];
		else */
		if(typeof val == 'number')
			type = 'number';
		else if(typeof val == 'string')
			type = 'string';
		else if(val instanceof Array)
			type = 'array';
		else if(val.type !== undefined) {
				toFunc = typeof val.url != "undefined" ? val.url : val.value;
				type = val.type;
		} else {
			throw "The type of data has not been recognized";
			return;
		}
		
	    	var method = ['as', type.charAt(0).toUpperCase(), type.substr(1)].join('');
		
		if(typeof repoFuncs[method] == 'function')
			return repoFuncs[method](toFunc);
			
		if(typeof CI.dataType.basicImpl[method] == 'function')
			return CI.dataType.basicImpl[method](toFunc);
			
		throw "The variable type \"" + type + "\" is not supported";
		
	}
	
}


CI.dataType.basicImpl = {
	
	/* Primitive types */
	asNumber: function(val) {
		
		return val + "";
	},
	
	asString: function(val) {
		return val;
	},
	
	asArray: function(val) {
		return val.join();
	},
	
	
	/* Implement other types */
	asImage: function(img) {
		return '<img src="' + img + '" />';
	},
	
	
	/* Implement other types */
	asUrl: function(val) {
		console.log(val);
		return ['<a href="', val.url, '">', val.label, '</a>'].join('');
	}
}