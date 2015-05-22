define(['./interval'], function(Interval) {
	var middleCFreq = 261;
	var RandomIntervalGen = function() {

		this.getRandomInterval = getRandomInterval;

		function getRandomInterval(isBaseFixed, isUp) {
			var freq1 = middleCFreq;
			if (!isBaseFixed) {
				// Max 261*2.5 & Min 261*.5
				if (isUp) freq1 = middleCFreq/2 + middleCFreq*2*Math.random();
				// Min 261 & max 261*4
				else freq1 = middleCFreq + middleCFreq*3*Math.random();
			}
			var sign = isUp ? 1 : -1;
			var freq2 = getRandomFreq(freq1, 1, sign);
			return new Interval(freq1, freq2);
		}

		function getRandomFreq(baseFreq, octaves, sign) {
			return baseFreq * Math.pow(2, octaves*sign*getRandomCents() / 1200);
		}

		function getRandomCents() {
			var random = Math.floor(Math.random() * 1200);
			if(random < 50) {
				random = getRandomCents();
			}
			return random;
		}
	};

	return new RandomIntervalGen();
});