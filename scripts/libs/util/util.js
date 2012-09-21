
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
	this.topics[topic].add.apply(this.topics[topic], slice.call(arguments, 1));
	return this;
}

CI.Event.prototype.off = function(topic) {
	if(this.topics && this.topics[topic])
		this.topics[topic].remove.apply(this.topics[topic], slice.call(arguments, 1))
	return this;
}

CI.Event.prototype.trigger = function(topic) {
	if(this.topics && this.topics[topic])
		this.topics[topic].fireWith(this, slice.call(arguments, 1));
}

CI.Observable = function(name, value) { this.set(name, value); };
$.extend(CI.Observable.prototype, CI.Event.prototype);

CI.Observable.get = function(name) {
	return this._value[name];
}

var slicer = Array.prototype.slice;
CI.Observable.update = function(name, value) {
	this._value = this._value || {};
	this._value[name] = args;
	return this;
}

CI.Observable.set = function(name, value) {
	var current = this.get(name);
	if(current == value)
		return;
	this.update(name, value);
	var to = this.get(name);
	this.trigger('change', name, to, from);
	return this;
}

CI.Observable.prototype._proxiedSet = function() {
	if(!this.__proxiedSet)
		this.__proxiedSet = $.proxy(this.set, this);

	return this.__proxiedSet;
}

// List of observables targets
// When any of the target change, change myself
// Example:
//
//	var obs1 = new Observable();
//	var obs2 = new Observable();
//	obs1.pull(obs2);
//	obs2.set('varName', 'varVal'); // ==> obs1.set('varName', 'varVal')
CI.Observable.prototype.pull = function() {
	var mySet = this._proxiedSet();
	$.each(arguments, function(i, trgt) {
		target.on('change', set);
	});
}

CI.Observable.prototype.unpull = function() {
	var mySet = this._proxiedSet();
	$.each(arguments, function(i, trgt) {
		target.off('change', set);
	});
}

CI.Observable.prototype.push = function() {
	var self = this;
	$.each(arguments, function(i, trgt) {
		self.on('change', target._proxiedSet);
	});
}

CI.Observable.prototype.unpush = function() {
	var self = this;
	$.each(arguments, function(i, trgt) {
		self.off('change', target._proxiedSet);
	});
}

CI.RepoPool = function() {};
$.extend(CI.RepoPool.prototype, CI.Event.prototype);


CI.RepoPool.prototype.get = function(mode, key) {
	return this._value[mode][key];
}

CI.RepoPool.prototype.getValue = function(key) {
	return this.get('value', key);
}

CI.RepoPool.prototype.set = function(mode, keys, value) {
	if(!(keys instanceof Array))
		keys = [keys];

	this._value = this._value || [];
	this._value[mode] = this._value[mode] || [];

	for(var i = 0, l = keys.length; i < l; i++)
		this._value[mode][keys[i]] = value;

	this.trigger(mode, keys, value);
}

CI.RepoPool.prototype.setHighlight = function(keys, value) {
	return this.set('highlight', keys, value);
}

CI.RepoPool.prototype.setValue = function(keys, value) {
	return this.set('value', keys, value);
}

CI.RepoPool.prototype.listen = function(mode, keys, callback) {
	var self = this;
	if(!keys instanceof Array)
		keys = [keys];
	this.on(mode, function(sourcekeys, value) {
		
		// Check keys
		var commonKeys;
		if((commonKeys = self.getCommonKeys(keys, sourcekeys)).length > 0) {
			callback.call(mode, value, commonKeys);
		}
	});
}

CI.RepoPool.prototype.unListen = function(mode, callback) {
	this.off(mode, callback);
}

CI.RepoPool.prototype.listenHighlight = function(keys, callback) {
	return this.listen('highlight', keys, callback)
}

CI.RepoPool.prototype.listenValue = function(keys, callback) {
	return this.listen('value', keys, callback)
}


CI.RepoPool.prototype.unListenValue = function(callback) {
	return this.unListen('value', callback)
}



// Set 1 is a 1D array
// Set 2 can be recursive
CI.RepoPool.prototype.getCommonKeys = function(set1, set2) {
	var set3 = set2.slice(0);
	var set1Rev = {};
	for(var i = 0, l = set1.length; i < l; i++)
		set1Rev[set1[i]] = true;
	return this.compareKeysRecursively(set1Rev, set3, true);
}

CI.RepoPool.prototype.compareKeysRecursively = function(set1, set2, or) {
	var i = 0, j = 0, l, set2el;
	for(i = 0, l = set2.length; i < l; i++) {
		set2el = set2[i];
		if(set2el instanceof Array)
			set2el = this.compareKeysRecursively(set1, set2el, !or);
		if(!set1[set2el])
			if(or)
				set2.splice(i, 1);
			else
				return null;
	}
	return set2;
}

CI.Repo = new CI.RepoPool();

/*
// Set a number of keys for highlighing
CI.RepoPool.multipleSet('highlight', ['key2', 'key3'], 'value');

// Set a var for value transfer
CI.RepoPool.multipleSet('value', 'varName', 'value');

CI.RepoPool.listen('highlight', ['key1', 'key2'], function(actionName, value, commonKeys) {
	// Do something here
});

// Listen for "varName" only
CI.RepoPool.listenValue('varName', function(value, commonKeys) {

});

// Listen for "key1" OR ("key2" AND "key3") to appear
CI.RepoPool.listenHighlight(['key1', ['key2', 'key3']], function(commonKeys) {
	// Determine what to highlight as a function of the different keys
});*/