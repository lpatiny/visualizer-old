Fierm.SpringLabels = function(svg) {
	this.labels = [];
	this.coords = [];
	this.lines = [];
	this.els = [];

	this.svg = svg;
}

Fierm.SpringLabels.prototype.addElement = function(el, label, line) {
	
}

Fierm.SpringLabels.prototype.resolve = function() {
	
	var coords = this.svg.getElementsForSprings();

	/*if(!this.allowed)
		return;
*/
	var distance = 20 / Fierm.zoom;
	var krep = 0.00000005;
	var kattr = 6000000 / Fierm.zoom;

	/*
	var krep = 0.10;
	var kattr = 0.00001;
	*/
	var damping = 0.7;
	var timestep = 0.5;
	var nodeMass = 5;
	var l = 0;
	var log = 0;

	while(true) {

		l++;
		if(l > 600)
			break;

		var totalEnergy = 0;
		for(var i = coords.length - 1; i >= 0; i--) {
			var force = [0, 0];

			for(var j = coords.length - 1; j >= 0; j--) {
				if(j == i)
					continue;

				distX = Math.pow((coords[j][0] - coords[i][0]), 2);
				distY = Math.pow((coords[j][1] - coords[i][1]), 2);
				var dist = Math.pow((distX + distY), 1/2);
				if(dist > distance)
					continue
				force[0] -= krep / (Math.pow(dist, 3)) * (coords[j][0] - coords[i][0]) / dist * 0.2;
				force[1] -= krep / (Math.pow(dist, 3)) * (coords[j][1] - coords[i][1]) / dist * 5;
			}
	
			var distX = (coords[i][0] - coords[i][2]);
			var distY = (coords[i][1] - coords[i][3]);

			var dist = Math.pow(Math.pow(distX, 2) + Math.pow(distY, 2), 1/2);
			
			force[0] -= kattr * Math.pow((dist - coords[i][6]), 3) * distX / dist * 0.2;
			force[1] -= kattr * Math.pow((dist - coords[i][6]), 3) * distY / dist * 5;

			coords[i][4] = (coords[i][4] + timestep * force[0]) * damping;
			coords[i][5] = (coords[i][5] + timestep * force[1]) * damping;
		//	coords[i][7] = dist;
			coords[i][0] += timestep * coords[i][4];
			coords[i][1] += timestep * coords[i][5]; 

			totalEnergy += nodeMass * (Math.pow(coords[i][4], 2) + Math.pow(coords[i][5], 2))
		}
		if(isNaN(totalEnergy))
			break;
		if(totalEnergy < 0.000000001)
			break;
	}

	for(var i = 0; i < coords.length; i++) {
		
		if(!isNaN(coords[i][0]) && coords[i][7]) {
			coords[i][7].setAttributeNS(null, 'x', coords[i][0]);
			coords[i][7].setAttributeNS(null, 'y', coords[i][1]);
		}
/*	
		if(this.coords[i][7] < 0.004)
			this.lines[i].setAttributeNS(null, 'display', 'none');
		else {
			this.lines[i].setAttributeNS(null, 'display', 'block');
			this.lines[i].setAttribute('x1', this.coords[i][0]);
			this.lines[i].setAttribute('x2', this.els[i].getX());
			this.lines[i].setAttribute('y1', this.coords[i][1]);
			this.lines[i].setAttribute('y2', this.els[i].getY());
			this.lines[i].setAttribute('stroke', 'black');
			this.lines[i].setAttribute('vector-effect', 'non-scaling-stroke');			
		}*/
	}
}


Fierm.SpringLabels.prototype.allow = function() {
	this.allowed = true;
}


Fierm.SpringLabels.prototype.forbid = function() {
	this.allowed = false;
}