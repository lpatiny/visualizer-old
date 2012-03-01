

/*
 * Corresponding HTML wrapper
 * <div id="ci-module-12234234" class="ci-module" data-ci-moduleid="12234234"></div>
 */

var module = { id: '12234234', dom: $("#ci-module-12234234") }; 


CI.event.send('eventName', { target: 'moduleid/moduletype/moduleobj', data: { dataKey: 'dataVal', dataKey2: 'dataVal2' }});
CI.event.bind(module, 'eventName', function(data) {
	
});


var onLocalStorage = true;
CI.setSharedData('sharedDataName', 'sharedDataValue', onLocalStorage);
CI.onSharedDataSet('sharedDataName', function(sharedDataVal) {	
	// Do something
});

CI.getSharedData('sharedDataName');

