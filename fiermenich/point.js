if(typeof Fierm == 'undefined') Fierm = {};

Fierm.SVGElement = function() {};
Fierm.SVGElement.prototype = {};

Fierm.SVGElement.prototype.createElement = function(nodeName, properties, doNotInclude, single) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', nodeName);
	for(var i in properties)
		node.setAttributeNS(null, i, properties[i]);
	this._nodes = this._nodes || [];
	
	if(!doNotInclude) {
		if(!single)
			this._highlightgroup.appendChild(node);
		else
			this._nodes.push(node);
	}
	return node;
}


Fierm.SVGElement.prototype.getCoordsSprings = function(coords) {

	if(!this._forceField)
		return;
	if(this.allowLabelDisplay && this._labelVisibility && this._displayed)
		coords.push([ this._x, this._y, this._x * 1.001, this._y * 1.001, 0, 0, this.getOptimalSpringParameter(), this._label]);
}

Fierm.SVGElement.prototype.setLabelDisplayThreshold = function(val) {
	this._zoomThreshLabel = val;
	this.changeZoom(Fierm.Zoom);
}

Fierm.SVGElement.prototype.allowLabelDisplay = function(bln) {
	this.allowLabelDisplay = bln;
}

Fierm.SVGElement.prototype.doDisplayLabel = function(bln, zoom) {

	if(bln && this.allowLabelDisplay && this._displayed) {
		
		if(this._line)
			this._line.setAttributeNS(null, 'display', 'block');

		if(this._label) {
			this._label.setAttributeNS(null, 'pointer-events', 'none');
			this._label.setAttributeNS(null, 'display', 'block');
			this._label.setAttributeNS(null, 'transform', 'translate(' + this._x + ' ' + this._y + ') scale(' + (Fierm.initZoom / Fierm.zoom) + ') translate(-' + this._x + ' -' + this._y + ')');
		}
		//this._label.setAttributeNS(null, 'font-size', 12 / zoom);
		this._labelVisibility = true;
	} else {
		
		if(this._label)
			this._label.setAttributeNS(null, 'display', 'none');
		if(this._line)
			this._line.setAttributeNS(null, 'display', 'none');
		this._labelVisibility = false;
	}
}

Fierm.SVGElement.prototype.forceField = function(bln) {

	this._forceField = bln;
}

Fierm.SVGElement.prototype.setLabelSize = function(fontsize) {
	if(this._label)
		this._label.setAttributeNS(null, 'font-size', fontsize / Fierm.initZoom)
}

Fierm.SVGElement.prototype.createLabel = function(x, y, labelTxt) {
	var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	label.textContent = labelTxt;
	label.setAttributeNS(null, 'x', x);
	label.setAttributeNS(null, 'y', y);
	label.setAttributeNS(null, 'font-size', 12 / Fierm.initZoom);
	console.log(this._data);
	label.setAttributeNS(null, 'fill', this._lc || this._data.lc || 'black');
	label.setAttributeNS(null, 'transform', 'translate(' + this._x + ' ' + this._y + ') scale(' + (Fierm.initZoom / Fierm.zoom) + ') translate(-' + this._x + ' -' + this._y + ')');
	//this._nodes.push(label);
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
	var self = this;
	this._highlightgroup = this.createElement('g', {class: 'highlightgroup'}, false, true);

	this._zoomThreshLabel = 1500;

	CI.RepoHighlight.listen(data._highlight, function(value, keys) {	
		self.highlight(value);
	});

}

Fierm.SVGElement.prototype.mouseover = function() {
	//this.highlight(true);
	CI.RepoHighlight.set(this._data._highlight, 1);
	if(this.hoverCallback)
		this.hoverCallback.call(this);
}

Fierm.SVGElement.prototype.mouseout = function() {
	//this.highlight(false);
	CI.RepoHighlight.set(this._data._highlight, 0);
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
//		Fierm.SVGElement.prototype.Springs.addElement(this, label, this.doLine());
	}
}

Fierm.SVGElement.prototype.setColor = function(color) {
	this._color = color;
	this._a.setAttributeNS(null, 'fill', color);
	this._b.setAttributeNS(null, 'stroke', color);
}

Fierm.SVGElement.prototype.highlight = function(bln) {

	
	//this._currentEl.setAttributeNS(null, 'class', 'nothighlight');
	if(bln)
		this._highlightgroup.setAttributeNS(null, 'transform', 'translate(' + this._x + ', ' + this._y + ') scale(5) translate(' + (-this._x) + ', ' + (-this._y) + ')');
	else
		this._highlightgroup.removeAttributeNS(null, 'transform');

}



