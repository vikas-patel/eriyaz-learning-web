define(['./soundbank', './stringsynth', 'currentaudiocontext', 'require', 'soundtouch'], function(SoundBank, StringSynth, CurrentAudioContext, require) {
	var context = CurrentAudioContext.getInstance();

	// root between 47 and 58
	var Tanpura = function() {
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

		this.setTuning = function(root, firstString, progressCallback) {
			progressCallback('start', 0);
			var soundbank = SoundBank.getInstance();

			if (soundbank.isReady) {
				this.initStrings(root,firstString,soundbank, progressCallback);
			} else {
				var local = this;
				soundbank.onready = function() {
					local.initStrings(root,firstString,soundbank, progressCallback);
				};
			}
		};

		this.initStrings = function(root,firstString,soundbank, progressCallback) {
			progressCallback('soundbank', 25);
			this.strings[0] = new StringSynth(root - 12 + firstString, soundbank);
			progressCallback('string1', 50);
			var middleString = new StringSynth(root, soundbank);
			progressCallback('string2', 75);
			this.strings[1] = middleString;
			this.strings[2] = middleString;

			this.strings[3] = new StringSynth(root - 12, soundbank);
			progressCallback('string3', 100);
		};
	};

	var instance;

	function createInstance() {
		return new Tanpura();
	}

	return {
		getInstance: function() {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
});