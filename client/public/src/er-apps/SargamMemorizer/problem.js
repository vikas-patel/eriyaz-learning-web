define(['music-calc'], function(MusicCalc) {

	var Problem = function(level) {
		var baseFreq = MusicCalc.MIDDLE_C_FREQ;
		var asc = level.direction==="asc";

		var index = Math.floor(Math.random()*level.notes.length);
		var degree = level.notes[index];
		var sequence;
		var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		if (level.isDiscrete) {
			if (asc) {
				sequence = [0, 200, 0, 400, 0, 500, 0, 700, 0, 900, 0, 1100, 0, 1200];
				sequence[index*2+1] += level.cents*plusOrMinus;
			} else {
				sequence = [1200, 1100, 1200, 900, 1200, 700, 1200, 500, 1200, 400, 1200, 200, 1200, 0];
				sequence[index*2+1] += level.cents*plusOrMinus;
			}
		} else {
			if (asc) {
				sequence = [0, 200, 400, 500, 700, 900, 1100, 1200];
				sequence[index+1] += level.cents*plusOrMinus;
			} else {
				sequence = [1200, 1100, 900, 700, 500, 400, 200, 0];
				sequence[index+1] += level.cents*plusOrMinus;
			}
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
			if (level.isDiscrete) {
				if (asc) {
					return [0, 2, 0, 4, 0, 5, 0, 7, 0, 9, 0, 11, 0, 12];
				} else {
					return [12, 11, 12, 9, 12, 7, 12, 5, 12, 4, 12, 2, 12, 0];
				}
			} else {
				if (asc) {
					return [0, 2, 4, 5, 7, 9, 11, 12];
				} else {
					return [12, 11, 9, 7, 5, 4, 2, 0];
				}
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