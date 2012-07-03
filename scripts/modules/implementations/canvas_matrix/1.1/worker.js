var count = 0;

 
function generateVisibleGridArea(gridData, gridImage, cols, rows, cellWidth, cellHeight, canvas, colors) {
	
	var dataColumns = gridData.length;
	var gridImageData = gridImage.data;
	var gridWidth = gridImage.width;
	var gridHeight = gridImage.height;
	
	var color, x=0, y=0, i=0, j=0, pixelNum=0;
	
	while (x<cols) {
	
		while (y<rows) {
			color = Math.round(gridData[x][y] * 255);
			
			// The Math.min ensures that we don't try to draw beyond the visible edge of the canvas
			drawCell(x*cellWidth, y*cellHeight, Math.min(cellWidth,gridWidth - x*cellWidth,canvas.width - x*cellWidth), Math.min(cellHeight, gridHeight - y*cellHeight,canvas.height - y*cellHeight), gridWidth, color, gridImageData);
			y++;
		}
		y=0;
		x++;
	}
	
	return gridImage;
}     
function generateGrid(gridData, gridImage, cols, rows, cellWidth, cellHeight, colors) {
	
	var dataColumns = gridData.length;
	var gridImageData = gridImage.data;
	var gridWidth = gridImage.width;
	var gridHeight = gridImage.height;
	
	var color, x=0, y=0, i=0, j=0, pixelNum=0;
	
	while (x<cols) {
	
		while (y<rows) {
			color = Math.round(gridData[x][y] * 255);
			
			// The Math.min ensures that we don't try to draw beyond the edge of the canvas
			drawCell(x*cellWidth, y*cellHeight, Math.min(cellWidth,gridWidth - x*cellWidth), Math.min(cellHeight, gridHeight - y*cellHeight), gridWidth, color, gridImageData);
			y++;
		}
		y=0;
		x++;
	}
	
	return gridImage;
}

function getColorFromValueAndColors(value, colors, from0To1) {
	
	
	if(from0To1) {
		var maxValue = 1;  
		var minValue = 0;
	}
	
	var step = (maxValue - minValue) / (colors.length - 1);
	
	for(var i = 0, len = colors.length; i < len - 1; i++) {
		
		if(value <= ((i + 1) * step + minValue) && value > (i * step + minValue)) {
			return getColorBetween(value, colors[i], colors[i + 1], i * step + minValue, (i + 1) * step + minValue);
		}
	}
	throw value;
	throw "Should not be there";
	return [0, 0, 0];
}


function getColorBetween(value, color1, color2, color1Val, color2Val) {
	
	var color1 = getRGB(color1);
	var color2 = getRGB(color2);
	
	// Between 0 and 1
	var ratio = (value - color1Val) / (color2Val - color1Val);
	
	return [parseInt(ratio * Math.abs(color2[0] - color1[0]) + Math.min(color2[0], color1[0])), parseInt(ratio * Math.abs(color2[1] - color1[1]) + Math.min(color2[1], color1[1])), parseInt(ratio * Math.abs(color2[2] - color1[2]) + Math.min(color2[2], color1[2]))];
}


function getRGB(color) {
	
    if(color.length == 7) {
      return [parseInt('0x' + color.substring(1, 3)),
        parseInt('0x' + color.substring(3, 5)),
        parseInt('0x' + color.substring(5, 7))];
    } else if (color.length == 4) {
      return [parseInt('0x' + color.substring(1, 2)),
        parseInt('0x' + color.substring(2, 3)),
        parseInt('0x' + color.substring(3, 4))];
    }
}

function generateGridArea(gridData, gridImage, startCol, startRow, endCol, endRow, cellWidth, cellHeight, canvas, colors) {
	
	var dataColumns = gridData.length;
	var gridImageData = gridImage.data;
	var gridWidth = gridImage.width;
	var gridHeight = gridImage.height;
	
	
	var color, x=startCol, y=startRow, i=0, j=0, pixelNum=0;
	
	while (x<endCol) {
	
		while (y<endRow) {
		
			color = getColorFromValueAndColors(gridData[x][y], colors, true);
				
			// The Math.min calls ensure that we don't try to draw beyond the edges of the canvas
			drawCell(x*cellWidth, y*cellHeight, Math.min(cellWidth, gridWidth - x*cellWidth), Math.min(cellHeight, gridHeight - y*cellHeight), gridWidth, color, gridImageData);
			y++;
		}
		y=startRow;
		x++;
	}
	
	return gridImage;
}


function drawCell(startX, startY, cellWidth, cellHeight, gridWidth, color, gridImageData) {
	
	//cellWidth or Height will be <0 when the cell is off the edge of the screen, due to the use of Math.min
	if ((cellWidth<0) || (cellHeight<0))
		return;
		
	var i=0, j=0, pixelNum = 0;
	while (j<cellHeight) {
		while (i<cellWidth) {
		count++;
			pixelNum = 4 * (startX + i + (startY + j) * gridWidth);
			gridImageData[pixelNum+0] = color[0]; // Red value
			gridImageData[pixelNum+1] = color[1]; // Green value
			gridImageData[pixelNum+2] = color[2]; // Blue value
			gridImageData[pixelNum+3] = 255; // Alpha value
			i++;
		}
		i=0;
		j++;
	}
	j=0;
}

onmessage = function(event) {
	//first only generate the visible part of the grid to have a quick render
	count = 0;
	var now = new Date().getTime();
	var d = event.data;
	
	
	if (typeof d.startCol != 'undefined' && typeof d.endCol != 'undefined' && typeof d.startRow != 'undefined' && typeof d.endRow != 'undefined') {
		postMessage(generateGridArea(d.gridData, d.gridImageData, d.startCol, d.startRow, d.endCol, d.endRow, d.cellWidth, d.cellHeight, d.canvas, d.colors));
	}
	var diff = new Date().getTime() - now;
	//then generate the whole thing, once we've given the user something to look at in the meantime
	//postMessage(generateGrid(event.data.gridData, event.data.gridImageData, event.data.cols, event.data.rows, event.data.cellWidth, event.data.cellHeight));
	//postMessage(generateGridArea(event.data.gridData, event.data.gridImageData, 0,0,15,15, 20, 20));
}
