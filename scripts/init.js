/**
 * @namespace Holds all the functionality for the visualizer
 */

_namespaces = {
	title: 'CI',
	table: 'CI',
	lang: 'CI',
	util: 'CI',
	visualizer: 'CI'
};

CI = new Object();

(function($) {
	
	$(document).ready(function() {
		
		ajaxManager = new CI.Util.AjaxManager();
		ajaxManager.setProxyUrl('http://localhost:8888/git/visualizer/proxify.php?url=<url>');
		
		var dom = $("body");
		$(dom).mask('Data is loading. Please wait...');
		
		window.Entry = new CI.EntryPoint(_structure, _data, {}, function() {
			$(dom).unmask();
			
			CI.Visualizer.left.init();
			CI.Visualizer.right.init();
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
