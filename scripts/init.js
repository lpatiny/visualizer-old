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
		
		var Entry = new CI.EntryPoint('testcase/structure3.json', './data/json/chemcalc/data.json', {}, function() {
			$(dom).unmask();
			
			
			var allSharedVars = [];
			for(var i in CI.modules) {
				var def = CI.modules[i].definition;
				
				for(var j = 0; j < def.dataSource.length; j++) {
					var source = def.dataSource[j];
					
					if(typeof allSharedVars[source.name] == "undefined")
						allSharedVars[source.name] = {send: [], receive: []};
					
					allSharedVars[source.name].receive.push({
						rel: source.rel,
						moduleName: def.title
					});
				}
				
				
				for(var k in def.dataSend) {
					var source = def.dataSend[k];
					for(var j = 0; j < source.length; j++) {
					
						if(typeof allSharedVars[source[j].name] == "undefined")
							allSharedVars[source[j].name] = {send: [], receive: []};
							
						allSharedVars[source[j].name].send.push({
							rel: source[j].rel,
							moduleName: def.title
						});
					}
				}
			}
			
			
			var html = [];
			for(var i in allSharedVars) {
				html.push('<li>');
					html.push('<div class="ci-varname">');
					html.push(i);
					html.push('</div>');
				
					html.push('<div class="ci-varsent">');
					html.push('Sent by modules<ul>');
					for(var j = 0; j < allSharedVars[i].send.length; j++) {
						html.push('<li>');
						html.push(allSharedVars[i].send[j].moduleName);
						html.push('</li>');
					}
					
					
					if(allSharedVars[i].send.length == 0)
						html.push('<li>No module sends this variable</li>');
						
					html.push('</ul></div>');
				
				
					html.push('<div class="ci-varreceived">');
					html.push('Received by modules<ul>');
					for(var j = 0; j < allSharedVars[i].receive.length; j++) {
						html.push('<li>');
						html.push(allSharedVars[i].receive[j].moduleName);
						html.push('</li>');
					}
					
					if(allSharedVars[i].receive.length == 0)
						html.push('<li>No module receives this variable</li>');
						
					html.push('</ul></div>');
				
				html.push('</li>');
				
				$("#ci-cfg-shared").html(html.join(''));
				$("#ci-left-accordion").accordion('resize');
			}
					
		});
		
		$("#ci-right-accordion").accordion();
		$("#ci-left-accordion").accordion();	
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
