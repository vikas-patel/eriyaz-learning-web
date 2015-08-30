define(['music-calc'], function(MusicCalc) {

	var Problem = function(level) {
		var baseFreq = MusicCalc.MIDDLE_C_FREQ;
		var asc = level.direction==="asc";

		var index = Math.floor(Math.random()*level.notes.length);
		var degree = level.notes[index];
		var sequence;
		var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		if (asc) {
			sequence = [0, 200, 400, 500, 700, 900, 1100, 1200];
			sequence[index+1] += level.cents*plusOrMinus;
		} else {
			sequence = [1200, 1100, 900, 700, 500, 400, 200, 0];
			sequence[index+1] += level.cents*plusOrMinus;
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

		this.isSharp = function() {
			return plusOrMinus > 0 ? true : false;
		}

		this.isAsc = function() {
			return asc;
		};

		this.getScale = function() {
			if (asc) {
				return [0, 2, 4, 5, 7, 9, 11, 12];
			} else {
				return [12, 11, 9, 7, 5, 4, 2, 0];
			}
		};

		this.getSequenceFreqs = function() {
			if (asc)
				return MusicCalc.getFreqArray(baseFreq, sequence);
			else return MusicCalc.getFreqArray(baseFreq, (sequence.map(function(degree) {
				return degree - 1200;
			})));
		};
	};

	Problem.getNewProblem = function(level) {
		return new Problem(level);
	};

	return Problem;
});