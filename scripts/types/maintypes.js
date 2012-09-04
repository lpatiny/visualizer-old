
CI.DataType = {};


CI.DataType.Structures = {
	
	'object': "object",
	'mol2D': "string",
	'gif': "string" ,
	'picture': "string",
	'string': "string",
	'gif': "string",
	'jpg': "string",
	'png': "string",
	'number': "number",
	'mf': 'string',
	'jcamp': "string",

	'chart': {

		"type": "object",
		"elements": {
			"serieLabels": {
				"type": "array",
				"elements": "string"
			},


			"series": {
				"type": "array",
				"elements": {
					"type": "array",
					"elements": {
						"type": "object",
						"elements": {
							"value": "number",
						},
						"otherElementsPossible": true
					}
				}
			},

			"title": "string",
			"x": {
				"type": "array",
				"elements": "number"
			},

			"xAxis": {
				"type": "object",
				"elements": {
					"label": "string",
					"maxValue": "number",
					"minValue": "number"
				}
			},

			"yAxis": {
				"type": "object",
				"elements": {
					"label": "string"
				}
			}
		}
	},

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


/* Returns the type of an element */
CI.DataType.getType = function(element) {
	
	if(element == undefined)
		return;
		
	var type = typeof element;

	if(type == 'object') {
		if(element instanceof Array)
			return "array";
		if(typeof element.type == "undefined")
			return "object";
		else if(CI.DataType.Structures[element.type])
			return element.type;
		else
			return console.error("Type " + element.type + " could not be found")
	}
	

	// Native types: int, string, boolean
	return type;
}

/*
CI.DataType.SubElements = {
	
	"chemical": {
		"Molecular formula": { "type": "mf", "jpath": "mf.0.value" },
		"Molecular mass": { "type": "int", "jpath": "mf.0.mw" }
	}
}
*/	

CI.DataType.getValueIfNeeded = function(element) {
	if(element.value && element.type)
		return element.value;
	
	if(element.url && element.type) {
		element.value = undefined;
		return element.value;
	}
	
	return element;
}

CI.DataType._PENDING = new Object();



CI.DataType.fetchElementIfNeeded = function(element) {
	
	if(element === false || element == undefined)
		return $.Deferred().reject();
		
	var type = element.type, ajaxType, def;
	if(!element.value && element.url) {
		
		ajaxType = typeof CI.DataType.Structures[type] == "object" ? 'json' : 'text';
		
		return $.Deferred(function(dfd) {

			$.ajax({
			url: element.url,
			dataType: ajaxType,
			type: "get",
			timeout: 120000,

			success: function(data, text, jqxhr) {
				element.value = data;
				dfd.resolve(element);
			},

			complete: function() {

			},

			error: function() {

			}
		})}).promise();
		
	} else {
		def = $.Deferred()
		return def.resolve(element);
	}
	
	return false;
}


CI.DataType.getValueFromJPath = function(element, jpath, wholeObject) {
	
	if(!jpath.split)
		jpath = '';
		
	var jpath2 = jpath.split('.');
	jpath2.shift();

	return CI.DataType._getValueFromJPath(element, jpath2);
}

CI.DataType._getValueFromJPath = function(element, jpath) {
	var el = CI.DataType.getValueIfNeeded(element);
	var type;
	var jpathElement = jpath.shift();
	if(jpathElement) {
		el = el[jpathElement];
		return CI.DataType.fetchElementIfNeeded(el).done(function(elChildren) {
			CI.DataType._getValueFromJPath(elChildren, jpath);
		});
	} else {
		return $.Deferred().resolve(element);
	}
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
	
	if(el && el.type && CI.DataType.Structures[el.type]) {
		structure = CI.DataType.Structures[el.type];
	} else if(element instanceof Array) {
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
		//for(var i in element) 
		structure.elements = CI.DataType.getStructureFromElement(element);
		
		
	} else if(typeof element == "object") {
		
		
		structure.type = "object";	
		//structure.isFolder = true;
		structure.elements = {};
		for(var i in element) 
			structure.elements[i] = CI.DataType.getStructureFromElement(element[i]);
	} 
	else if(el.type)
		structure = el.type;
	else
		return typeof el;
		
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


	CI.DataType.getValueFromJPath(source[i], jpath).done(function(data) {
		CI.DataType._toScreen(data, box).done(function(val) {
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


CI.DataType.asyncToScreenHtml = function(element, box, jpath) {
	
	// Needs fetching
	if(element.type && !element.value && element.url) {

		var html = "";
		html += '<span id="callback-load-';
		html += ++CI.DataType.asyncId;
		html += ' class="loading">Loading...</span>';
		CI.DataType._doFetchElementHTMLCallback(element, box, CI.DataType.asyncId, jpath);

		return $.Deferred.resolve(html);
	} else
		// returns element.value if fetched
		return CI.DataType.getValueFromJPath(element, jpath).pipe(function(data) { return CI.DataType._toScreen(data, box) });
		
}


CI.DataType._toScreen = function(element, box) {

	var dif = $.Deferred();
	CI.DataType.fetchElementIfNeeded(element).done(function(data) { CI.DataType._valueToScreen(dif, data, box); });
	return dif.promise();
}

CI.DataType.toScreen = CI.DataType._toScreen;
CI.DataType._valueToScreen = function(def, data, box) {

	var repoFuncs = box.view.typeToScreen;

	var type = CI.DataType.getType(data);

	CI.DataType.getValueIfNeeded(data);

	if(typeof repoFuncs[type] == 'function')
		return repoFuncs[type].call(box.view, def, data);
	
	if(CI.Type[type] && typeof CI.Type[type].toScreen == 'function')
		return CI.Type[type].toScreen(def, data);
}

CI.Type = {};

CI.Type["string"] = {
	toScreen: function(def, val) { def.resolve(val); }
};
	
CI.Type["number"] = {		
	toScreen: function(def, val) { def.resolve(val); }
};

CI.Type["chemical"] = {

	getIUPAC: function(def, source) {
		CI.DataType.getValueFromJPath(source, "element.iupac.0.value").done(def.resolve);
	},
	
	toScreen: function(def, val) {

		CI.Type[CI.DataType.Structures.chemical].getIUPAC(def, val);
	}
};
	


CI.Type["picture"] = {		
	
	toScreen: function(def, val) {

		def.resolve('<img src="' + CI.DataType.getValueIfNeeded(val) + '" />');
	}
};
	




CI.Type["mol2d"] = {		
	
	toScreen: function(def, molfile) {


		var id = CI.Util.getNextUniqueId();
		CI.Util.DOMDeferred.done(function() {
			var canvas = new ChemDoodle.ViewerCanvas(id, 100, 100);
			canvas.specs.backgroundColor = "transparent";
			canvas.specs.bonds_width_2D = .6;
			canvas.specs.bonds_saturationWidth_2D = .18;
			canvas.specs.bonds_hashSpacing_2D = 2.5;
			canvas.specs.atoms_font_size_2D = 10;
			canvas.specs.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
			canvas.specs.atoms_displayTerminalCarbonLabels_2D = true;

			var molLoaded = ChemDoodle.readMOL(molfile);
			molLoaded.scaleToAverageBondLength(14.4);
			canvas.loadMolecule(molLoaded);
		});

		def.resolve('<canvas id="' + id + '"></canvas>');
	}
};
	

CI.Type["jcamp"] = {
		
	toScreen: function(def, value) {

		var id = CI.Util.getNextUniqueId();
		CI.Util.DOMDeferred.done(function() {
				var spectra = new ChemDoodle.PerspectiveCanvas(id, '500', '500');
				$("#" + id).data('spectra', spectra);
				spectra.specs.plots_showYAxis = true;
				spectra.specs.plots_flipXAxis = false;

				var jcampLoaded = ChemDoodle.readJCAMP(value.value);
		  		spectra.loadSpectrum(jcampLoaded);
		});

		def.resolve('<canvas id="' + id + '"></canvas>');
	}
};

CI.Type["mf"] = {
	toScreen: function(def, value) {
		return def.resolve(CI.DataType.getValueIfNeeded(value).replace(/\[([0-9]+)/g,"[<sup>$1</sup>").replace(/([a-zA-Z)])([0-9]+)/g,"$1<sub>$2</sub>").replace(/\(([0-9+-]+)\)/g,"<sup>$1</sup>"));
	}
};



CI.Type["chart"] = {
	toScreen: function(def, value) {

		console.log(value);
		
	}
};

CI.Type.gif = CI.Type.picture;
CI.Type.jpeg = CI.Type.picture;
CI.Type.png = CI.Type.picture;
