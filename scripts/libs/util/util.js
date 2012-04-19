
if(!window[_namespaces['util']].Util) window[_namespaces['util']].Util = {};

window[_namespaces['util']].Util.getCurrentLang = function() {
	return 'fr';
}

window[_namespaces['util']].Util.getValue = function(obj) {
	if(obj.value)
		return obj.value;
	return obj;
}