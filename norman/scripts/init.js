/**
 * @namespace Holds all the functionality for the visualizer
 */
CI = new Object();


(function($) {
	
	$(document).ready(function() {
		
		$.getJSON('testcase/modules.json', {}, function(pagedef) {
			// Initiates the grid
			
			var Entry = new CI.EntryPoint(pagedef.entryPoint, function() {
				
				// Do something after loading the data
				
				
			});
			
			
			CI.Grid.init(pagedef.grid);
			for(var i = 0; i < pagedef.modules.length; i++) {
				var Module = new CI.Module(pagedef.modules[i]); 
				CI.modules[pagedef.modules[i].id] = Module;
				CI.Grid.addModule(Module);
			}
		});
	});
	
}) (jQuery);


