
CI.Grid = {
	
	init: function(definition) {
		CI.Grid.definition = $.extend(true, CI.Grid.defaults, definition);
		
		CI.Grid._el = $("#ci-modules-grid");
	},
	
	defaults: {
		xWidth: 20,
		xHeight: 20
	},
	
	addModule: function(module) {
		
		var modulePos = module.getPosition();
		var moduleSize = module.getSize();
		
		module.getDomWrapper().appendTo(CI.Grid._el).css({
			top: modulePos.top * CI.Grid.definition.yHeight,
			left: modulePos.left * CI.Grid.definition.xWidth,
			
			width: moduleSize.width * CI.Grid.definition.xWidth,
			height: moduleSize.height * CI.Grid.definition.yHeight
		});
		
		
		// Insert jQuery UI resizable and draggable
		module.getDomWrapper().resizable({
			grid: [CI.Grid.definition.xWidth, CI.Grid.definition.yHeight],
			resize: function() {
				CI.Grid.moduleResize(module);
			}
			
		}).draggable({
			grid: [CI.Grid.definition.xWidth, CI.Grid.definition.yHeight],
			containment: "parent"
		}).trigger('resize');
		
		CI.Grid.moduleResize(module);
		
	},
	
	moduleResize: function(module) {
		
		var wrapper = module.getDomWrapper();
		module.getPosition().width = wrapper.width() / CI.Grid.definition.xWidth;
		module.getPosition().height = wrapper.height() / CI.Grid.definition.yHeight;
		
		module.getDomContent().css({
			height: wrapper.height() - module.getDomHeader().outerHeight(true)
		});
		
		module.view.onResize();
	}
}
