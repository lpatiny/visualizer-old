

Fierm.initZoom = 1000;
Fierm.zoom = Fierm.initZoom;

var svg = new Fierm.SVG(1 * Fierm.initZoom, 1 * Fierm.initZoom, 1, 1);
var Springs = new Fierm.SpringLabels();


var datas = json.scatter.value.series[0].data;
for(var i = 0, l = datas.length; i < l; i++) {
	var pie = new Fierm.Circle(datas[i].x, datas[i].y, datas[i]);
	svg.add(pie);
}

var datas = json.scatter.value.series[1].data;
for(var i = 0, l = datas.length; i < l; i++) {
	var pie = new Fierm.Pie(datas[i].x, datas[i].y, datas[i]);
	svg.add(pie);
}




Springs.resolve();

