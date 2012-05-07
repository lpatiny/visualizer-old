
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
			
		return data.instance = new CI.Types[type](data.value, data.url);		
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
/*		if(typeof value.type !== "undefined")
			toFunc = typeof value.url != "undefined" ? value.url : value.value;
			*/
	    	var method = ['as', type.charAt(0).toUpperCase(), type.substr(1)].join('');

		if(typeof repoFuncs[method] == 'function')
			return repoFuncs[method](toFunc);
			
		if(typeof CI.dataType.implToScreen[method] == 'function')
			return CI.dataType.implToScreen[method](toFunc);
			
		throw "The variable type \"" + type + "\" is not supported";		
	}
}

CI.dataType._mol2did = 0;

CI.dataType.implToScreen = {
	
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
	
	asMol3D: function(val) {
		
		// Load here chemdoodle
		
	}
	
}

CI.dataType.asyncLoading = {
	
	
	molfile2D: function(dom) {
		
		
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
	
}
