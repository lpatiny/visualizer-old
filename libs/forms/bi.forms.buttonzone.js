
if(!window[window._namespaces['buttons']].Buttons)
	window[window._namespaces['buttons']].Buttons = {};


window[window._namespaces['buttons']].Buttons.Zone = function() {
	this.buttons = {};	
}

window[window._namespaces['buttons']].Buttons.Zone.prototype = {
	
	addButton: function(button) {
		console.log(button.getId());
		this.buttons[button.getId()] = button;
	},
	
	render: function() {
		var html = '<div class="bi-buttonzone';
		
		if(this.align) { 
			html += ' bi-align-';
			html += this.align;
		}
		
		html += '">';
		for(var i in this.buttons) {
			html += this.buttons[i].render();
		}
		
		html += '</div>';
		return html;
	},
	
	getButton: function(id) {
		return this.buttons[id];
	},
	
	setAlignment: function(align) {
		this.align = align;
	}
}

