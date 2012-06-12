
CI.DataType = {};


CI.DataType.Structures = {
	
	'mol2D': "string",
	'mf': 'string',
	'chemical': {
		"type": "object",
		"elements": {
			"_entryID": "int",
			"supplierName": "string",
			"iupac": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "string",
						"language": "string"	
					}
				}
			},
			
			"mf": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "mf",
						"mw": "int",
						"exactMass": "int" 
					}
				}
			},
			
			"mol": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "molfile2D",
						"gif": "gif"
					}
				}
			},
			
			"rn": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "int"
					}
				}
			},
			
			"bachID": "string",
			"catalogID": "string",
			"entryDetails": "chemicalDetails"
		}
	},
	
	"chemicalDetails": {
		"type": "object",
		"elements": {
			"_entryID": "int",
			"supplierName": "string",
			"iupac": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "string",
						"language": "string"	
					}
				}
			},
			
			"mf": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "mf",
						"mw": "int",
						"exactMass": "int" 
					}
				}
			},
			
			"mol": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "molfile2D",
						"gif": "gif"
					}
				}
			},
			
			"rn": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "int"
					}
				}
			},
			
			"bachID": "string",
			"catalogID": "string",
			
			"bp": {
				
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"pressure": "number",
						"high": "number",
						"low": "number"
					}
				}
				
			},
			
			"mp": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"pressure": "number",
						"high": "number",
						"low": "number"
					}
				}
				
			},
			
			"rn": {
				
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"value": "number"
					}
				}
				
			},
			
			"density": {
				
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"high": "number",
						"low": "number",
						"temperature": "number",
					}
				}
				
			},
			
			"mol3d": {
				"type": "array",
				"elements": "molfile3d"
			},
			
			"ir": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"conditions": "string",
						"solvent": "string",
						"jcamp": "jcamp",
						"view": {
							"type": "object",
							"elements": {
								"description": "string",
								"value": "string",
								"url": "string",
								"pdf": "string"
							}
						}
						
					}
					
				}
				
			},
			
			
			"nmr": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"pressure": "string",
						"solvent": "string",
						"experiment": "string",
						"frequency": "number",
						"nucleus": "string",
						"temperature": "string",
						"jcamp": "jcamp",
						"view": {
							"type": "object",
							"elements": {
								"description": "string",
								"value": "string",
								"url": "string",
								"pdf": "string"
							}
						}
						
					}
					
				}
				
			},
			
			
			
			"mass": {
				"type": "array",
				"elements": {
					"type": "object",
					"elements": {
						"experiment": "string",
						"jcamp": "jcamp"
					}
					
				}
				
			}
			
		}
	}
};



CI.DataType.getType = function(element) {
	
	if(!element)
		return;
		
	var type = typeof element;
	if(type == 'object') {
		if(element instanceof Array)
			return 'array';
		if(typeof element.type == "undefined")
			return 'object';
		else
			return element.type;
	}
	/*if(type == "undefined")		
		throw {notify: true, display: false, message: "The type cannot be undefined"};
	if(type == "function")
		throw {notify: true, display: false, message: "The type cannot be a function"};*/
	return type;	
}


CI.DataType.SubElements = {
	
	"chemical": {
		"Molecular formula": { "type": "mf", "jpath": "mf.0.value" },
		"Molecular mass": { "type": "int", "jpath": "mf.0.mw" }
	}
}
	

CI.DataType.getValueIfNeeded = function(element) {
	if(element.value && element.type)
		return element.value;
	
	if(element.url && element.type) {
		element.value = undefined;
		return element.value;
	}
	
	return element;
}


CI.DataType.fetchElementIfNeeded = function(element, callback) {
	
	if(!element)
		return;
		
	var type = element.type, ajaxType;
	if(!element.value && element.url) {
		
		ajaxType = typeof CI.DataType.Structures[type] == "object" ? 'json' : 'text';
		
		$.ajax({
			url: element.url,
			dataType: ajaxType,
			type: "get",
			timeout: 120000,
			success: function(data) {
				element.value = data;
				callback(element);
			}
		});
	} else {
		callback(element);
		return element;
	}
}


CI.DataType.getValueFromJPath = function(element, jpath, callback, wholeObject) {
	
	if(!jpath.split)
		jpath = '';
		
	var jpath2 = jpath.split('.');
	jpath2.shift();

	return CI.DataType._getValueFromJPath(element, jpath2, callback);
}

CI.DataType._getValueFromJPath = function(element, jpath, callback) {
	var el = CI.DataType.getValueIfNeeded(element);
	var type;
	var jpathElement = jpath.shift();
	
	if(jpathElement == undefined && callback)
		callback(element);
		
	el = el[jpathElement];
	return CI.DataType.fetchElementIfNeeded(el, function(elChildren) {
		CI.DataType._getValueFromJPath(elChildren, jpath, callback);
	});
}


