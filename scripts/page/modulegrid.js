/**
 * @namespace
 * Represents a grid to which modules can be added, removed, moved and resized.
 */
CI.Grid = {

	/**
	 * Initialise the module grid in the div with id="ci-modules-grid"
	 * @param {object} definition An object containing options for the grid (is merged into {@link CI.Grid.defaults})
	 * @param {integer} [definition.xWidth] The width of the grid cells
	 * @param {integer} [definition.xHeight] The height of the grid cells
	 */
	init: function(definition) {
		CI.Grid.definition = $.extend(true, CI.Grid.defaults, definition);
		
		CI.Grid._el = $("#ci-modules-grid");
	},
	
	/**
	 * Used to define the grid-cell sizes. On initialisation, the object passed is merged with this object 
	 * @type object
	 * @hide
	 */
	defaults: {
		xWidth: 20,
		xHeight: 20
	},
	
	/**
	 * Add a module to the grid 
	 * @param module {Module} The module to add.
	 */
	addModule: function(module) {
		
		var modulePos = module.getPosition();
		var moduleSize = module.getSize();
		
		module.getDomWrapper().appendTo(CI.Grid._el).css({
			top: modulePos.top * CI.Grid.definition.yHeight,
			left: modulePos.left * CI.Grid.definition.xWidth,
			width: moduleSize.width * CI.Grid.definition.xWidth,
			height: moduleSize.height * CI.Grid.definition.yHeight
		});
		
		module.inDom();
		
		// Insert jQuery UI resizable and draggable
		module.getDomWrapper().resizable({
			grid: [CI.Grid.definition.xWidth, CI.Grid.definition.yHeight],
			resize: function() {
				CI.Grid.moduleResize(module);
			},
			
			containment: "parent"
			
		}).draggable({
			grid: [CI.Grid.definition.xWidth, CI.Grid.definition.yHeight],
			containment: "parent",
			handle: '.ci-module-header',
			start: function() {
				var myZIndex  = $(this).css("zIndex");
				var count = 0;
				for (var i in CI.modules) {
					if (CI.modules[i].dom.css("zIndex")>myZIndex) {
						CI.modules[i].dom.css("zIndex","-=1")
					}
					count++;
				}
				$(this).css("zIndex",count);
			}
		}).trigger('resize');
		
		module.getDomWrapper().on('click', '.ci-module-expand', function() {
			module.getDomWrapper().height((module.getDomContent().outerHeight() + module.getDomHeader().outerHeight()));
			CI.Grid.moduleResize(module);
		});
		
		CI.Grid.moduleResize(module);
	},
	/**
	 * Is called by jQuery UI when a module is resized, to resize the module and allow the module view's contents to update accordingly.
	 * @param module The module to resize.
	 */
	moduleResize: function(module) {
		
		var wrapper = module.getDomWrapper();
		module.getPosition().width = wrapper.width() / CI.Grid.definition.xWidth;
		module.getPosition().height = wrapper.height() / CI.Grid.definition.yHeight;
		
		module.getDomContent().parent().css({
			height: wrapper.height() - module.getDomHeader().outerHeight(true)
		});
		
		module.view.onResize();
		
		CI.Grid.checkModuleSize(module);
		
		
	},
	
	checkModuleSize: function(module) {
		
		if(module.getDomContent().height() > module.getDomContent().parent().outerHeight(true))
			module.getDomContent().parent().after(module.viewExpander);
		else
			module.viewExpander.remove();
	}
}
