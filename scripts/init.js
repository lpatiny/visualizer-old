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
		
		CI.WebWorker.create('jsonparser', './scripts/webworker/scripts/jsonparser.js');
		ajaxManager = new CI.Util.AjaxManager();
	//	ajaxManager.setProxyUrl('http://localhost:8888/git/visualizer/proxify.php?url=<url>');
		
		var dom = $("body");
		$(dom).mask('Data is loading. Please wait...');
		
		window.Entry = new CI.EntryPoint(_structure, _data, {}, function() {
			$(dom).unmask();
			
			CI.Visualizer.left.init();
			CI.Visualizer.right.init();
		});
	});
}) (jQuery);


CI.AddButton = $('<div class="ci-cfg-add">+ Add</div>').bind('click', function() {
	$(this).prev().children(':last').clone(true).appendTo($(this).prev());
});


CI.SaveButton = $('<div class="ci-cfg-save">Save</div>');
