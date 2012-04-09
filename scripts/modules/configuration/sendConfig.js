// Javascript


$(document).bind('onChangeSendCfg', function(event, module) {

	var availCfg = module.controller.getConfigurationSend();
	var currentCfg = module.definition.dataSend;
	
	
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
	cfgLine.push('<li class="CfgSendEl"><ul>');
	cfgLine.push('<li><label>Event: </label><select class="_eventname">');
	cfgLine.push(allEvents.join(''));
	cfgLine.push('</select></li>');
	cfgLine.push('<li><label>Rel: </label><select class="_eventrel">');
	cfgLine.push(allRels.join(''));
	cfgLine.push('</select></li>');
	cfgLine.push('<li><label>Fields to send: </label><select class="_eventkeys">');
	cfgLine.push('</select></li>');
	cfgLine.push('<li><label>Store in: </label><input type="text" class="_eventvarname" /></li>')
	cfgLine.push('</ul></li>')
	
	var cfg = $(cfgLine.join(''));
	cfg.find('select._eventrel').bind('change', function(event) {
		var rel = $(this).val();
		var keys;
		var cfg = $(this).parents('.CfgSendEl');
		var options = CI.Types._jPathToOptions(module.model.getjPath(rel));
		console.log(options);
		line.find('select._eventkeys').html(options);
		
	});
	
	function fillLine(currentCfg, line, eventName) {
		line.find('select._eventname').val(eventName);
		line.find('select._eventrel').val(currentCfg.rel);
		line.find('select._eventrel').trigger('change');
		line.find('input._eventvarname').val(currentCfg.name);
		line.find('select._eventkeys').val(currentCfg.keys);
	}
	
	var wrapper = $("<div />");
	var html = $("<ul />");
	
	for(var i in currentCfg) {
		
		if(!currentCfg[i] instanceof Array)
			currentCfg[i] = [currentCfg[i]];
		
		for(var j = 0; j < currentCfg[i].length; j++) {
			var line = cfg.clone(true);
			fillLine(currentCfg[i][j], line, i);
			html.append(line);
		}
	}
	
	var line = cfg.clone(true);
	html.append(line);
	
	
	wrapper.append($('<div class="ci-duplicate">+ Add a line</div>').bind('click', function() {
		html.append(cfg.clone(true));
		$("#ci-right-accordion").accordion('resize');
	}));
	
	wrapper.prepend(html);
	
	$("#ci-cfg-send").html(wrapper);
});
