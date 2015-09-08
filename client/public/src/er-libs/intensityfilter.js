define([], function() {
	var IntensityFilter = {
		meanAbs: function(data) {
			var absSum = 0;
			for (var i = 0; i < data.length; i++) {
				absSum += Math.abs(data[i]);
			}
			return absSum / data.length;
		},

		rootMeanSquare: function(data) {
			var sumSquare = 0;
			for (var i = 0; i < data.length; i++) {
				sumSquare += data[i] * data[i];
			}
			return Math.sqrt(sumSquare / data.length);
		}
	};
	return IntensityFilter;
});