/**
 * @namespace Holds all the functionality for the visualizer
 */
CI = new Object();


(function($) {
	
	$(document).ready(function() {
		
		var dom = $("body");
		$(dom).mask('Data is loading. Please wait...');
		
				
		var Entry = new CI.EntryPoint('testcase/structure.json', 'testcase/data.json', {}, function() {
			$(dom).unmask();	
			// Do something after loading the data
				
		});
	});
	
}) (jQuery);


