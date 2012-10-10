if(typeof Fierm == 'undefined') Fierm = {};

Fierm.SVGElement = function() {};
Fierm.SVGElement.prototype = {};

Fierm.SVGElement.prototype.createElement = function(nodeName, properties, doNotInclude) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', nodeName);
	for(var i in properties)
		node.setAttributeNS(null, i, properties[i]);
	this._nodes = this._nodes || [];
	
	if(!doNotInclude)
		this._nodes.push(node);
	return node;
}


Fierm.SVGElement.prototype.setLabelVisibility = function(bln) {
	this._labelVisibility = bln;
}

Fierm.SVGElement.prototype.doDisplayLabel = function(bln, zoom) {

	if(bln && this._labelVisibility) {
		
		Fierm.SVGElement.prototype.Springs.allow();
		this._line.setAttributeNS(null, 'display', 'block');
		this._label.setAttributeNS(null, 'display', 'block');
		this._label.setAttributeNS(null, 'font-size', 12 / zoom);
	} else {
		Fierm.SVGElement.prototype.Springs.forbid();
		this._label.setAttributeNS(null, 'display', 'none');
		this._line.setAttributeNS(null, 'display', 'none');
	}
}

Fierm.SVGElement.prototype.createLabel = function(x, y, labelTxt) {
	var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	label.textContent = labelTxt;
	label.setAttributeNS(null, 'x', x);
	label.setAttributeNS(null, 'y', y);
	label.setAttributeNS(null, 'font-size', 12 / Fierm.initZoom);
	this._label = label;
	return label;
}

Fierm.SVGElement.prototype.getX = function() {
	return this._x;
}

Fierm.SVGElement.prototype.getY = function() {
	return this._y;
}

Fierm.SVGElement.prototype.changeZoom = function() {};
Fierm.SVGElement.prototype.inDom = function() {};

Fierm.SVGElement.prototype.construct = function(x, y, data) {
	this._x = x, this._y = y, this._data = data;
	this._label, this._line;
}

Fierm.SVGElement.prototype.doLine = function() {
	var el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	this._line = el;
	this._nodes.push(el);
	return el;
}

Fierm.SVGElement.prototype.writeLabel = function() {
	if(this._data.l) {
		label = this.createLabel(this._x, this._y, this._data.l);
		Fierm.SVGElement.prototype.Springs.addElement(this, label, this.doLine());
	}
}

Fierm.Ellipse = function(x, y, data) {
	this.createElement('circle', {cx: x, cy: y, r: 1, fill: data.c, opacity: data.o, transform: 'translate(' + (x + data.w/2) + ' ' + (y + data.h/2) + ') rotate( ' + data.a + ') scale(' + data.w + ' ' + data.h + ')'});
	this.createElement('circle', {cx: x, cy: y, r: 1, fill: 'transparent', stroke: data.c, 'vector-effect': 'non-scaling-stroke', transform: 'translate(' + (x + data.w/2) + ' ' + (y + data.h/2) + ') rotate( ' + data.a + ') scale(' + data.w + ' ' + data.h + ')'});
}

$.extend(Fierm.Ellipse.prototype, Fierm.SVGElement.prototype);


Fierm.Pie = function(x, y, data) {
	this.construct(x,y,data);
	this.pieElements = [];
	this._chart = data.chart;
	
	this._rmin = 1;
	this._rzoom0 = 3;
	this._rthresh = 10;
	this._rmaxpie = 30;
	this._circleSlope = (this._rzoom0 - this._rmin) / Fierm.initZoom;
	this._zoomThresh = (this._rthresh - this._rzoom0) / this._circleSlope;
	this._lastAngle = 0;

	this._g = this.createElement('g', {'transform': 'translate(' + this._x + ', ' + this._y + ')'})	
	this._circle = this.createElement('circle', {fill: data.c, stroke: 'black', 'vector-effect': 'non-scaling-stroke', cx: this._x, cy: this._y, r: 10 / 1000});

	this.writeLabel();
	this.changeZoom(Fierm.initZoom);
}


$.extend(Fierm.Pie.prototype, Fierm.SVGElement.prototype);

Fierm.Pie.prototype.inDom = function() {

	if(!this._chart)
		return;

	for(var i = 0; i < this._chart.length; i++) {
		var el = this.createElement('path', {fill: this._chart[i].c, stroke: 'black', 'stroke-width': 1, 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke'}, false);
		this._g.appendChild(el);
		this.pieElements.push(el);
	}
	this.drawPie();
}


Fierm.Pie.prototype.getPiePart = function(element) {
	var newAngle = - 2 * Math.PI * element.v,
		radius = 1, x0, y0, x1, y1;
	x0 = Math.cos(this._lastAngle) * radius,
	y0 = Math.sin(this._lastAngle) * radius,	
	this._lastAngle += newAngle;
	x1 = Math.cos(this._lastAngle) * radius - x0,
	y1 = Math.sin(this._lastAngle) * radius - y0;

	return 'M 0, 0 l ' + x0 + ' ' + y0 + ' a ' + radius + ', ' + radius  + ' 0 ' + (element.v > 0.5 ? 1 : 0) + ', 0 ' + x1 + ', ' + y1 + ' z';
}

Fierm.Pie.prototype.drawPie = function() {
	for(var i = 0, l = this.pieElements.length; i < l; i++)
		this.pieElements[i].setAttributeNS(null, 'd', this.getPiePart(this._data.chart[i]));
}

Fierm.Pie.prototype.setPieVisibility = function(bln) {
	this._g.setAttributeNS(null, 'display', bln ? 'block' : 'none');
	this._pieVisible = bln;
}

Fierm.Pie.prototype.setCircleVisibility = function(bln) {
	this._circle.setAttributeNS(null, 'display', bln ? 'block' : 'none');
}


Fierm.Pie.prototype.changeZoom = function(zoom) {
	this._zoom = zoom;
	if(zoom < this._zoomThresh) {
		this.setPieVisibility(false);
		this.setCircleVisibility(true);
		this._pieradius = false;

		this._circleradius = this._rmin + (this._circleSlope * zoom);
		this._lastRadius = this._circleradius / zoom;
		this._circle.setAttributeNS(null, 'r', this._lastRadius);	

	} else {
		if(!this._pieVisible) {
			this.setPieVisibility(true);
			this.setCircleVisibility(false);
		}
		var rad = this._rmin + (this._circleSlope * zoom);
		if(rad > this._rmaxpie)
			rad = this._rmaxpie;
		this._lastRadius = rad / zoom;
		this._g.setAttributeNS(null, 'transform', 'translate(' + this._x + ' ' + this._y +') scale(' + this._lastRadius + ')');	
	}
	
	this.doDisplayLabel(zoom < 1500 ? true : false, zoom);
}

Fierm.Pie.prototype.getOptimalSpringParameter = function() {
	return this._lastRadius * 1.3;
}

Fierm.Pie.prototype.getLabelHeight = function() {
	return 12 / this._zoom;
}


