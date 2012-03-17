     
function generateGrid(gridData, gridImage, cols, rows, cellWidth, cellHeight) {
	
	var gridImageData = gridImage.data;
	
	//var ctx = document.getElementsByTagName("canvas")[0].getContext('2d');
	var color, x=0, y=0, i=0, j=0, pixelNum=0;
	
	while (x<cols) {
		//gridData[x/cellWidth] = [];
		while (y<rows) {
			

			color = Math.round(gridData[x][y] * 255);
			
		//	color = Math.floor( Math.random() * 255 );
		//	gridData[x/cellWidth][y/cellHeight] = color;
			while (i<cellWidth) {
				while (j<cellHeight) {
					pixelNum = 4 * (x * cellWidth + i + (y * cellHeight + j) * cols * cellWidth);
					gridImageData[pixelNum+0] = color; // Red value
					gridImageData[pixelNum+1] = color; // Green value
					gridImageData[pixelNum+2] = color; // Blue value
					gridImageData[pixelNum+3] = 255; // Alpha value
					j++;
				}
				j=0;
				i++;
			}
			i=0;
			y++;
		}
		y=0;
		x++;
	}
	
	return gridImage;
}

onmessage = function(event) {
	
	postMessage(generateGrid(event.data.gridData, event.data.gridImageData, event.data.cols, event.data.rows, event.data.cellWidth, event.data.cellHeight));
}
