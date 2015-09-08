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
		},

		standardDeviation: function(values){
			values = _.filter(values, function(num){ return !Number.isNaN(num); });
		  var avg = this.average(values);
		  
		  var squareDiffs = values.map(function(value){
		    var diff = value - avg;
		    var sqrDiff = diff * diff;
		    return sqrDiff;
		  });
		  
		  var avgSquareDiff = this.average(squareDiffs);

		  var stdDev = Math.sqrt(avgSquareDiff);
		  return stdDev;
		},

		average: function(data){
		  var sum = data.reduce(function(sum, value){
		    return sum + value;
		  }, 0);

		  var avg = sum / data.length;
		  return avg;
		}
	};
	return IntensityFilter;
});