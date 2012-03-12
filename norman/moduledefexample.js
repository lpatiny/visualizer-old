
var dataModule = {

    id: '12345',	
    type: 'canvas_matrix',

    // Position of the module
    position: {
    	x: 10,
    	y: 10
    },
    
    // Size of the module
    size: {
    	width: 40,
    	hight: 40
    },

    // Whatever you want that is specific to the module
    dataModule: {
    	
    },
    
    // Actions to perform. Defined in the controller
    dataActions: {
	onPixelHover: {
		sharedVar: 'matrix_hovered',
		keys: ['url_ir']
	}
    },
    
    // Source of the data. A module can certainly have multiple sources
    dataSource: [{
    	name: 'matrix1',
    	data: {
    		type: 'url',
    		dataType: 'json',
    		url: 'jsonURL'
    	}
    }, {
    	name: 'maxtrix2',
    	data: {
    		type: 'url',
    		dataType: 'json',
    		url: 'jsonURL'
    	}
    }]
};
