

CI.EntryPoint = function(structure, data, options, onLoad) {
	
	this.options = options;
	this.onLoad = onLoad;
	
	var entryPoint = this;
	
	
	function init() {
		if(typeof structure == "object")
			doStructure(structure);
		else
			doGetStructure(structure);
	}
	
	function doStructure(structure) {
		
		CI.Grid.init(structure.grid);
		
		entryPoint.structure = structure;
		
		if(!structure.entryPoint) 
			structure.entryPoint = { variables: {} };
		
		if(!structure.modules)
			structure.modules = [];
			
		entryPoint.entryData = structure.entryPoint;
		
		if(structure.modules !== undefined)
			for(var i = 0; i < structure.modules.length; i++) {
				entryPoint.addModuleFromJSON(structure.modules[i]);
			}
			
		CI.DataSource.prototype._bindEvent();
		
		if(typeof data == "object")
			doData(data);
		else
			doGetData(data);
		
	}
	
	function doGetStructure(structure) {
		jQuery.ajax({
			url: structure,
			data: {},
			type: 'get',
			dataType: 'json',
			success: function(structure) {
				doStructure(structure);
			},
			
			error: function() {
				$("body").unmask().mask("Error while loading structure JSON. Check JSON integrity", { error: true });
			}
		});
	}
	
	function doData(page) {
		entryPoint.loaded(page);
	}
	
	function doGetData(data) {
		jQuery.ajax({
			url: data,
			data: {},
			type: 'get',
			dataType: 'text',
			success: function(data) {
				CI.WebWorker.send('jsonparser', data, function(data) {
					doData(data);	
				})
			},
			
			error: function() {
				$("body").unmask().mask("Error while loading data JSON. Check JSON integrity", { error: true });				
			}
		});
	}
	
	init();
}


CI.EntryPoint.prototype = {

	loaded: function(data, doNotCallback) {
		
		this.data = data;
	
		if(this.entryData && this.entryData.variables) {
		
			var vars = this.entryData.variables;
			if(!vars)
				return;
			
			for(var i in this.data) {
			//	CI.dataType.instanciate(this.data[i]);
				
				for(var j = 0; j < vars.length; j++) {
					
					if(vars[j].sourcename == i) {
						CI.DataType.getValueFromJPath(this.data[i], vars[j].jpath, function(val) {
							CI.API.setSharedVar(vars[j].varname, val);	
						});
					}
				}
			}
		}
		
		if(doNotCallback)
			return;
			
		if(typeof this.onLoad == 'function')
			this.onLoad(this, this.data);
	},
	
	getEntryDataVariables: function() {
		
		
		return this.entryData.variables;		
		
	},
	
	setEntryDataVariables: function(vars) {
		this.entryData.variables = vars;
		this.loaded(this.data, false);
	},
	
	save: function() {
		var script = JSON.stringify(this.structure);
		$.post(_saveViewUrl, {content: script}, function() {
			$("#savedone").html('Visualizer saved !');
		});
		$.fancybox('<h3>JSON of the structure</h3><div id="savedone">Your visualizer is currently saving. Please wait...</div><textarea style="width: 500px; height: 300px;">' + script + '</textarea>', { autoSize: false, height: 350, width: 505});
	},
	
	getDataFromSource: function(child) {
		
		if(!child)
			return this.data;
		else
			return this.data[child];
	},
	
	addModuleFromJSON: function(json, addToDefinition) {
		if(addToDefinition) {
			this.structure.modules.push(json);
		}
		var Module = new CI.Module(json);
		this.addModule(Module); 
	},
	
	addModule: function(Module) {
		CI.modules[Module.getId()] = Module;
		CI.Grid.addModule(Module);
	},
	
	removeModule: function(Module) {
		for(var i = 0; i < this.structure.modules.length; i++) {
			if(Module.getDefinition() == this.structure.modules[i]) {
				this.structure.modules.splice(i, 1);
				break;
			}
		}
		CI.Grid.removeModule(Module);
	}
}







var red = '#ff0000';
	var orange = '#EDAB10';
	var green = '#9DDDA3';	

	if(/*Err_L_Reservoir && Err_L_Reservoir > 0.5 || */L_Bassin === false || L_Bassin === null) {

		setText('#vartxtlvl', '--- m');
		setAttribute('#varrectlvl', 'fill', '#f0f0f0');

	} else {
		setText('#vartxtlvl', L_Bassin.toFixed(2) + ' m');
		
		setDimension('#varrectlvl', L_Bassin, 'height', [0, 0, 4, 126]);
		setBottom('#varrectlvl', 250);
		setAttribute('#varrectlvl', 'fill', L_Bassin < 1.5 ? red : '#C1E6EA');
	} 




	if(/*Err_Q_Sortie && Err_Q_Sortie > 0.5 || */!Q_EP_Out) {
		setText('#txtDebit', 'Q = --- l/min');
	} else {
		setText('#txtDebit', 'Q = ' + Q_EP_Out.toFixed(2) + ' l/min');
	}
	
	if(P_UV_Lamp) {
		setText('#P_UV', P_UV_Lamp.toFixed(2) + ' W/m2');
	} else {
		setText('#P_UV', '--- W/m2');
	}

	if(T_UV) {
		setText('#T_UV', T_UV.toFixed(2) + ' °C');
	} else {
		setText('#T_UV', '--- °C');
	}
 	
	if(!isNaN(parseInt(S_UV_Status))) {
		
		if(S_UV_Status < 0.5) {
			setAttribute('#UVContainer', 'fill', green);
			setAttribute('#lampTop', 'fill', 'transparent');
			setAttribute('#lampBottom', 'fill', 'transparent');

		} else if(S_UV_Status > 0.5 && S_UV_Status < 1.5) {
			setAttribute('#lampBottom', 'fill', orange);
			setAttribute('#lampTop', 'fill', 'transparent');
			setAttribute('#UVContainer', 'fill', 'transparent');

		} else if(S_UV_Status > 1.5 && S_UV_Status < 2.5) {
			setAttribute('#lampTop', 'fill', red);
			setAttribute('#lampBottom', 'fill', 'transparent');
			setAttribute('#UVContainer', 'fill', 'transparent');

		} else {
			setAttribute('#lampTop', 'fill', 'transparent');
			setAttribute('#lampBottom', 'fill', 'transparent');
			setAttribute('#UVContainer', 'fill', '#f0f0f0');

		}

	} else {
		setAttribute('#UVLamp2', 'fill', 'transparent');
		setAttribute('#UVLamp1', 'fill', 'transparent');
		setAttribute('#UV', 'fill', '#f0f0f0');
	}

	setAttribute('#SousPression', 'fill', Al_Mano_Min > 0.5 ? red : green);
	setAttribute('#SurPression', 'fill', Al_Mano_Max > 0.5 ? red : green);
	
	if(P_Source_1)
		setText('#P_Source', P_Source_1.toFixed(2) + " bar");
	else
		setText('#P_Source', '--- bar');

	/*setText('#Date', timeToDate(time));*/


	

try {
	setText("#varuvp", P_UV_Lamp + " W/m");
	setText("#varuvtime",  h_UV_Lamp + " h");
	setText("#varuvencl1", n1_UV_Lamp);
	setText("#varuvencl2", n2_UV_Lamp);
} catch(e) {
	console.log("Impossible to set UV data");
}
