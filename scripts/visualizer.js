CI.ConfigVisualizer = function() {

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
		
	
		for(var j = 0; def.dataSource && j < def.dataSource.length; j++) {
			var source = def.dataSource[j];
			
			if(typeof allSharedVars[source.name] == "undefined")
				allSharedVars[source.name] = {send: [], receive: []};
			
			allSharedVars[source.name].receive.push({
				rel: source.rel,
				moduleName: def.title
			});
		}
		
		for(var j = 0; def.dataSend && j < def.dataSend.length; j++) {
		
			if(typeof allSharedVars[def.dataSend[j].name] == "undefined")
				allSharedVars[def.dataSend[j].name] = {send: [], receive: []};
				
			allSharedVars[def.dataSend[j].name].send.push({
				rel: def.dataSend[j].rel,
				moduleName: def.title
			});
		}
	}
	
		
	var html = [];
	
	html.push('<h3><span class="triangle-down"></span>Configuration</h3>');
	
	var btnzone = new CI.Buttons.Zone({
		vAlign: 'vertical',
		hAlign: 'center'
	});
	
	var btn = new CI.Buttons.Button('Configure entry point', function() {
		configureEntryPoint();
	});
	btnzone.addButton(btn);
	
	
	var btn = new CI.Buttons.Button('Configure visualizer', function() {
		configureVisualizer();
	});
	btnzone.addButton(btn);
	
	
	var btn = new CI.Buttons.Button('Save', function() {
		Entry.save();
	});
	btn.setColor('blue');
	btnzone.addButton(btn);
	
	
	html.push(btnzone.render());
	
	
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
	
	html.push('<h3><span class="triangle-down"></span>Add a module</h3><div id="ci-addmodule">');
	
	
	for(var i in CI.Module.prototype._types) {
		
		var moduleInfos = CI.Module.prototype._types[i].Controller.prototype.moduleInformations;
		html.push('<div class="module" data-module="');
		html.push(i);
		html.push('">');
		html.push(moduleInfos.moduleName);
		html.push('</div>');
	}
	
	html.push('</div>');
	
	
	$("#ci-left").html(html.join(''));
	
	/*
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
		
		ul.next().after(CI.SaveButton.clone(true).bind('click', function() {
			
			var vars = [];
			ul.children().each(function() {
				vars.push({ varname: $(this).find('._ci-varname').val(), sourcename: $(this).find('._ci-varsource').val(), jpath: $(this).find('._ci-varjpath').val()  });
			});
			
			Entry.setEntryDataVariables(vars);
			Entry.save();
			
		})).next().after('<div class="ci-spacer"></div>');
	})();
	
	*/
	
	
	$("#ci-entrypoint-cfg").bind('click', function() {
		configureEntryPoint();
	});
	
	
	
	$("#ci-left").next().bind('click', function() {
		$("#ci-left").toggle();	
	});
	
	
	$("#ci-addmodule").on('dblclick', 'div', function() {
	
		var moduleId = $(this).data('module');
		
		var module = {
			type: moduleId,
			title: "Untitled module",
			position: {
				left: 1,
				right: 1	
			},
			
			size: {
				width: 30,
				height: 30
			}
		};
		
		Entry.addModuleFromJSON(module, true);
	});
	
	$("#ci-left").on('click', 'h3', function() {
		var h3 = $(this);
		h3.next().toggle();
		h3.children('span').toggleClass('triangle-down triangle-right');
	});
	
	
	
	
	
	function configureEntryPoint() {
		var now = Date.now();
		$.fancybox($("<div />").attr('id', 'formEntryPoint-' + now), { width: 700, height: 500, autoSize: false });
		
		$("#formEntryPoint-" + now).biForm({}, function() {
			
			var inst = this;			
			var section = new BI.Forms.Section('cfg', { multiple: false });
			this.addSection(section);
			var title = new CI.Title();
			title.setLabel('Entry variables');
			section.setTitle(title);
			
			var groupfield = new BI.Forms.GroupFields.Table('tablevars');
			section.addFieldGroup(groupfield);
			
			var field = groupfield.addField({
				type: 'Text',
				name: 'varname'
			});
			field.setTitle(new CI.Title('Variable name'));
			
			var options = [];
			var data = Entry.getDataFromSource();
			for(var i in data)
				options.push({title: i, key: i});	
			var field = groupfield.addField({
				type: 'Combo',
				name: 'sourcename'
			});
			field.setTitle(new CI.Title('Source name'));
			field.implementation.setOptions(options);
			field.onChange(function(index) {
				var fieldIndex = index;
				var value = this.getValue(fieldIndex);
				var data = Entry.getDataFromSource(value);
				var jpath = [];
				CI.DataType.getJPathsFromElement(data, jpath);
				var field = this.group.getField('jpath')
				
				this.group.getField('jpath').implementation.setOptions(jpath, index);
			});
			
			var field = groupfield.addField({
				type: 'Combo',
				name: 'jpath'
			});
			field.setTitle(new CI.Title('JPath'));
			
			
		
			var save = new CI.Buttons.Button('Save', function() {
				var value = inst.getValue();
				var data = value.cfg[0].tablevars[0];
				Entry.setEntryDataVariables(data);
				Entry.save();
			});
			
			
			save.setColor('blue');
			this.addButtonZone().addButton(save);
			
		}, function() {
			
			
			var vars = { varname: [], jpath: [], sourcename: [] };
			var entryVars = Entry.getEntryDataVariables();
			
			for(var i = 0; i < entryVars.length; i++) {
				vars.varname.push(entryVars[i].varname);
				vars.sourcename.push(entryVars[i].sourcename);
				vars.jpath.push(entryVars[i].jpath);
				
			}
				
			var fill = { 
				sections: {
					cfg: [
						{
							groups: {
								tablevars: [vars]
							}
						}
					]
				}
			};
			
			this.fillJson(fill);
			
		
			
		});
	}




	
	
	function configureVisualizer() {
		var now = Date.now();
		$.fancybox($("<div />").attr('id', 'formVisualizer-' + now), { width: 700, height: 500, autoSize: false });
		
		$("#formVisualizer-" + now).biForm({}, function() {
			
			var inst = this;			
			var section = new BI.Forms.Section('cfg', { multiple: false });
			this.addSection(section);
			var title = new CI.Title();
			title.setLabel('General configuration');
			section.setTitle(title);
			
			var groupfield = new BI.Forms.GroupFields.List('general');
			section.addFieldGroup(groupfield);
			
			var field = groupfield.addField({
				type: 'Text',
				name: 'title'
			});
			field.setTitle(new CI.Title('Title'));
			
			
			var field = groupfield.addField({
				type: 'Checkbox',
				name: 'moduleheaders'
			});
			field.setTitle(new CI.Title('Module headers'));
			field.implementation.setOptions({ 'showonhover': 'Only show module headers on mouseover'})
			
			
			var field = groupfield.addField({
				type: 'Checkbox',
				name: 'menubar'
			});
			field.setTitle(new CI.Title('Menu bar'));
			
			field.implementation.setOptions({ 'display': 'Display menu bar on start'})
			
			
			var field = groupfield.addField({
				type: 'Color',
				name: 'modulebg'
			});
			field.setTitle(new CI.Title('Modules background'));
			
			
		
			var save = new CI.Buttons.Button('Save', function() {
				
				inst.dom.trigger('stopEditing');
				var value = inst.getValue();
				var data = value.cfg[0].general[0];
				
				var config = Entry.getConfiguration();
			
				config.showMenuBarOnStart = data.menubar[0][0] == 'display';
				config.showModuleHeaderOnHover = data.moduleheaders[0][0] == 'showonhover';
				config.title = data.title[0];
				config.moduleBackground = data.modulebg[0];
				
				Entry.setConfiguration(config);
				Entry.save();
			});
			
			save.setColor('blue');
			this.addButtonZone().addButton(save);
			
		}, function() {
			
			var config = Entry.getConfiguration();
			
			var title = config.title || 'Visualizer title';
			var menubar = config.showMenuBarOnStart ? ['display'] : [false];
			var moduleheader = config.showModuleHeaderOnHover ? ['showonhover'] : [false];
			var modulebg = config.moduleBackground || '#ffffff';
			
			
			var vars = { title: [title], menubar: [menubar], modulebg: [modulebg], moduleheaders: [moduleheader] };
				
			var fill = { 
				sections: {
					cfg: [
						{
							groups: {
								general: [vars]
							}
						}
					]
				}
			};
			console.log(fill);
			this.fillJson(fill);
		});
	}

}


