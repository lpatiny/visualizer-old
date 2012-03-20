
onmessage = function() {
	k = 0;
	var matrix = [];
	for(var i = 0; i < 65000; i ++) {
		line = [];
		if(i % 1000 == 0)
			postMessage({ progress: true, finished: false, iterations: k });
		for(var j = 0; j < 65000; j++) {
			line[j] = 0.4;
			k++;
		}
		//matrix[i] = line;
	}
	postMessage({ progress: false, finished: true, iterations: k });
}