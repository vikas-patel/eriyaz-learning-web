define([], function() {
	var MusicCalc = {};

	MusicCalc.MIDDLE_C_FREQ = 261;

	MusicCalc.freqToMidiNum = function(freq) {
		var num = 12.0 * (Math.log(freq / 440.0) / Math.log(2)) + 69;
		//assign a number if within 5 cents.
		if (Math.abs(num - Math.round(num)) < 0.05)
			return Math.round(num);
		else return;
	};

	MusicCalc.midiNumToFreq = function(midiNumber) {
		return 440.0 * Math.pow(2, (midiNumber - 69.0) / 12.0);
	};

	MusicCalc.midiNumToNotation = function(midiNumber) {
		var octave = Math.floor(midiNumber/12) - 1;
		var note = midiNumber%12;
		switch (note) {
		  case 0:
		    return "C"+octave;
		  case 1:
		  	return "C"+octave + "#";
		  case 2:
		    return "D"+octave;
		  case 3:
		  	return "D"+octave + "#";
		  case 4:
		    return "E"+octave;
		  case 5:
		  	return "F"+octave;
		  case 6:
		    return "F"+octave + "#";
		  case 7:
		  	return "G"+octave;
		  case 8:
		  	return "G"+octave + "#";
		  case 9:
		    return "A"+octave;
		  case 10:
		  	return "A"+octave + "#";
		  case 11:
		  	return "B"+octave;
		  default:
		  	return "";
		}
	};

	MusicCalc.getCents = function(freq1, freq2) {
		return Math.floor(1200 * (Math.log(freq2 / freq1) / Math.log(2)));
	};

	MusicCalc.getCentsArray = function(baseFreq, freqsArray) {
		var cents = [];
		for (var i = 0; i < freqsArray.length; i++) {
			cents[i] = MusicCalc.getCents(baseFreq, freqsArray[i]);
		}
		return cents;
	};

	MusicCalc.getFreq = function(baseFreq, cents) {
		return baseFreq * Math.pow(2, cents / 1200);
	};

	MusicCalc.getFreqArray = function(baseFreq, centsArray) {
		var freqs = [];
		for (var i = 0; i < centsArray.length; i++) {
			freqs[i] = MusicCalc.getFreq(baseFreq, centsArray[i]);
		}
		return freqs;
	};


	MusicCalc.getInterval = function(midiNum1, midiNum2) {
		return midiNum2 - midiNum1;
	};

	MusicCalc.getIntervalArray = function(baseNoteNum, midiNumArray) {
		var intervals = [];
		for (var i = 0; i < midiNumArray.length; i++) {
			intervals[i] = midiNumArray[i]-baseNoteNum;
		}
		return intervals;
	};


	MusicCalc.getMidiNum = function(baseNoteNum, interval) {
		return baseNoteNum + interval;
	};

	MusicCalc.getMidiNumArray = function(baseNoteNum, intervalArray) {
		var midiNums = [];
		for (var i = 0; i < midiNumArray.length; i++) {
			midiNums[i] = intervalArray[i]+baseNoteNum;
		}
		return midiNums;
	};

	return MusicCalc;
});