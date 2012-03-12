/* We must first of all initialize the namespace */
CI = new Object();


(function($) {
	
	$(document).ready(function() {
		
		$.getJSON('testcase/modules.json', {}, function(pagedef) {
		
			// Initiates the grid
			CI.Grid.init(pagedef.grid);
				
				
			for(var i = 0; i < pagedef.modules.length; i++) {
				var Module = new CI.Module(pagedef.modules[i]); 
				CI.modules[pagedef.modules[i].id] = Module;
				CI.Grid.addModule(Module);
			}
		});
	});
	
}) (jQuery);



var chems = [
	"Ammonia gas",
	"Ammonium formate",
	"Bromobenzene",
	"Carbonyldiimidazole",
	"Cyclohexanone",
	"1,1-Dichloro-1-fluoroethane",
	"Diethylamine",,
	"2,5-Dimethoxyphenethylamine",
	"Formamide",
	"Formic acid",
	"Lithium metal",
	"Lithium aluminum hydride",
	"Magnesium metal",
	"Mercuric chloride",
	"N-Methylformamide"
];

var chemCAS = [
	2475628734,
	2343645656,
	3464677657,
	5767567467,
	5674526456,
	4764563454,
	4656456546,
	4746756756,
	4564564565,
	4646767675,
	5677887878,
	9897867457,
	1231231232,
	4534534534,
	3564564564
];

var json = {};

json.nbRows = 15;
json.nbCols = 15;

json.dataMatrix = [];
json.rows = [];
json.cols = [];

for(var i = 0; i < 15; i++) {
	
	json.rows[i] = {};
	json.cols[i] = {};
	json.rows[i].cas = chemCAS[i];
	json.cols[i].cas = chemCAS[i];
	json.rows[i].name = chems[i];
	json.cols[i].name = chems[i];
	
	json.dataMatrix[i] = [];
	for(var j = 0; j < 15; j++) {
		json.dataMatrix[i][j] = {};
		json.dataMatrix[i][j].val = Math.random();
		json.dataMatrix[i][j].url = "http://google.com";
	}
}

	
//console.log(JSON.stringify(json));
