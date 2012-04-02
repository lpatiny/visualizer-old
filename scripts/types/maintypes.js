
CI.Types = {};

CI.Types._getjPath = function(data, jpaths, ext) {
	var constructor = CI.Types[CI.dataType.getType(data)];
	if(typeof constructor == 'function') {
		var el = new constructor(data);
		return el.getjPath(typeof ext !== "undefined" ? jpaths[ext] : jpaths);
	} else
		return constructor.getjPath(typeof ext !== "undefined" ? jpaths[ext] : jpaths, data);
}

CI.Types._jPathToOptions = function(jpath) {
	
	var options = [];
	
	function addOption(str, val, lvl) {
		var padding = lvl * 10;
		options.push(['<option style="padding-left:', padding, 'px" value="', str, '">', val, '</option>'].join(''));
	}
	
	function fracjPath(jpath, base, lvl) {
		
		var val;
		
		if(jpath instanceof Array) {
			for(var i = 0; i < jpath.length; i++) {
				val = "[" + i + "]"
				str = base + val;
				addOption(str, val, lvl);
				fracjPath(jpath[i], str, lvl+1);
			}
		} else if(typeof jpath == 'object') {

			for(var i in jpath) {
				val = i;
				str = base + (base.length > 0 ? "." : '') + val;
				addOption(str, val, lvl);
				fracjPath(jpath[i], str, lvl+1);
			}
		} else if(typeof jpath != "boolean"){
			str = base + jpath;
			val = jpath;
			addOption(str, val, lvl);
		}
			
	}
	
	fracjPath(jpath, "", 0);
	return options.join('');
}



CI.Types.getValueFromJPath = function(jPath, data) {
	
	if(typeof data['valueFromjPath'] == "function")
		data.valueFromjPath(jPath);
	else {
		var constructor = CI.Types[CI.dataType.getType(data)];
		if(typeof constructor['valueFromjPath'] == "function")
			return constructor.valueFromjPath(jPath, data);
	}
}

CI.Types._valueFromJPathAndJson = function(jPath, json) {

	if(!new RegExp('^([a-zA-Z0-9]*(\.[a-zA-Z0-9]|\[[a-zA-Z0-9]*\]))*$').test(jPath))
		return;

	try {
		eval("var element = json." + jPath);
	} catch(e) { return null; }
	
	if(typeof element == "undefined")
		return null;
		
	return element;
}



CI.Types.jPathFromJson = function(source, jpaths, root) {
	
	if(source instanceof Array)
		for(var i = 0; i < source.length; i++) {
			jpaths[root + "[" + i + "]"] = true;
			this.dogetjPath(source[i], jpaths, root + "[" + i + "]");
		}
	else if (typeof source == 'object') {
		for(var i in source) {
			var spacingChar = (root.substr(root.length - 1) == "]") ? '' : '.';
			jpaths[root + spacingChar + i] = true;
			this.dogetjPath(source[i], jpaths, root + spacingChar + i);
		}
	} else {
		// Not much to do here
	}
}


CI.Types.string = {
	
	getjPath: function(jpaths, data) {
		return jpaths;
	}
	
};

CI.Types.number = {
	
	getjPath: function(jpaths, data) {
		return jpaths;
	}
	
};

CI.Types.array = {
	
	getjPath: function(jpaths, data) {
		for(var i = 0; i < data.length; i++) {
			jpaths[i] = new Array();
			CI.Types._getjPath(data[i], jpaths, i);
		}
	},
	
	valueFromjPath: function(jPath, data) {
		return CI.Types._valueFromJPathAndJson(jPath, data);
	},
	
	instanciate: function(data) {
		for(var i = 0; i < data.length; i++)
			CI.dataType.instanciate(data[i]);
	}
	
};

CI.Types.object = {
	
	getjPath: function(jpaths, data) {
		for(var i in data) {
			jpaths[i] = {};
			CI.Types._getjPath(data[i], jpaths, i);
		}
	},
	
	instanciate: function() {
		for(var i in data)
			CI.Types.instanciate(data[i]);
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


CI.Types.chemical = function(source, url) {
	this.source = source;
	this.url = url;
	this.loaded = true;
	this.callbacks = [];
	
	var chemical = this;
	if(this.source == null) {
		this.loaded = false;
		var query = new UTIL.AjaxQuery({
			url: url,
			success: function(data) {
				chemical.data = data;
				chemical.loaded = true;
				chemical.doCallbacks();
			}
		});
	}
	
}

CI.Types.chemical.prototype = {
	
	getjPath: function(jpaths) {
		return CI.Types.jPathFromJson(this.source, jpaths, "");
	},
	
	valueFromjPath: function(jPath) {
		return CI.Types._valueFromJPathAndJson(jPath, this.source)	
	},
	
	
	getIUPAC: function(fct) {
		this.callbacks.push(function(chemical) {
			var iupac = this.data.entry.iupac.value;
			fct(iupac);
		});
	},
	
	doCallbacks: function() {
		for(var i = 0; i < this.callbacks.length; i++) {
			this.callbacks[i].call(this);
		}
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