CI.DataType.getJPathsFromStructure = function(structure, title, jpathspool, keystr) {
 
 	if(!structure)
		return;

	var children = [];
	
	if(structure.elements) {
		
			
		if(!keystr || keystr == null) {
			keystr = "element";
			title = keystr;
		} else
			keystr = keystr + "." + title;
					
		jpathspool.push({ title: title, children: children, key: keystr });
	
		switch(structure.type) {
			
			case 'object':
				
				for(var i in structure.elements) {
					CI.DataType.getJPathsFromStructure(structure.elements[i], i, children, keystr);
				}
				
			break;
			
			case 'array':
			
				CI.DataType.getJPathsFromStructure(structure.elements, '0', children, keystr);
				/*
				var jpathpoolchild = [];
				var keystr2 = keystr + ".0";
				jpathspool.title =  "n-th element";
				jpathspool.children = jpathpoolchild;
				jpathspool.key = keystr2;
				CI.DataType.getJPathsFromStructure(structure.elements, jpathpoolchild, keystr2);*/
			break;
		}		
	} else {
		
		// Pretyped structures
		// Like chemical: "chemical"
		if(CI.DataType.Structures[structure]) {
			
			CI.DataType.getJPathsFromStructure(CI.DataType.Structures[structure], title, jpathspool, keystr);
			
			
		} else {
			
			
					
			if(!keystr || keystr == null) {
				keystr = "element";
				title = keystr;
			} else
				keystr = keystr + "." + title;
				
				
			jpathspool.push({ title: title, children: children, key: keystr });
	
		}
	}
	
}


CI.DataType.getStructureFromElement = function(element) {
	
	var structure = {};
	var el = element;
	if(!element)
		return;
		
	if(element.type) 
		element = element.value;
	
	
	if(element instanceof Array) {
		var element = element[0];
		structure.type = "array";
		structure.elements = {};
		//structure.isFolder = true;
		/*
		if(typeof element != "object")
			structure.elements = typeof element;
		else
			CI.DataType.getStructureFromElement(element, structure.elements);
		*/
		for(var i in element) 
			structure.elements[i] = CI.DataType.getStructureFromElement(element[i]);
		
		
	} else if(typeof element == "object") {
		
		structure.type = "object";	
		//structure.isFolder = true;
		structure.elements = {};
		
		for(var i in element) 
			structure.elements[i] = CI.DataType.getStructureFromElement(element[i]);
		
	} else if(el && el.type && CI.DataType.Structures[el.type])
		structure = CI.DataType.Structures[el.type];
		
	return structure;
	
}

CI.DataType.getJPathsFromElement = function(element, jpaths) {
	
	
	if(!jpaths)
		var jpaths = [];
		
	if(!element)
		return;
		
	// We know the dynamic structure
	// Apply to typed elements + to js objects
	if(element.structure)
		CI.DataType.getJPathsFromStructure(element.structure, null, jpaths);	
	else if(element.type && CI.DataType.Structures[element.type])
		CI.DataType.getJPathsFromStructure(CI.DataType.Structures[element.type], null, jpaths);
	else {
		
		switch(typeof element) {
			case 'object':
				var structure = CI.DataType.getStructureFromElement(element, structure);
				CI.DataType.getJPathsFromStructure(structure, null, jpaths);
			break;
			
			default:
				return;
			break;
		}
	}
	/*
	// Typed element
	if(element.type && element.value) {
		
		var type = element.type;
		// We know the structure
		if(element.structure) {
			
	
	*/
}




CI.DataType._doFetchElementAttributeCallback = function(element, box, asyncId, attribute) {
	CI.DataType.fetchElementIfNeeded(element, function(val) {
		CI.DataType._valueToScreen(element, box, function(val) {
			$("#" + asyncId).attr(attribute, val);
		});
	});
}



CI.DataType._doFetchElementHTMLCallback = function(element, box, asyncId) {
	CI.DataType.fetchElementIfNeeded(element, function(val) {
		CI.DataType._valueToScreen(element, box, function(val) {
			$("#" + asyncId).html(val);
		});
	});
}


CI.DataType.asyncToScreenAttribute = function(element, attribute, box) {
	
	// Needs fetching
	if(!element.value && element.url) {
		
		var elementId = "";
		elementId += "callbck-load-";
		elementId += ++CI.DataType.asyncId;
		
		CI.DataType._doFetchElementAttributeCallback(element, box, CI.DataType.asyncId, attribute);
		 
		return elementId;
	} else
		// returns element.value if fetched
		return CI.DataType._toScreen(element, box);
		
	
}


