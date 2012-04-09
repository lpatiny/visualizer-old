// Javascript


$(document).bind('onChangeReceiveCfg', function(event, module) {

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
	cfgLine.push('<li><label>Rel: </label><select class="_eventrel">');
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
	
	wrapper.append(html);
	wrapper.append($('<div class="ci-duplicate">+ Add a line</div>').bind('click', function() {
		html.append(cfg.clone(true));
	}));
	
	$("#ci-cfg-receive").html(wrapper);
});
