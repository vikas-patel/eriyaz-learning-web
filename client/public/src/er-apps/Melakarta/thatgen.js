define(['underscore'], function(_) {
	var ThatGen = function() {
		var reGaOpts = [1,2,3,4];
		var dhaNiOpts = [8,9,10,11];
		this.getRandomThat = getRandomThat;

		function getRandomThat() {
			var reGa = _.shuffle(reGaOpts);
			var dhaNi = _.shuffle(dhaNiOpts);
			var ma = Math.random()>0.5 ? 5 : 6;
			var that = [];
			that.push(0);
			that.push(reGa[0]);
			that.push(reGa[1]);
			that.push(ma);
			that.push(7);
			that.push(dhaNi[0]);
			that.push(dhaNi[1]);
			that.push(12);
			that.sort(function(a,b) {return a-b;});
			return that;
		}
	};

	return new ThatGen();
});