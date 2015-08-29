define(['music-calc'], function(MusicCalc) {


	var Problem = function(scale,level) {
		var baseFreq = MusicCalc.MIDDLE_C_FREQ;
		var asc = level.direction==="asc";
		if (level.isRootVary) {
			if (asc) {
				baseFreq = Math.floor(baseFreq*(1-0.5*Math.random()));
			} else {
				baseFreq = Math.floor(baseFreq*(1+Math.random()));
			}
		}

		// var index = 1 + Math.floor(Math.random() * (scale.length - 2));
		var degree = level.notes[Math.floor(Math.random()*level.notes.length)];
		var index = scale.indexOf(degree);
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

	Problem.getNewProblem = function(scale,level) {
		return new Problem(scale,level);
	};

	return Problem;
});