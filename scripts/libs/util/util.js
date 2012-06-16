
if(!window[_namespaces['util']].Util) window[_namespaces['util']].Util = {};

window[_namespaces['util']].Util.getCurrentLang = function() {
	return 'fr';
}

window[_namespaces['util']].Util.maskIframes = function() {
	
	$("iframe").each(function() {
		var iframe = $(this);
		var pos = iframe.position();
		var width = iframe.width();
		var height = iframe.height();
		
		iframe.before($('<div />').css({
			position: 'absolute',
			width: width,
			height: height,
			top: pos.top,
			left: pos.left,
			background: 'white',
			opacity: 0.5
		}).addClass('iframemask'));
	});
}


window[_namespaces['util']].Util.unmaskIframes = function() {
	$(".iframemask").remove();
}