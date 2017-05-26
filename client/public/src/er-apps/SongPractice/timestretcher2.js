define(['currentaudiocontext'], function(CurrentAudioContext) {
	var context = CurrentAudioContext.getInstance();
	var TimeStretcher = function(buffer, tempo, start, end) {
		this.st = new SoundTouch();

		this.st.tempo = tempo;


		//extract 2 secs of subbuffer from main buffer assuming pluck at every 1s, leaving 1 sec overlap.
		var lsub = new Float32Array(Math.round(buffer.sampleRate *2* (end-start)));
		var loriginal = buffer.getChannelData(0);
		var startIndex = Math.round(buffer.sampleRate*start);
		var endIndex = Math.round(buffer.sampleRate*end);
		for (var j = startIndex; j < endIndex; j++) {
			lsub[j - startIndex] = loriginal[j];
		}
		var rsub = new Float32Array(Math.round(buffer.sampleRate *2* (end-start)));
		var roriginal = buffer.getChannelData(1);
		startIndex = Math.round(buffer.sampleRate*start);
		endIndex = Math.round(buffer.sampleRate*end);
		for (var j = startIndex; j < endIndex; j++) {
			rsub[j - startIndex] = roriginal[j];
		}

		this.source = {
			extract: function(target, numFrames, position) {
				var l = lsub;
				var r = rsub;
				// var r = subBuffer.getChannelData(1);
				for (var i = 0; i < numFrames; i++) {
					target[i * 2] = l[i + position];
					target[i * 2 + 1] = r[i + position];
				}
				return Math.min(numFrames, l.length - position);
			}
		};

		var filter = new SimpleFilter(this.source, this.st);
		var outSamples = new Float32Array(lsub.length * 2);
		var framesExtracted = filter.extract(outSamples, lsub.length);
		var outBuffer = context.createBuffer(2, lsub.length, buffer.sampleRate);
		var l = outBuffer.getChannelData(0);
		var r = outBuffer.getChannelData(1);
		if (framesExtracted === 0) {
			// pause();
		}
		for (var i = 0; i < framesExtracted; i++) {
			l[i] = outSamples[i * 2];
			r[i] = outSamples[i * 2 + 1];
		}

		this.out = function() {
			return outBuffer;
		}

		this.play = function(node, time) {
			var source = context.createBufferSource();
			source.buffer = outBuffer;
			source.connect(node);
			source.start(time);
		};
	};
	return TimeStretcher;
});