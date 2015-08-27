define([], function() {
	var WebAudioPlayer = function(audioContext) {
		this.audioContext = audioContext;
		this.beatLength = 0.05;

		this.playInfinite = function(freq) {
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
			osc.start();
			return osc;
		};
		
		this.playNote = function(freq, duration, delay) {
			if (!delay) delay = 0;
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
			osc.start(this.audioContext.currentTime + delay/1000);
			osc.stop(this.audioContext.currentTime + delay/1000 + duration/1000);
		};

		this.scheduleNote = function(freq,startTime,duration) {
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

			osc.start(startTime);
			osc.stop(startTime + duration/1000);
		};

		this.playBeat = function(delay) {
			this.play(440, this.beatLength, delay);
		};

		this.play = function(freq, duration, delay) {
			if (!delay || delay < 0) delay = 0;
			var osc = this.audioContext.createOscillator();
	        osc.connect(this.audioContext.destination);
	        osc.frequency.value = freq;
	        osc.start(this.audioContext.currentTime + delay/1000);
	        osc.stop(this.audioContext.currentTime + delay/1000 + duration);			
		};

		this.playMelody = function(melody, delay) {
			if (!delay) delay = 0;
			for (var i = 0; i < melody.notes.length; i++) {
				this.playNote(melody.notes[i].freq, melody.notes[i].duration, delay);
				delay += melody.notes[i].duration;
			}
		};
	};

	return WebAudioPlayer;
});