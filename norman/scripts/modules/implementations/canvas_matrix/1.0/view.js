 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.canvas_matrix == 'undefined')
	CI.Module.prototype._types.canvas_matrix = {};

CI.Module.prototype._types.canvas_matrix.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.canvas_matrix.View.prototype = {
	
	init: function() {	
		
		this.canvas = document.createElement("canvas"); // Store the pointer
		this.canvasContext = this.canvas.getContext('2d'); // Store the context
		this.lastCanvasWidth = 0;
		this.lastCanvasHeight = 0;
		this.lastCellWidth = 0;
		this.lastCellHeight = 0;
		this.lastImageData = null;

		this.dom = document.createElement("div");
		var title = document.createElement("h3");
		
		this._domTitle = title;
		
		var canvasContainer = document.createElement("div");
		canvasContainer.className = "canvas-container";
		
		this.dom.appendChild(title);
		this.dom.appendChild(canvasContainer);
				
		canvasContainer.appendChild(this.canvas);

		this.module.getDomContent().html(this.dom);
		
		
		this.worker = new Worker('./scripts/modules/implementations/canvas_matrix/1.0/worker.js');
		var view = this;
		this.worker.addEventListener('message', function(event) {
			view.lastImageData = event.data;
			view.updateCanvas();
		});
		this.gridImage = this.canvasContext.createImageData(this.canvas.width, this.canvas.height);
		
		this.fitFillMode = "fit";

		
		this.onResize();
	},
	
	onResize: function() {
		
		var container = this.module.getDomContent().find('.canvas-container');
		
		// Set the canvas to full width and height
		var moduleWidth = container.width();
		var moduleHeight = this.module.getDomContent().parent().height() - this.module.getDomContent().find("h3").outerHeight(true);
		
		container.height(moduleHeight);
		
		if(this.rowNumber == undefined || this.colNumber == undefined)
			return;
			
		if (typeof this.zoomLevelPreset == 'undefined' || !this.zoomLevelPreset) {
			var size;
			if (typeof this.fitFillMode != 'undefined' && this.fitFillMode == "fit")
				size = Math.min(moduleWidth, moduleHeight);
			else if (typeof this.fitFillMode != 'undefined' && this.fitFillMode == "fill")
				size = Math.max(moduleWidth, moduleHeight);
			else return;
			
			this.cellHeight = Math.ceil(size / this.rowNumber);
			this.cellWidth = Math.ceil(size / this.colNumber); 
			this.zoomLevelPreset = true;
		}
	
		this.canvas.width = moduleWidth;
		this.canvas.height = moduleHeight;
		
		this.updateCanvas();
	},
	
	onZoom: function(zoomFactor) {
		if (zoomFactor<0) {
			this.cellWidth--;
			this.cellHeight--;
		} else if (zoomFactor>0) {
			this.cellWidth++;
			this.cellHeight++;
		}
		this.zoomLevelPreset = true;
		this.updateCanvas();
	},
	
	update: function() {
		
		var moduleValue = this.module.getValue();
		for(var i in moduleValue) {
			
			this.colNumber = moduleValue[i].nbCols;
			this.rowNumber = moduleValue[i].nbRows;
			
			this._domTitle.innerHTML = moduleValue[i].data.title;
			
			break;
		}
		
		
		
		this.onResize();
	},
	
	updateCanvas: function() {
		
		var moduleValue = this.module.getValue();
		
		var newWidth = this.cellWidth;
		var newHeight = this.cellHeight;
		
		
		// We only need to re-evaluate the pixels when the zoom-level has changed.
		// Otherwise, keep the same imagedata, but put it elsewhere
		if(newWidth != this.lastCellWidth || newHeight != this.lastCellHeight) {
			
			this.lastCellWidth = newWidth;
			this.lastCellHeight = newHeight;
			
			if(newWidth == 0 || newHeight == 0)
				return;
			
			this.canvasContext.clearRect(0,0,this.canvas.width, this.canvas.height);
			this.gridImage = this.canvasContext.createImageData(newWidth * this.colNumber, newHeight * this.rowNumber); // Store the image
			for(var i in moduleValue) {
				if(moduleValue[i] == null || this.gridImage == undefined)
					continue;
				
				this.worker.postMessage({
					gridData: moduleValue[i].dataMatrix,
					gridImageData: this.gridImage,
					cols: this.colNumber,
					rows: this.rowNumber,
					cellWidth: this.cellWidth,
					cellHeight: this.cellHeight
				});
			
				break;
			}
		} else {
			this.canvasContext.putImageData(this.lastImageData, (this.canvas.width-this.lastImageData.width)/2, (this.canvas.height-this.lastImageData.height)/2);
		}
		
		
		
	},
	
	getDom: function() {
		return this.dom;
	},
	
	// No additional type transform needed
	typeToScreen: {}
}
