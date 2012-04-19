
if(!window[_namespaces['util']].Util) window[_namespaces['util']].Util = {};

window[_namespaces['util']].Util.JsonLoader = function(url, element) {

	if(element.source == null && element.url) {
		element.loaded = false;
		var query = new CI.Util.AjaxQuery({
			url: url,
			dataType: 'json',
			success: function(data) {
				element.source = data;
				element.loaded = true;
				element.doCallbacks();
			}
		});
	}
}