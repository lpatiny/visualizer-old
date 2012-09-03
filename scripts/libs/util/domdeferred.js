CI.Util.ResolveDOMDeferred = function() {
	CI.Util.DOMDeferred.resolve();
	CI.Util.DOMDeferred = $.Deferred();
}

CI.Util.DOMDeferred = $.Deferred();