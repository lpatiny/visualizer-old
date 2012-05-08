
CI.Types = {};

CI.Types._getjPath = function(data, jpaths, ext) { // ext serves to fech a children. Don't use from outside this scope
	var constructor = CI.Types[CI.dataType.getType(data)];
	
	if(!constructor)
		return jpaths;
		
	if(typeof constructor == 'function') {
		//var el = new constructor(data);
		var el = CI.Types.getInstance(data);
		return el.getjPath(jpaths/*typeof ext !== "undefined" ? jpaths[ext] : jpaths*/);
	} else {
		if(!constructor.getjPath)
			console.log(CI.dataType.getType(data));
		return constructor.getjPath(data, jpaths/*typeof ext !== "undefined" ? jpaths[ext] : jpaths, data*/);
	}
}

CI.Types.getInstance = function(data) {
	
	if(!data.instance)
		CI.dataType.instanciate(data);
	return data.instance;
}
CI.Types._jPathToOptions = function(jpath) {
	
	
	var options = [];
	
	function addOption(str, val, options) {
		
		var newOptions = [];
		options.push({
			title: val,
			key: str,
			children: newOptions
		});
		
		return newOptions;
	}
	
	addOption("", "Full object", options);
	
	var fracjPath = function(jpath, base, options) {
		
		var val;
		
		//if(jpath instanceof Array) {
		if(typeof jpath == 'object') {
			for(var i in jpath) {//}= 0; i < jpath.length; i++) {
				
				if(typeof i == "number" || !isNaN(parseInt(i))) {
					val = "[" + i + "]";
					str = base + val;
				} else {
					val = i;				
					str = base + (base.length > 0 ? "." : '') + val;
				}
				
				var options2 = addOption(str, val, options);
				fracjPath(jpath[i], str, options2);
			}
		
		//} else if(typeof jpath == 'object') {
		/*	console.log('doobject');
			for(var i in jpath) {
				val = i;
				str = base + (base.length > 0 ? "." : '') + val;
				addOption(str, val, lvl);
				
				console.log('do fetch children');

				fracjPath(jpath[i], str, lvl+5);
				console.log('fuction started');
			}*/
		} else if(typeof jpath != "boolean"){
			str = base + jpath;
			val = jpath;
			addOption(str, val, options);
		}
			
	}
	
	fracjPath(jpath, "", options);
	
	return options;
}



CI.Types.getValueFromJPath = function(jPath, data, array, elId, view, selfIsNull) {
	
	if(selfIsNull && (jPath == null || (jPath + "").length == 0))
		return data;
	
	if(data.instance && typeof data.instance['valueFromjPath'] == "function") {	
		return data.instance.valueFromjPath(jPath, array, elId, view);
	} else {
		var constructor = CI.Types[CI.dataType.getType(data)];
		if(typeof constructor['valueFromjPath'] == "function")
			return constructor.valueFromjPath(jPath, data, array, elId, view);
	}
}

CI.Types.jPathRegex = new RegExp('^((?:\\.|\\[|\]){0,2}([a-zA-Z0-9]*))');
CI.Types._valueFromJPathAndJson = function(jPath, json) {

	var element = $.extend({}, json);
	var regex = CI.Types.jPathRegex;
	if(typeof json == "string")
		return json;
		
	try {
		var i = 0;
		while((result = regex.exec(jPath))[2].length > 0) {
			if(!element) 
				return;
			element = element[result[2]];
			jPath = jPath.slice(result[1].length);		
		}
	
	//	eval("var element = json." + jPath + ";");
		//var element ='sa';
		
		
		return element;
	} catch(e) { console.log(e); return null; }
	
	if(typeof element == "undefined")
		return null;
		
	return element;
}



CI.Types.jPathFromJson = function(source, jpaths) {
	
	if(source instanceof Array)
		for(var i = 0; i < source.length; i++) {
			jpaths[i] = [];
			this._getjPath(source[i], jpaths[i]);
		}
	else if (typeof source == 'object') {
		for(var i in source) {
			jpaths[i] = {};
			this._getjPath(source[i], jpaths[i]);
		}
	} else {
		// Not much to do here
	}
	
//	console.log(jpaths);
}


CI.Types.string = {
	
	getjPath: function(data, jpaths) {
		return jpaths;
	}
	
};

CI.Types.number = {
	
	getjPath: function(data, jpaths) {
		return jpaths;
	}
	
};

CI.Types.array = {
	
	getjPath: function(data, jpaths) {
		return CI.Types.jPathFromJson(data, jpaths);
	},
	
	valueFromjPath: function(jPath, data) {
		return CI.Types._valueFromJPathAndJson(jPath, data);
	},
	
	instanciate: function(data) {
		var data = CI.Util.getValue(data);
		for(var i = 0; i < data.length; i++)
			CI.dataType.instanciate(data[i]);
	}
	
};