Fierm.Ellipse = function(x, y, data) {
	
	this.construct(x,y,data);
	this._displayed = true;

	this.g = this.createElement('g');
	this._a = this.createElement('circle', {cx: 0, cy: 0, r: 1, fill: data.c, opacity: data.o, transform: 'translate(' + x + ' ' + y + ') rotate( ' + data.a + ') scale(' + data.w + ' ' + data.h + ')'}, false);
	this._b = this.createElement('circle', {cx: 0, cy: 0, r: 1, fill: 'transparent', stroke: data.c, 'vector-effect': 'non-scaling-stroke', transform: 'translate(' + x + ' ' + y + ') rotate( ' + data.a + ') scale(' + data.w + ' ' + data.h + ')'}, false);

	this.g.appendChild(this._a);
	this.g.appendChild(this._b);

	this.writeLabel();
	this.changeZoom(Fierm.initZoom);
	this._data = data;
}

$.extend(Fierm.Ellipse.prototype, Fierm.SVGElement.prototype);
Fierm.Ellipse.prototype.filter = function(filter) {
	if(filter[this._data.n] !== undefined) {
		this._a.setAttributeNS(null, 'display', (filter[this._data.n] ? 'block' : 'none'));
		this._b.setAttributeNS(null, 'display', (filter[this._data.n] ? 'block' : 'none'));
	}
}

Fierm.Ellipse.prototype.getOptimalSpringParameter = function() {

	return (this._data.w, this._data.h);
}

Fierm.Ellipse.prototype.inDom = function() {
	this._highlightgroup.setAttributeNS(null, 'data-id', this.id);
}

Fierm.Ellipse.prototype.changeZoom = function(zoom) {
	
	this.doDisplayLabel(zoom < this._zoomThreshLabel ? false : true, zoom);
}



Fierm.Pie = function(x, y, data) {
	this.construct(x,y,data);
	this.pieElements = [];
	this._chart = data.chart;
	
	this._displayed = true;
	this._failure = {};

	this.charthashmap = {};
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

	this._highlightgroup.setAttributeNS(null, 'data-id', this.id);

	for(var i = 0; i < this._chart.length; i++) {

		this.charthashmap[this._chart[i].n] = this._chart[i].v;
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
	this._pieVisible = bln;
	if(this._displayed)
		this._g.setAttributeNS(null, 'display', bln ? 'block' : 'none');
		
}

Fierm.Pie.prototype.setCircleVisibility = function(bln) {
	if(this._displayed)
		this._circle.setAttributeNS(null, 'display', bln ? 'block' : 'none');

}


Fierm.Pie.prototype.changeZoom = function(zoom) {
	this._zoom = zoom;
	if(zoom < this._zoomThresh) {
		this.setPieVisibility(false);
		this.setCircleVisibility(true);
		this._pieradius = false;
		this._currentEl = this._circle;
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
		this._currentEl = this._g;
	}
	
	this.doDisplayLabel(zoom < this._zoomThreshLabel ? false : true, zoom);
}

Fierm.Pie.prototype.getOptimalSpringParameter = function() {
	return this._lastRadius * 2;
}

Fierm.Pie.prototype.getLabelHeight = function() {
	return 12 / this._zoom;
}

Fierm.Pie.prototype.filter = function(filter) {

	for(var i in filter) {
		if(this.charthashmap[i] == undefined)
			continue;

		var inside = (this.charthashmap[i] >= filter[i][0] && this.charthashmap[i] <= filter[i][1]);
		if(!inside)
			this._failure[i] = true;
		
		if(this._displayed && !inside) {

			this._currentEl.setAttributeNS(null, 'display', 'none');
			this._displayed = false;

			if(this.allowLabelDisplay && this._labelVisibility)
				this._label.setAttributeNS(null, 'display', 'none');
		
		} else if(!this._displayed && this._failure[i] && inside) {
			
			this._failure[i] = false;
			for(var j in this._failure)
				if(this._failure[j] === true)
					return;
			this._displayed = true;
			this._currentEl.setAttributeNS(null, 'display', 'block');

			if(this.allowLabelDisplay && this._labelVisibility)
				this._label.setAttributeNS(null, 'display', 'block');
		}
	}
}

