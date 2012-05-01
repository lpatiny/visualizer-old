// Javascript


$(document).bind('configModule', function(event, module) {
	$("#ci-right").html('');
	
	try {
		buildGeneralConfig(module);	
	} catch(e) {
		console.log(e);
		//CI.ErrorHandler.handle(e)
	}
	
	
	
	try {
		buildSendConfig(module);	
	} catch(e) {
		console.log(e);
		//CI.ErrorHandler.handle(e)
	}
	
	
	
	try {
		buildReceiveConfig(module);	
	} catch(e) {
		console.log(e);
		//CI.ErrorHandler.handle(e)
	}
	
	
	
});


function buildGeneralConfig(module) {
	
	var html = [];
	html.push('<div><ul>');
	
	html.push('<li><label>Module name</label><input type="text" name="modulename" value="');
	html.push(module.getTitle());
	html.push('"></li>');
	html.push('</ul></div>');
	
	var html = $(html.join(''));
	
	html.append(CI.SaveButton.clone(true).bind('click', function() {
		module.setTitle($("input[name=modulename]").val());
		Entry.save();
	}).after('<div class="ci-spacer"></div>'));
	
	
	$("#ci-right").append('<h3><span class="triangle-down"></span>General Configuration</h3>').append(html);
}

function buildSendConfig(module) {
	
	var availCfg = module.controller.getConfigurationSend();
	var currentCfg = module.definition.dataSend;
	
	var jpaths = [];
	for(var i in availCfg.rels) {
		jpaths[i] = CI.Types._jPathToOptions(module.model.getjPath(i));
	}
	
	var allEvents = [];
	allEvents.push('<option></option>');
	for(var i in availCfg.events) {
		allEvents.push('<option value="');
		allEvents.push(i);
		allEvents.push('">');
		allEvents.push(availCfg.events[i].label);
		allEvents.push('</option>');
	}
	
	var allRels = [];
	allRels.push('<option></option>');
	for(var i in availCfg.rels) {
		allRels.push('<option value="');
		allRels.push(i);
		allRels.push('">');
		allRels.push(availCfg.rels[i].label);
		allRels.push('</option>');
	}
	
	var cfgLine = [];
	cfgLine.push('<li class="CfgSendEl"><ul><li><label>Event: </label><select class="_eventname">');
	cfgLine.push(allEvents.join(''));
	cfgLine.push('</select></li><li><label>Element: </label><select class="_eventrel">');
	cfgLine.push(allRels.join(''));
	cfgLine.push('</select></li><li><label>Fields to send: </label><select class="_eventkeys"></select></li><li><label>Store in: </label><input type="text" class="_eventvarname" /></li></ul></li>');
	
	var cfg = $(cfgLine.join(''));
	cfg.find('select._eventrel').bind('change', function(event) {
		var rel = $(this).val();
		var keys;
		var cfg = $(this).parents('.CfgSendEl');
		var options = jpaths[rel];
		cfg.find('select._eventkeys').html(options);
	});
	
	function fillLine(currentCfg, line) {
		line.find('select._eventname').val(currentCfg.event);
		line.find('select._eventrel').val(currentCfg.rel);
		line.find('select._eventrel').trigger('change');
		line.find('input._eventvarname').val(currentCfg.name);
		line.find('select._eventkeys').val(currentCfg.jpath);
	}
	
	var wrapper = $("<div />").addClass('ci-send');
	var html = $("<ul />");
	
	
	for(var i = 0; currentCfg && i < currentCfg.length; i++) {
		var line = cfg.clone(true);
		fillLine(currentCfg[i], line);
		html.append(line);
	}

	if(!currentCfg || currentCfg.length == 0) {
		var line = cfg.clone(true);
		html.append(line);
	}
	
	
	wrapper.append(html);
	html.after(CI.AddButton.clone(true)).next().after(CI.SaveButton.clone(true).bind('click', function() {
		var vars = [];
		$(".ci-send").children('ul').children('li').each(function() {
			vars.push({ event: $(this).find('._eventname').val(), name: $(this).find('._eventvarname').val(), rel: $(this).find('._eventrel').val(), jpath: $(this).find('._eventkeys').val() });
		});
		
		module.setSendVars(vars);
		Entry.save();
		
	})).next().after('<div class="ci-spacer"></div>');
	
	$("#ci-right").append('<h3><span class="triangle-down"></span>Sending</h3>').append(wrapper);
}


function buildReceiveConfig(module) {
	
	
	
	var availCfg = module.controller.getConfigurationReceive();
	var currentCfg = module.definition.dataSource;
	
	var allRels = [];
	allRels.push('<option></option>');
	for(var i in availCfg) {
		allRels.push('<option value="');
		allRels.push(i);
		allRels.push('">');
		allRels.push(availCfg[i].label);
		allRels.push('</option>');
	}
	
	var cfgLine = [];
	cfgLine.push('<li class="CfgReceiveEl"><ul>');
	cfgLine.push('<li><label>Element: </label><select class="_eventrel">');
	cfgLine.push(allRels.join(''));
	cfgLine.push('</select>');
	cfgLine.push('<li><label>Stored in: </label><input type="text" class="_eventvarname" />')
	cfgLine.push('</ul></li>')
	
	var cfg = $(cfgLine.join(''));
	cfg.find('select._eventrel').bind('change', function(event) {
	//	var rel = $(this).val();
	//	var types = availCfg.rel.accepts;
	//	var options = CI.Types._jPathToOptions(module.model.getjPath(rel, types));
	
	});
	
	function fillLine(currentCfg) {
		//line.find('select._eventname').val(eventName);
		line.find('select._eventrel').val(currentCfg.rel);
		//line.find('select._eventrel').trigger('change');
		line.find('input._eventvarname').val(currentCfg.name);
		//line.find('select._eventkeys').val(currentCfg.keys);
	}
	
	var wrapper = $("<div />").addClass('ci-receive');
	var html = $("<ul />");
	
	if(currentCfg)
		for(var i = 0; i < currentCfg.length; i++) {
			
			/*if(!currentCfg[i] instanceof Array)
				currentCfg[i] = [currentCfg[i]];
			*/
			//for(var j = 0; j < currentCfg[i].length; j++) {
				var line = cfg.clone(true);
				fillLine(currentCfg[i], line, i);
				html.append(line);
			//}
		}
		
	if(!currentCfg || currentCfg.length == 0) {
		var line = cfg.clone(true);
		html.append(line);
	}
	wrapper.append(html);
	html.after(CI.AddButton.clone(true)).next().after(CI.SaveButton.clone(true).bind('click', function() {
		
		var vars = [];
		$(".ci-receive").children('ul').children('li').each(function() {
			vars.push({ name: $(this).find('._eventvarname').val(), rel: $(this).find('._eventrel').val() });
		});
		
		module.setSourceVars(vars);
		Entry.save();
		
	})).next().after('<div class="ci-spacer"></div>');
	
	$("#ci-right").append('<h3><span class="triangle-down"></span>Receiving</h3>').append(wrapper);
}
