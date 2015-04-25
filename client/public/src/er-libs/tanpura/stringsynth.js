define(['currentaudiocontext'], function(CurrentAudioContext) {
	var context = CurrentAudioContext.getInstance();
	var StringSynth = function(noteNum, soundbank) {
		var buffer;

		this.st = new SoundTouch();

		var nearestSample = soundbank.getNearestSample(noteNum);
		buffer = nearestSample.buffer;
		this.st.pitch = Math.pow(2, (noteNum - nearestSample.noteNum) / 12);


		//extract 2 secs of subbuffer from main buffer assuming pluck at every 1s, leaving 1 sec overlap.
		var lsub = new Float32Array(Math.round(buffer.sampleRate * 2));
		var loriginal = buffer.getChannelData(0);
		for (var j = 0; j < lsub.length; j++) {
			lsub[j] = loriginal[j];
		}
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
		if (framesExtracted === 0) {
			// pause();
		}
		for (var i = 0; i < framesExtracted; i++) {
			l[i] = outSamples[i * 2];
			// r[i] = outSamples[i * 2 + 1];
		}


		this.pluck = function(node) {
			var source = context.createBufferSource();
			source.buffer = outBuffer;
			source.connect(node);
			source.start();
		};
	};
	return StringSynth;
});