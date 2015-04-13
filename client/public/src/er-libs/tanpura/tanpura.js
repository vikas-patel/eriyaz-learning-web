define(['./soundbank', './stringsynth', 'currentaudiocontext', 'require', './st-index'], function(SoundBank, StringSynth, CurrentAudioContext, require) {
	var context = CurrentAudioContext.getInstance();

	// root between 47 and 58
	var Tanpura = function(root, firstString) {
		this.strings = [];
		this.mixerNode = context.createGain();
		this.interval = null;
		this.isPlaying = false;

		this.play = function() {
			if (!this.isPlaying) {
				var j = 0;
				var local = this;
				this.interval = setInterval(function() {
					local.strings[j % 4].pluck(local.mixerNode);
					j++;
				}, 1000);
				this.mixerNode.connect(context.destination);
				this.isPlaying = true;
			}
		};

		this.stop = function() {
			clearInterval(this.interval);
			// this.mixerNode.disconnect();
			this.interval = null;
			this.isPlaying = false;
		};

		this.setTuning = function(root, firstString) {
			var soundbank = new SoundBank();
			var local = this;
			soundbank.oninit = function() {
				local.strings[0] = new StringSynth(root - 12 + firstString, soundbank);
				local.strings[1] = new StringSynth(root, soundbank);
				local.strings[2] = new StringSynth(root, soundbank);
				local.strings[3] = new StringSynth(root - 12, soundbank);
			};
		};
	};

	var instance;

	function createInstance(root, firstString) {
		return new Tanpura(root, firstString);
	}

	return {
		getInstance: function(root, firstString) {
			if (!instance) {
				instance = createInstance(root, firstString);
			}
			instance.setTuning(root,firstString);
			return instance;
		}
	};
});