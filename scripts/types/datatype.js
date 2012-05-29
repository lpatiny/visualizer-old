/*
CI.dataType = {
	
	getType: function(data) {
		
		if(data == undefined)
			return;
			
		var type = typeof data;
		
		if(type == 'object') {
			
			if(data instanceof Array)
				return 'array';
				
			if(typeof data.type == "undefined")
				return 'object';
			else
				return data.type;
		}

		if(type == "undefined") {
			
			throw {notify: true, display: false, message: "The type cannot be undefined"};
				
		}
			
		if(type == "function")
			throw {notify: true, display: false, message: "The type cannot be a function"};
			
		return type;
	},
	
	
	instanciate: function(data) {
	
		var type = CI.dataType.getType(data);
		
		if(!CI.Types[type]) {
			return;
		}
		if(!(typeof CI.Types[type] == "function"))
			if(typeof CI.Types[type].instanciate == "function")
				return CI.Types[type].instanciate(data);
			else
				return;
		
		return data.instance = new CI.Types[type](data.value, data.url, data);		
	},
	
	toScreen: function(val, view) {
		
		var repoFuncs = typeof view.typeToScreen == 'object' ? view.typeToScreen : {}; 
		return CI.dataType.typeToScreen(val, repoFuncs);	
	},
	
	
	typeToScreen: function(value, repoFuncs) {
		
		if(!value)
			return;
		
		var type = CI.dataType.getType(value);
		
		var toFunc = value;
		if(typeof value.type !== "undefined")
			toFunc = typeof value.url != "undefined" ? value.url : value.value;
			
	    	var method = ['as', type.charAt(0).toUpperCase(), type.substr(1)].join('');

		if(typeof repoFuncs[method] == 'function')
			return repoFuncs[method](toFunc);
			
		if(typeof CI.dataType.implToScreen[method] == 'function')
			return CI.dataType.implToScreen[method](toFunc);
			
		throw "The variable type \"" + type + "\" is not supported";		
	}
}
*/

/*

CI.dataType._mol2did = 0;
CI.dataType._jcampid = 0;

CI.dataType.implToScreen = {
	
	
	asNumber: function(val) {
		
		return val + "";
	},
	
	asString: function(val) {
		return val;
	},
	
	asArray: function(val) {
		return val.join();
	},
	
	
	asImage: function(img) {
		return '<img src="' + img + '" />';
	},
	
	
	asUrl: function(val) {
		return ['<a href="', val.url, '">', val.label, '</a>'].join('');
	},
	
	asObject: function(val) {
		return '--object--';
	},
	
	asMf: function(val) {
		var val = CI.Util.getValue(val);
		return val;
	},
	
	asGif: function(val) {
		var url = val.url;
		return CI.dataType.implToScreen.asImage(url);
	},
	
	asMolfile2D: function(val) {
		return '<canvas class="load-async" data-async-type="molfile2D" data-value="' + escape(val.value) + '"></canvas>';
	},
	
	asJcamp: function(val) {
		return '<canvas class="load-async" data-async-type="jcamp" data-value="' + escape(val.value) + '"></canvas>';
	},
	
	asMol3D: function(val) {
		
		// Load here chemdoodle
		
	}
	
}

CI.dataType.asyncLoading = {
	
	
}

*/
