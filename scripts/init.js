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
/*

var webworker = new Worker('domatrix.js');

webworker.postMessage('go');

var timeStart = Date.now();
webworker.addEventListener('message', function(event) {
	
	if(!!event.data.progress)
		console.log('Progress: ' + event.data.iterations + ' time: ' + (Date.now() - timeStart));
	
	if(!!event.data.finished)
		console.log('Progress: ' + event.data.iterations + ' time: ' + (Date.now() - timeStart));
	
})*/
