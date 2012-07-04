
onmessage = function(event) {
	
	var gridData = event.data.message;
	var minValue, maxValue;
	for (i=0;i<gridData.length;i++) {
		for (j=0;j<gridData[i].length;j++) {
			if (!minValue || gridData[i][j]<minValue) minValue=gridData[i][j];
			if (!maxValue || gridData[i][j]>maxValue) maxValue=gridData[i][j];
		}
	}
		
	event.data.message = { min: minValue, max: maxValue};
	postMessage(event.data);
}
