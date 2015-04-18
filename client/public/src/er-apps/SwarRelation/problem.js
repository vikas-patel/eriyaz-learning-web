define(['music-calc'], function(MusicCalc) {


	var Problem = function(scale) {
		var baseFreq = MusicCalc.MIDDLE_C_FREQ - Math.floor(Math.random() * 24);
		var asc = Math.random() < 0.5;

		var index = 1 + Math.floor(Math.random() * (scale.length - 2));
		var degree = scale[index];
		var sequence;

		if (asc) {
			sequence = scale.slice(0, index + 1);
			sequence.push(0);
			sequence.push(degree);
		} else {
			sequence = scale.slice(index, scale.length).reverse();
			sequence.push(12);
			sequence.push(degree);
		}

		this.getBaseFreq = function() {
			return baseFreq;
		};

		this.getNoteFreq = function() {
			if (asc)
				return MusicCalc.getFreq(baseFreq, degree * 100);
			else return MusicCalc.getFreq(baseFreq, (degree - 12) * 100);
		};

		this.getDegree = function() {
			return degree;
		};

		this.isAsc = function() {
			return asc;
		};

		this.getAnswerSeqDegs = function() {
			return sequence;
		};

		this.getAnswerSeqFreqs = function() {
			if (asc)
				return MusicCalc.getFreqArray(baseFreq, (sequence.map(function(degree) {
					return degree * 100;
				})));
			else return MusicCalc.getFreqArray(baseFreq, (sequence.map(function(degree) {
				return (degree - 12) * 100;
			})));
		};
	};

	Problem.getNewProblem = function(scale) {
		return new Problem(scale);
	};

	return Problem;
});