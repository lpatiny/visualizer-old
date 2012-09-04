

CI.VariableFilters = {
	

	'chemcalclookup': {

		'name': "Chemicalc lookup by mass",
		'author': 'Norman Pellet',
		'date': '2012-7-4',

		process: function(value, output) {

			dfd = $.Deferred();

			$.ajax({
				dataType: 'json',
				type: 'get',
				url: 'http://www.chemcalc.org/service?action=em2mf&mfRange=C1-20H1-40O1-10N0-10&monoisotopicMass=' + value,

				sucess: function(val) {
					console.log(val);
					dfd.resolve(val.results);
				}
			});

			return dfd.promise();
		}
	}

}