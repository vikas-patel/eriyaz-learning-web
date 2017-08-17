define(['currentaudiocontext'], function(CurrentAudioContext) {
	var context = CurrentAudioContext.getInstance();
	var PitchShifter = function(buffer, noteShift) {
		console.log("calculating lower pitch audio");
		var channels = buffer.numberOfChannels;
		this.st = new SoundTouch();
		this.st.pitch = Math.pow(2, -noteShift/12);
		var lsub = buffer.getChannelData(0);

		this.source = {
			extract: function(target, numFrames, position) {
				var l = lsub;
				// var r = subBuffer.getChannelData(1);
				for (var i = 0; i < numFrames; i++) {
					target[i * 2] = l[i + position];
					// target[i * 2 + 1] = l[i + position];
				}
				return Math.min(numFrames, l.length - position);
			}
		};

		var filter = new SimpleFilter(this.source, this.st);
		var outSamples = new Float32Array(lsub.length * 2);
		var framesExtracted = filter.extract(outSamples, lsub.length);

		var outBuffer = context.createBuffer(1, lsub.length, buffer.sampleRate);
		var l = outBuffer.getChannelData(0);

		for (var i = 0; i < framesExtracted; i++) {
			l[i] = outSamples[i * 2];
		}

		this.out = function() {
			return outBuffer;
		}

		this.play = function() {
			var source = context.createBufferSource();
			source.buffer = outBuffer;
			source.connect(context.destination);
			source.start(0);
		};
	};
	return PitchShifter;
});