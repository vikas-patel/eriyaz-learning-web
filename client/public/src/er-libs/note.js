/*
Represents a musical note conforming to MIDI specs.
*/
define([], function() {
	var Note = function() {
		this.play = function(player) {
			player.playNote(this);
		};
	};

	Note.MIDDLE_C_NUM = 60;
	Note.MIDDLE_C_FREQ = 261.6;

	Note.A4_FREQ = 440;
	Note.A4_NUM = 69;

	Note.createSilentNote = function(duration) {
		return Note.createFromFreq(0,duration,0);	
	};

	Note.createFromFreq = function(freq,duration,volume) {
		var n = new Note();
		n.freq = freq;
		n.midiNumber = Note.freqToNum(freq);
		if(duration) 
			n.duration = duration;
		if(volume)
			n.volume = volume;
		return n;
	};

	Note.createFromMidiNum = function(midiNumber,duration,volume) {
		var n = new Note();
		n.midiNumber = midiNumber;
		n.freq = Note.numToFreq(midiNumber);
		if(duration) 
			n.duration = duration;
		if(volume)
			n.volume = volume;
		return n;
	};

	Note.freqToNum = function(freq) {
		var num =  12.0 * (Math.log(freq / 440.0)/Math.log(2)) + 69;
		//assign a number if within 5 cents.
		if(Math.abs(num-Math.round(num)) < 0.05) 
			return Math.round(num); 
		else return;
	};

	Note.numToFreq = function(midiNumber) {
		return 440.0 * Math.pow(2, (midiNumber - 69.0) / 12.0);
	};

	Note.prototype = {
		midiNumber: Note.MIDDLE_C_NUM,
		freq : Note.MIDDLE_C_FREQ,
		duration : 1000,
		volume : 127
	};

	
	return Note;
});