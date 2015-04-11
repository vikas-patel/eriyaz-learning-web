define([], function() {
	var WebAudioPlayer = function(audioContext) {
		this.audioContext = audioContext;
		this.beatLength = 0.05;
		// oscillator = this.audioContext.createOscillator();
		// oscillator.type = 'square';
		// // fixOscillator(oscillator);
		// oscillator.frequency.value = 440;

		// this.smoothingFilter = this.audioContext.createBiquadFilter();
		// this.smoothingFilter.frequency = 1000; 

		// this.amp = this.audioContext.createGain();
		// this.amp.gain.value = 1;


		// Connect ooscillator to amp and amp to the mixer of the context.
		// This is like connecting cables between jacks on a modular synth.
		// oscillator.connect(this.smoothingFilter);
		// this.smoothingFilter.connect(this.amp);
		// this.amp.connect(this.audioContext.destination);
		//oscillator.start(0);

		this.playNote = function(freq, duration) {
			var osc = this.audioContext.createOscillator();
			osc.frequency.value = freq;
			osc.type = 'square';

			this.smoothingFilter = this.audioContext.createBiquadFilter();
			this.smoothingFilter.frequency = 1000;

			this.amp = this.audioContext.createGain();
			this.amp.gain.value = 1;

			osc.connect(this.smoothingFilter);
			this.smoothingFilter.connect(this.amp);
			this.amp.connect(this.audioContext.destination);
			osc.start(this.audioContext.currentTime);
			osc.stop(this.audioContext.currentTime + duration/1000);
		}

		this.playBeat = function() {
			this.play(440, this.beatLength);
		}

		this.play = function(freq, duration) {
			var osc = this.audioContext.createOscillator();
	        osc.connect(this.audioContext.destination);
	        osc.frequency.value = freq;
	        osc.start(this.audioContext.currentTime);
	        osc.stop(this.audioContext.currentTime + duration);			
		}

		// this.playNote = function(note) {
		// 	this.startTone(note.freq);
		// 	(function(player) {
		// 		setTimeout(
		// 			function() {
		// 				player.stopTone();
		// 			}, note.duration);
		// 	})(this);
		// };

		// this.playMelody = function(melody, delay) {
		// 	if (!delay) delay = 0;
		// 	//var delay = 0;
		// 	for (var i = 0; i < melody.notes.length; i++) {
		// 		(function(index, player) {
		// 			setTimeout(function() {
		// 				player.startTone(melody.notes[index].freq);
		// 			}, delay);
		// 			setTimeout(function() {
		// 				player.stopTone();
		// 			}, delay + melody.notes[index].duration);
		// 		})(i,this);
		// 		delay += melody.notes[i].duration;
		// 	}
		// };
		// // Set the frequency of the oscillator and start it running.
		// this.startTone = function(frequency) {
		// 	var now = this.audioContext.currentTime;

		// 	oscillator.frequency.setValueAtTime(frequency, now);

		// 	// Ramp up the gain so we can hear the sound.
		// 	// We can ramp smoothly to the desired value.
		// 	// First we should cancel any previous scheduled events that might interfere.
		// 	this.amp.gain.cancelScheduledValues(now);
		// 	// Anchor beginning of ramp at current value.
		// 	this.amp.gain.setValueAtTime(this.amp.gain.value, now);
		// 	this.amp.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);

		// };

		// this.stopTone = function() {
		// 	var now = this.audioContext.currentTime;
		// 	this.amp.gain.cancelScheduledValues(now);
		// 	this.amp.gain.setValueAtTime(this.amp.gain.value, now);
		// 	this.amp.gain.linearRampToValueAtTime(0.0, this.audioContext.currentTime + 0.1);
		// };
	};

	return WebAudioPlayer;
});