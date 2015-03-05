define([], function() {
	var WebAudioPlayer = function(audioContext) {
		this.audioContext = audioContext;
		this.oscillator = this.audioContext.createOscillator();
		this.oscillator.type = 'square';
		// fixOscillator(this.oscillator);
		this.oscillator.frequency.value = 440;

		this.smoothingFilter = this.audioContext.createBiquadFilter();
		this.smoothingFilter.frequency = 1000; 

		this.amp = this.audioContext.createGain();
		this.amp.gain.value = 0;


		// Connect ooscillator to amp and amp to the mixer of the context.
		// This is like connecting cables between jacks on a modular synth.
		this.oscillator.connect(this.smoothingFilter);
		this.smoothingFilter.connect(this.amp);
		this.amp.connect(this.audioContext.destination);
		this.oscillator.start(0);

		this.playNote = function(note) {
			this.startTone(note.freq);
			(function(player) {
				setTimeout(
					function() {
						player.stopTone();
					}, note.duration);
			})(this);
		};

		this.playMelody = function(melody, delay) {
			if (!delay) delay = 0;
			//var delay = 0;
			for (var i = 0; i < melody.notes.length; i++) {
				(function(index, player) {
					setTimeout(function() {
						player.startTone(melody.notes[index].freq);
					}, delay);
					setTimeout(function() {
						player.stopTone();
					}, delay + melody.notes[index].duration);
				})(i,this);
				delay += melody.notes[i].duration;
			}
		};
		// Set the frequency of the oscillator and start it running.
		this.startTone = function(frequency) {
			var now = this.audioContext.currentTime;

			this.oscillator.frequency.setValueAtTime(frequency, now);

			// Ramp up the gain so we can hear the sound.
			// We can ramp smoothly to the desired value.
			// First we should cancel any previous scheduled events that might interfere.
			this.amp.gain.cancelScheduledValues(now);
			// Anchor beginning of ramp at current value.
			this.amp.gain.setValueAtTime(this.amp.gain.value, now);
			this.amp.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);

		};

		this.stopTone = function() {
			var now = this.audioContext.currentTime;
			this.amp.gain.cancelScheduledValues(now);
			this.amp.gain.setValueAtTime(this.amp.gain.value, now);
			this.amp.gain.linearRampToValueAtTime(0.0, this.audioContext.currentTime + 0.1);
		};
	};

	return WebAudioPlayer;
});