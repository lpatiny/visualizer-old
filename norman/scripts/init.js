/* We must first of all initialize the namespace */
CI = new Object();


(function($) {
	
	$(document).ready(function() {
		
		$.getJSON('testcase/modules.json', {}, function(pagedef) {
		
			// Initiates the grid
			CI.Grid.init(pagedef.grid);
				
				
			for(var i = 0; i < pagedef.modules.length; i++) {
				var Module = new CI.Module(pagedef.modules[i]); 
				CI.modules[pagedef.modules[i].id] = Module;
				CI.Grid.addModule(Module);
			}
		});
	});
	
}) (jQuery);



/*
var json = {};

json.rows = 100;
json.cols = 100;

json.dataMatrix = [];
json.data = [];

for(var i = 0; i < 100; i++) {
	json.dataMatrix[i] = [];
	for(var j = 0; j < 100; j++) {
		json.dataMatrix[i][j] = Math.random();
	}
}


for(var i = 0; i < 100; i++) {
	json.data[i] = [];
	for(var j = 0; j < 100; j++) {
		json.data[i][j] = { url_ir: 'http://google.com/' + j + " " + i };
	}
}*/


	
//console.log(JSON.stringify(json));
