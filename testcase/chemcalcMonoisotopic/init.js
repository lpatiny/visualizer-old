/**
 * @namespace Holds all the functionality for the visualizer
 */

CI = new Object();

(function($) {
	
	$(document).ready(function() {
		
		ajaxManager = new UTIL.AjaxManager();
		//ajaxManager.setProxyUrl('http://localhost:8888/git/visualizer/proxify.php?url=<url>');
		
		var dom = $("body");
		$(dom).mask('Data is loading. Please wait...');
		
		var Entry = new CI.EntryPoint('./layout.json', './data.json', {}, function() {
			$(dom).unmask();	
			// Do something after loading the data
				
		});
	});
	
}) (jQuery);
