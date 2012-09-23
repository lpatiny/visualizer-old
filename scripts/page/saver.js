
CI.Saver = function() {
	this.busy = false;
	this.setTimeout();
}

CI.Saver.prototype = {

	doSave: function() {
		var self = this;
		if(this.busy) {
			this.redoAfterSave = true;
			return;
		}
		this.busy = true;
		$("#visualizer-saver").html('Visualization saving...');
		var script = JSON.stringify(Entry.structure);
		$.post(_saveViewUrl, {content: script}, function() {
			var dateNow = new Date();
			self.busy = false;

			$("#visualizer-saver").html('Visualization saved (' + self.num(dateNow.getHours()) + ":" + self.num(dateNow.getMinutes()) + ":" + self.num(dateNow.getSeconds()) + ")");
			if(self.redoAfterSave) {
				self.redoAfterSave = false;
				self.doSave();
			}
			self.redoAfterSave = false;

			self.setTimeout();
		});
	},

	setTimeout: function() {
		this.timeout = window.setTimeout($.proxy(this.doSave, this), 10000);
	},

	num: function(val) {
		return (val + "").length == 1 ? '0' + val : val;
	}
}
