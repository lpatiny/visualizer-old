
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


window[_namespaces['util']].Util.uniqueid = 0;
window[_namespaces['util']].Util.getNextUniqueId = function() {
	return 'uniqid_' + (++window[_namespaces['util']].Util.uniqueid);
}



CI.Event = function() {}
slice = Array.prototype.slice;

CI.Event.prototype.on = function(topic, callback) {
	this.topics = this.topics || [];
	this.topics[topic] = this.topics[topic] || $.Callbacks();
	this.topics[topic].add.apply(this.topics[id], slice.call(arguments, 1));
	return this;
}

CI.Event.prototype.off = function(topic) {
	if(this.topics && this.topics[topic])
		this.topics[topic].remove.apply(this.topics[topic], slice.apply(arguments, 1))
	return this;
}

CI.Event.prototype.trigger = function(topic) {
	if(this.topics && this.topics[topic])
		this.topics[topic].fireWith(this, slice.call(arguments, i));
}