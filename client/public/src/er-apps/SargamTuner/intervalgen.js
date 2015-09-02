define(['./interval'], function(Interval) {
	var middleCFreq = 261;
	var RandomIntervalGen = function(octaves) {
		this.octaves = octaves;

		this.getRandomInterval = getRandomInterval;

		function getRandomInterval() {
			return new Interval(getRandomFreq(), getRandomFreq());
		}

		function getRandomFreq() {
			return middleCFreq * Math.pow(2, getRandomCents() / 1200);
		}

		function getRandomCents() {
			return (Math.floor(Math.random() * octaves * 1200) - octaves * 1200 / 2);
		}
	};

	return new RandomIntervalGen(1);
});