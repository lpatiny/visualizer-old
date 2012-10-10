
if(typeof Fierm == 'undefined') Fierm = {};

Fierm.SVG = function(width, height, viewWidth, viewHeight) {
	this._nameSpace = 'http://www.w3.org/2000/svg';
	this._px = new String('px');
	this.create(width, height, viewWidth, viewHeight);
}

Fierm.SVG.prototype = {};
Fierm.SVG.prototype.create = function() {
	var self = this;

	this._els = [];

	this._svgEl = document.createElementNS(this._nameSpace, 'svg');
	this._svgEl.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	this._svgEl.setAttribute('draggable', 'true');
	this._svgEl.setAttribute('preserveAspectRatio', 'xMidYMid slice');

	this._groupElements = document.createElementNS(this._nameSpace, 'g');
	this._svgEl.appendChild(this._groupElements);

	this._groupLabels = document.createElementNS(this._nameSpace, 'g');
	this._svgEl.appendChild(this._groupLabels);

	this.deltaZoom(0, 0, 0);
	this._setEvents();
}

Fierm.SVG.prototype.setViewBoxWidth = function(w, h) {
	this._viewWidth = w;
	this._viewHeight = h;
	this._viewBox = [0, 0, this._viewWidth, this._viewHeight];
}

Fierm.SVG.prototype.setSize = function(width, height) {

	this._width = width;
	this._height = height;

	this._svgEl.setAttribute('width', width + this._px);
	this._svgEl.setAttribute('height', height + this._px);
}

Fierm.SVG.prototype.initZoom = function() {

	var ratioX = this._viewWidth / this._width;
	var ratioY = this._viewHeight / this._height;
	var ratio;
	Fierm.initZoom = 1 / ratioX
	Fierm.zoom = 1 / ratioX;
}

Fierm.SVG.prototype.bindTo = function(dom) {
	this._wrapper = dom;
}

Fierm.SVG.prototype.ready = function() {
	$(this._wrapper).append(this._svgEl);
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
	var self = this;
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

	window.clearTimeout(this._timeoutZoom);
	this._timeoutZoom = window.setTimeout(function() {
		Fierm.SVGElement.prototype.Springs.resolve();
	}, 2000);

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
