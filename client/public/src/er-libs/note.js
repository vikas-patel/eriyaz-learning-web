/*
Represents a musical note conforming to MIDI specs.
*/
define(['music-calc'], function(MusicCalc) {
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
		n.midiNumber = MusicCalc.freqToMidiNum(freq);
		if(duration) 
			n.duration = duration;
		if(volume)
			n.volume = volume;
		return n;
	};

	Note.createFromMidiNum = function(midiNumber,duration,volume) {
		var n = new Note();
		n.midiNumber = midiNumber;
		n.freq = MusicCalc.midiNumToFreq(midiNumber);
		if(duration) 
			n.duration = duration;
		if(volume)
			n.volume = volume;
		return n;
	};


	Note.prototype = {
		midiNumber: Note.MIDDLE_C_NUM,
		freq : Note.MIDDLE_C_FREQ,
		duration : 1000,
		volume : 127
	};

	
	return Note;
});