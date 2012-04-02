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
	cfgLine.push('<li class="CfgSendEl">');
	cfgLine.push('Event: <select class="_eventname">');
	cfgLine.push(allEvents.join(''));
	cfgLine.push('</select>');
	cfgLine.push('Rel: <select class="_eventrel">');
	cfgLine.push(allRels.join(''));
	cfgLine.push('</select>');
	cfgLine.push('Fields to send: <select class="_eventkeys">');
	cfgLine.push('</select>');
	cfgLine.push('Store in: <input type="text" class="_eventvarname" />')
	cfgLine.push('</li class="CfgSendEl">')
	
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
		line.find('input._eventvarname').val(currentCfg.varname);
		line.find('select._eventkeys').val(currentCfg.keys);
	}
	
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
	$("#ci-cfg-send").html(html);
});
