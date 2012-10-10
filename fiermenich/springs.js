Fierm.SpringLabels = function() {
	this.labels = [];
	this.coords = [];
	this.lines = [];
	this.els = [];
}

Fierm.SpringLabels.prototype.addElement = function(el, label, line) {
	this.coords.push([el.getX(), el.getY(), el.getX() * ((Math.random() - 0.5) / 100 + 1), el.getY() * ((Math.random() - 0.5) / 100 + 1), 0, 0, 0, 0]);
	this.lines.push(line);
	this.labels.push(label);
	this.els.push(el);
	this.allowed = true;
}

Fierm.SpringLabels.prototype.resolve = function() {
	return;
	if(!this.allowed)
		return;

	for(var i = 0; i < this.els.length; i++) {
		this.coords[i][6] = this.els[i].getOptimalSpringParameter();
		this.coords[i][8] = this.labels[i].getComputedTextLength();
		this.coords[i][9] = this.els[i].getLabelHeight();
	}

	var distance = 40 / Fierm.zoom;
	var krep = 0.000000001 / Fierm.zoom;
	var kattr = 6000000 / Fierm.zoom;

	/*
	var krep = 0.10;
	var kattr = 0.00001;
	*/

	var damping = 0.7;
	var timestep = 0.05;
	var nodeMass = 5;
	var l = 0;
	var log = 0;

	while(true) {

		l++;
		if(l > 600)
			break;

		var totalEnergy = 0;
		for(var i = this.coords.length - 1; i >= 0; i--) {
			var force = [0, 0];

			for(var j = this.coords.length - 1; j >= 0; j--) {
				if(j == i)
					continue;

				distX = Math.pow((this.coords[j][0] - this.coords[i][0]), 2);
				distY = Math.pow((this.coords[j][1] - this.coords[i][1]), 2);

				var dist = Math.pow((distX + distY), 1/2);
				if(dist > distance)
					continue

				force[0] -= krep / (Math.pow(dist, 3)) * (this.coords[j][0] - this.coords[i][0]) / dist * 0.2;
				force[1] -= krep / (Math.pow(dist, 3)) * (this.coords[j][1] - this.coords[i][1]) / dist * 5;


				distX = Math.pow((this.coords[j][0] - this.coords[i][0] + this.coords[i][8]), 2);
				distY = Math.pow((this.coords[j][1] - this.coords[i][1] + this.coords[i][9]), 2);

				var dist = Math.pow((distX + distY), 1/2);
				if(dist > distance)
					continue

				force[0] -= krep / (Math.pow(dist, 3)) * (this.coords[j][0] - this.coords[i][0] + this.coords[i][8]) / dist * 0.2;
				force[1] -= krep / (Math.pow(dist, 3)) * (this.coords[j][1] - this.coords[i][1] + this.coords[i][9]) / dist * 5;
			}
	
			var distX = (this.coords[i][0] - this.coords[i][2]);
			var distY = (this.coords[i][1] - this.coords[i][3]);

			var dist = Math.pow(Math.pow(distX, 2) + Math.pow(distY, 2), 1/2);
			
			force[0] -= kattr * Math.pow((dist - this.coords[i][6] * 3), 3) * distX / dist * 0.2;
			force[1] -= kattr * Math.pow((dist - this.coords[i][6] * 3), 3) * distY / dist * 5;

			this.coords[i][4] = (this.coords[i][4] + timestep * force[0]) * damping;
			this.coords[i][5] = (this.coords[i][5] + timestep * force[1]) * damping;
			this.coords[i][7] = dist;
			this.coords[i][0] += timestep * this.coords[i][4];
			this.coords[i][1] += timestep * this.coords[i][5]; 

			totalEnergy += nodeMass * (Math.pow(this.coords[i][4], 2) + Math.pow(this.coords[i][5], 2))
		}
console.log(totalEnergy);
		if(totalEnergy < 0.000000001)
			break;
	}
console.log(l);
	for(var i = 0; i < this.labels.length; i++) {
		
		this.labels[i].setAttributeNS(null, 'x', this.coords[i][0]);
		this.labels[i].setAttributeNS(null, 'y', this.coords[i][1]);

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
		}
	}
}


Fierm.SpringLabels.prototype.allow = function() {
	this.allowed = true;
}


Fierm.SpringLabels.prototype.forbid = function() {
	this.allowed = false;
}