CI.DataType.asyncToScreenHtml = function(element, box) {
	
	// Needs fetching
	if(element.type && !element.value && element.url) {
		var html = "";
		html += '<span id="callback-load-';
		html += ++CI.DataType.asyncId;
		html += ' class="loading">Loading...</span>';
		
		CI.DataType._doFetchElementHTMLCallback(element, box, CI.DataType.asyncId);
		  
		return html;
	} else
		// returns element.value if fetched
		return CI.DataType._toScreen(element, box);
		
}


CI.DataType._toScreen = function(element, box, callback) {
	
	var value = CI.DataType.getValueIfNeeded(element);
	return CI.DataType._valueToScreen(CI.DataType.fetchElementIfNeeded(element, function(val) {
		CI.DataType._valueToScreen(val, box, callback);
	}), box, callback);
}

CI.DataType.toScreen = CI.DataType._toScreen;

CI.DataType._valueToScreen = function(value, box, callback) {
	
	var repoFuncs = box.view.typeToScreen;
	var type = CI.DataType.getType(value);
	var valueToDisplay = CI.DataType.getValueIfNeeded(value); 
	
	if(!type)
		return;
		
	if(typeof repoFuncs[type] == 'function') {
		return repoFuncs[type](valueToDisplay, callback);
	}	
	
	if(CI.Type[type] && typeof CI.Type[type].toScreen == 'function') {
		return CI.Type[type].toScreen(valueToDisplay, callback)
	}
	
	
	if(callback)
		callback("__unimplemented");	
}
	


CI.Type = {
	
	string: {
		
		toScreen: function(val, callback) { if(callback) callback(val); else return val; }
	},
	
	number: {
		
		toScreen: function(val, callback) { if(callback) callback(val); else return val; }
	},
	
	chemical: {
		
		getIUPAC: function(source, clbk) {
			return CI.DataType.getValueFromJPath(source, "element.iupac.0.value", clbk);
		},
		
		toScreen: function(val, callback) {
			return CI.Type.chemical.getIUPAC(val, callback);
		}
		
	},
	
	
	gif: {
		
		toScreen: function(val, clbk) {
			var val = '<img src="' + val + '" />';
			if(clbk)
				clbk(val);
			else
				return val;
			
		}	
		
	},
	
	molfile2D: {
	
		toScreen: function(molfile) {
			
			var mol = unescape(dom.data('value'));
			
			dom.attr('id', 'mol2d_' + (++CI.dataType._mol2did));
			
			var canvas = new ChemDoodle.ViewerCanvas('mol2d_' + (CI.dataType._mol2did), 100, 100);
			canvas.specs.backgroundColor = "transparent";
			canvas.specs.bonds_width_2D = .6;
			canvas.specs.bonds_saturationWidth_2D = .18;
			canvas.specs.bonds_hashSpacing_2D = 2.5;
			canvas.specs.atoms_font_size_2D = 10;
			canvas.specs.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
			canvas.specs.atoms_displayTerminalCarbonLabels_2D = true;
			
			var molLoaded = ChemDoodle.readMOL(mol);
			molLoaded.scaleToAverageBondLength(14.4);
			canvas.loadMolecule(molLoaded);
		}
	},
	
	jcamp: {
		toScreen: function(value) {
			return '<canvas data-async-type="jcamp"  class="asyncLoading" data-jcamp="' + escape(value) + '"></canvas>';
		}
	},
	
	mf: {
		toScreen: function(value, callback) {
			var val = value.replace(/\[([0-9]+)/g,"[<sup>$1</sup>").replace(/([a-zA-Z)])([0-9]+)/g,"$1<sub>$2</sub>");
			if(callback)
				return callback(val);
			return val;
		}
	}
}


CI.DataType._jcampid = 0;
CI.DataType._asyncLoading = 0;

CI.DataType.asyncLoading = {
	
	jcamp: function(dom) {
		
		var data = unescape(dom.data('jcamp'));
		
		dom.attr('id', 'jcamp_' + (++CI.DataType._jcampid));
		var spectra = new ChemDoodle.PerspectiveCanvas('jcamp_' + (CI.DataType._jcampid), '500', '500');
		dom.data('spectra', spectra);
		spectra.specs.plots_showYAxis = true;
		spectra.specs.plots_flipXAxis = false;
		var jcampLoaded = ChemDoodle.readJCAMP(data);
		
  		spectra.loadSpectrum(jcampLoaded);
	  		
	}
	
}


$(document).bind('checkAsyncLoad', function(event, dom) {

	$(dom).find('.asyncLoading').each(function() {
		var loadType = $(this).data('async-type');
		var fct = CI.DataType.asyncLoading[loadType];
		
		if(typeof fct == "function")
			fct($(this));
	});
});






/*
CI.Types.mf = {	
	getjPath: function(jpaths) {
		return jpaths;
	},
	
	instanciate: function(data) {
		
	},
};


CI.Types.chemical = function(source, url, parent) {
	this.source = source;
	this.url = url;
	this.parent = parent;
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
		return this.valueFromjPath('');
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

*/

