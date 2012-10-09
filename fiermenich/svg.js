
if(typeof Fierm == 'undefined') Fierm = {};

Fierm.SVG = function(width, height, viewWidth, viewHeight) {
	this._nameSpace = 'http://www.w3.org/2000/svg';
	this._px = new String('px');
	this.create(width, height, viewWidth, viewHeight);
}

Fierm.SVG.prototype = {};
Fierm.SVG.prototype.create = function(width, height, viewWidth, viewHeight) {
	var self = this;

	this._width = width;
	this._height = height;

	this._viewWidth = viewWidth;
	this._viewHeight = viewHeight;

	this._els = [];

	this._viewBox = [0, 0, viewWidth, viewHeight];
	this._svgEl = document.createElementNS(this._nameSpace, 'svg');
	this._svgEl.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	this._svgEl.setAttribute('width', width + this._px);
	this._svgEl.setAttribute('height', height + this._px);
	this._svgEl.setAttribute('draggable', 'true');

	this._groupElements = document.createElementNS(this._nameSpace, 'g');
	this._svgEl.appendChild(this._groupElements);

	this._groupLabels = document.createElementNS(this._nameSpace, 'g');
	this._svgEl.appendChild(this._groupLabels);
/*
	line = document.createElementNS(this._nameSpace, 'line');
	this._svgEl.appendChild(line);
	line.setAttributeNS(null, 'x1', '100');
	line.setAttributeNS(null, 'x2', '100');
	line.setAttributeNS(null, 'y1', '0');
	line.setAttributeNS(null, 'y2', '1000');
	line.setAttributeNS(null, 'stroke', 'black');

	line = document.createElementNS(this._nameSpace, 'line');
	this._svgEl.appendChild(line);
	line.setAttributeNS(null, 'x1', '0');
	line.setAttributeNS(null, 'x2', '1000');
	line.setAttributeNS(null, 'y1', '100');
	line.setAttributeNS(null, 'y2', '100');
	line.setAttributeNS(null, 'stroke', 'black');
*/

	this.deltaZoom(0, 0, 0);
	this._setEvents();
//$("#main").css({marginLeft: 100, marginTop: 200});
	document.getElementById("main").appendChild(this._svgEl);


	this.setViewBox();
	var pos = $(this._svgEl).position();
	
	this._svgPosX = pos.left;
	this._svgPosY = pos.top;
}

Fierm.SVG.prototype._setEvents = function() {
	var self = this;
	$(this._svgEl).mousewheel(function(event, delta) {		
		self.deltaZoom(event.pageX - self._svgPosX, event.pageY - self._svgPosY, delta);
		return false;
	});

	this._svgEl.addEventListener('mousedown', function(event) {
		self._dragStart(event);
	});
	this._svgEl.addEventListener('mouseup', function(event) {
		self._dragStop(event);
	});
	this._svgEl.addEventListener('mousemove', function(event) {

		viewRatioX = (event.pageX - self._svgPosX) / self._width;
		viewRatioY = (event.pageY - self._svgPosY) / self._height;
		self._dragMove(event);
	});
}


Fierm.SVG.prototype._dragStart = function(event) {
	this._dragging = true;
	this._dragX = event.pageX;
	this._dragY = event.pageY;

	return;
}


Fierm.SVG.prototype._dragMove = function(event) {

	if(!this._dragging)
		return;

	var newX = event.pageX, diffX = (newX - this._dragX);
	var newY = event.pageY, diffY = (newY - this._dragY);


	var ratioX = diffX / this._width, ratioY = diffY / this._height;
	var diffXViewbox = ratioX * this._viewBox[2];
	var diffYViewbox = ratioY * this._viewBox[3];

	this._viewBox[0] -= diffXViewbox;
	this._viewBox[1] -= diffYViewbox;
	this._dragX = newX, this._dragY = newY;
	this.setViewBox();
}

Fierm.SVG.prototype._dragStop = function() {
	this._dragging = false;
}

Fierm.SVG.prototype.deltaZoom = function(x, y, delta) {
	if(!this._currentDelta) {
		this._currentDelta = 0;
		this._accumulatedDelta = 0;
	}
	if(delta == 0)
		return;
	
	var parent = this._svgEl.parentNode;
	//parent.removeChild(this._svgEl);

	//console.time('salut');
	this._currentDelta += delta;
	var boxWidthX = this._viewWidth * Math.pow(2, this._currentDelta);
	var boxWidthY = this._viewHeight * Math.pow(2, this._currentDelta);
	this._viewBox[0] -= viewRatioX * (boxWidthX - this._viewBox[2]);
	this._viewBox[1] -= viewRatioY * (boxWidthY - this._viewBox[3]);
	this._viewBox[2] = boxWidthX;
	this._viewBox[3] = boxWidthY;
	this.setViewBox();

	Fierm.zoom = this._width / this._viewBox[2];
	this.changeZoomElements(this._width / this._viewBox[2]);

	//parent.appendChild(this._svgEl);
	console.timeEnd('salut');
}

Fierm.SVG.prototype.setViewBox = function(x1, y1, x2, y2) {
	if(x1 && x2 && y1 && y2)
		this._viewBox = [x1, y1, x2, y2];
	this._svgEl.setAttributeNS(null, 'viewBox', this._viewBox.join(' '));
}

Fierm.SVG.prototype.changeZoomElements = function(newZoom) {
	for(var i in this._els)
		this._els[i].changeZoom(newZoom);
}

Fierm.SVG.prototype.add = function(el) {
	this._els.push(el);
	if(!el._nodes)
		return;
	for(var i in el._nodes)	
		this._groupElements.appendChild(el._nodes[i]);
	for(var i in el._labels)	
		this._groupLabels.appendChild(el._labels[i]);

	el.inDom();
}