CI.Types.object = {
	
	getjPath: function(data, jpaths) {
		return CI.Types.jPathFromJson(data, jpaths);
	},
	
	instanciate: function(data) {
		for(var i in data)
			CI.dataType.instanciate(data[i]);
	},
	
	valueFromjPath: function(jPath, data) {
		
		return CI.Types._valueFromJPathAndJson(jPath, data);
	}
}

CI.Types.image = function(source) {
	
}

CI.Types.image.prototype = {
	
	getjPath: function(jpaths) {
		return jpaths;
	}
}

CI.Types.gif = function(source) {
	
};
CI.Types.gif.prototype = new CI.Types.image();


CI.Types.mf = {	
	getjPath: function(jpaths) {
		return jpaths;
	},
	
	instanciate: function(data) {
		
	},
};


$(document).bind('checkAsyncLoad', function(event, dom) {

	$(dom).find('.load-async').each(function() {
		var loadType = $(this).data('async-type');
		var fct = CI.dataType.asyncLoading[loadType];
		if(typeof fct == "function")
			fct($(this));
	});
});



CI.Types.lastIdCallback = 0;
CI.Types.addCallbackLoader = function(path, object, array, elId, view) {
	var id = ++CI.Types.lastIdCallback;
	
	object.callbacks.push(function() {
		
		var val = object.valueFromjPath(path);
		
		if(array && elId) {
			array[elId] = val;
		}
		
		$(document).trigger('checkAsyncLoad', [ $('#callback-load-' + id).html(CI.dataType.toScreen(object, view)) ]);
	});
	
	
	return '<span id="callback-load-' + id + '"></span>';
}



CI.Types.chemical = function(source, url) {
	this.source = source;
	this.url = url;
	this.loaded = true;
	this.callbacks = [];
	CI.dataType.instanciate(source);
	this.jsonLoader = new CI.Util.JsonLoader(url, this);
}


CI.Types.chemical.prototype = {
	
	getjPath: function(jpaths) {
		return CI.Types.jPathFromJson(this.source, jpaths, "");
	},
	
	valueFromjPath: function(jPath, array, elId, view) {
		if(!this.loaded)
			return CI.Types.addCallbackLoader(jPath, this, array, elId, view);
		return CI.Types._valueFromJPathAndJson(jPath, this.source);	
	},
	
	getIUPAC: function(fct, pos) {
		return this.valueFromjPath('iupac[0].value');
	},
	
	getMW: function(fct) {
		return this.valueFromjPath('mf[0].mw');	
	},
	
	getMF: function() {
		return this.valueFromjPath('mf[0].value.value');
	},
	
	getDensity: function() {
		return this.valueFromjPath('density[0].low');
	},
	
	getImageUrl: function() {
		return this.valueFromjPath('mol[0].gif.url');
	},
	
	doCallbacks: function() {
		for(var i = 0; i < this.callbacks.length; i++)
			this.callbacks[i].call(this);
	}
}




CI.Types.matrix = function(source, url) {
	this.source = source;
	this.url = url;
	this.callbacks = [];
}

CI.Types.matrix.prototype = {
	
	getjPath: function(jpaths) {
		return {xLabels: true, yLabels: true, data: true};
	},
	
	valueFromjPath: function(jPath) {
		return CI.Types._valueFromJPathAndJson(jPath, this.source);	
	}
}

CI.Types.molfile2D = {
	
	getjPath: function(jpaths) {
		return jpaths;
	}
	
}


CI.Types.molfile3D = {
	
	
	getjPath: function(jpaths) {
		return jpaths;
	}
}





CI.Types.jcamp = function(source, url, parent) {
	this.source = source;
	this.value = source;
	this.url = url;
	this.parent = parent;
	this.loaded = false;
	this.callbacks = [];
	CI.dataType.instanciate(source);
	this.type = "jcamp";
	
	this.jsonLoader = new CI.Util.JsonLoader(url, this, true);
}


CI.Types.jcamp.prototype = {
	
	getjPath: function(jpaths) {
		return jpaths;
	},
	
	valueFromjPath: function(jPath, array, elId, view) {
		
		
		if(!this.loaded) {
	
			return CI.Types.addCallbackLoader(jPath, this, array, elId, view);
			
		}
		return CI.Types._valueFromJPathAndJson(jPath, this.source);
	},	
	
	doCallbacks: function() {
		for(var i = 0; i < this.callbacks.length; i++)
			this.callbacks[i].call(this);
	}
}

