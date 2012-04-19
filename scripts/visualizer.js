
CI.Visualizer = {};

CI.Visualizer.left = {};

CI.Visualizer.left.init = function() {
		
	var allSharedVars = [];
	
	
	var vars = Entry.getEntryDataVariables();
	
	for(var i = 0; i < vars.length; i++) {
		
		if(typeof allSharedVars[vars[i].varname] == "undefined")
			allSharedVars[vars[i].varname] = {send: [], receive: []};
			
		allSharedVars[vars[i].varname].send.push({
			moduleName: '<em>entry point</em>'
		});
	}

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
	
		
		
		for(var j = 0; j < def.dataSend.length; j++) {
		
			if(typeof allSharedVars[def.dataSend[j].name] == "undefined")
				allSharedVars[def.dataSend[j].name] = {send: [], receive: []};
				
			allSharedVars[def.dataSend[j].name].send.push({
				rel: def.dataSend[j].rel,
				moduleName: def.title
			});
		}
	}
	
		
	var html = [];
	
	html.push('<h3><span class="triangle-down"></span>Entry point</h3><div id="ci-entrypoint-cfg">');
	
	html.push('</div><h3><span class="triangle-down"></span>Shared variables</h3><div>');
	for(var i in allSharedVars) {
		html.push('<li>');
			html.push('<div class="ci-varname">');
			html.push(i);
			html.push('</div>');
		
			html.push('<div class="ci-varsent">');
			html.push('Modules that send this variable<ul>');
			for(var j = 0; j < allSharedVars[i].send.length; j++) {
				html.push('<li>');
				html.push(allSharedVars[i].send[j].moduleName);
				html.push('</li>');
			}
			
			
			if(allSharedVars[i].send.length == 0)
				html.push('<li>No module sends this variable</li>');
				
			html.push('</ul></div>');
		
		
			html.push('<div class="ci-varreceived">');
			html.push('Modules that receive this variable<ul>');
			for(var j = 0; j < allSharedVars[i].receive.length; j++) {
				html.push('<li>');
				html.push(allSharedVars[i].receive[j].moduleName);
				html.push('</li>');
			}
			
			if(allSharedVars[i].receive.length == 0)
				html.push('<li>No module receives this variable</li>');
				
			html.push('</ul></div>');
		
		html.push('</li>');
		
		
	}
	html.push('</div>');
	$("#ci-left").html(html.join(''));
	
	
	(function() {
	
		var vars = Entry.getEntryDataVariables();
		var model = $('<li><ul><li><label>Variable name</label><input type="text" class="_ci-varname" /></li><li><label>Source</label><select class="_ci-varsource"></select></li><li><label>jPath</label><select class="_ci-varjpath"></select></li></ul></li>')
				.find('select._ci-varsource').change(function() {
					
					var data = Entry.getDataFromSource($(this).val());
					var jpath = {};
					CI.Types._getjPath(data, jpath)
					$(this).parent().parent().find('._ci-varjpath').html(CI.Types._jPathToOptions(jpath));
					
				}).each(function() {
					var html = [];
					var data = Entry.getDataFromSource();
					
					html.push('<option disabled="disabled" selected="selected">Select a variable</option>');
					
					for(var i in data) {
						html.push('<option value="');
						html.push(i);
						html.push('">');
						html.push(i);
						html.push('</option>');
					}
					
					$(this).html(html.join(''));
					
				}).end();
		
		
		var ul = $("<ul />").addClass('ci-cfg-entrypoint');
		
		var vars = Entry.getEntryDataVariables();
		for(var i in vars) {
			model.clone(true).find('._ci-varname').val(vars[i].varname).end().find('._ci-varsource').val(vars[i].sourcename).trigger('change').end().appendTo(ul);
		}
		
		
		$("#ci-entrypoint-cfg").html(ul);
		
		ul.after(CI.AddButton.clone(true));
		
		ul.next().after($('<div class="ci-cfg-save">Save</div>').bind('click', function() {
			
			var vars = [];
			ul.children().each(function() {
				vars.push({ varname: $(this).find('._ci-varname').val(), sourcename: $(this).find('._ci-varsource').val(), jpath: $(this).find('._ci-varjpath').val()  });
			});
			
			Entry.setEntryDataVariables(vars);
		})).next().after('<div class="ci-spacer"></div>');
	})();
	
	$("#ci-left").next().bind('click', function() {
		$("#ci-left").toggle();	
	});
	
	$("#ci-left").on('click', 'h3', function() {
		var h3 = $(this);
		h3.next().toggle();
		h3.children('span').toggleClass('triangle-down triangle-right');
	});
}


CI.Visualizer.right = {};
CI.Visualizer.right.init = function() {
	
	$("#ci-right").prev().bind('click', function() {
		$("#ci-right").toggle();	
	});	
	
	$("#ci-right").on('click', 'h3', function() {
		var h3 = $(this);
		h3.next().toggle();
		h3.children('span').toggleClass('triangle-down triangle-right');
	});
}	

