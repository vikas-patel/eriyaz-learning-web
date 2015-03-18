define(['currentaudiocontext'],function(CurrentAudioContext) {
	var context = CurrentAudioContext.getInstance();
	var StringSynth = function(noteNum, soundbank) {
		var buffer;

		this.st = new SoundTouch();

		var nearestSample = soundbank.getNearestSample(noteNum);
		buffer = nearestSample.buffer;
		this.st.pitch = Math.pow(2, (noteNum - nearestSample.noteNum) / 12);
		var BUFFER_SIZE = 16384;


		var samples = new Float32Array(BUFFER_SIZE * 2);



		// this.filter = new SimpleFilter(this.source, st);



		// this.connect = function(node) {
		// 	this.node.connect(node);
		// };

		this.disconnect = function() {
			this.node.disconnect();
		};
		this.node = context.createScriptProcessor(BUFFER_SIZE, 2, 2);
		this.source = {
			extract: function(target, numFrames, position) {
				var l = buffer.getChannelData(0);
				// var r = buffer.getChannelData(1);
				for (var i = 0; i < numFrames; i++) {
					target[i * 2] = l[i + position];
					target[i * 2 + 1] = l[i + position];
				}
				return Math.min(numFrames, l.length - position);
			}
		};

		this.pluck = function(node) {
			var filter = new SimpleFilter(this.source, this.st);

			this.node.onaudioprocess = function(e) {
				var l = e.outputBuffer.getChannelData(0);
				var r = e.outputBuffer.getChannelData(1);
				var framesExtracted = filter.extract(samples, BUFFER_SIZE);
				if (framesExtracted === 0) {
					// pause();
				}
				for (var i = 0; i < framesExtracted; i++) {
					l[i] = samples[i * 2];
					r[i] = samples[i * 2 + 1];
				}
			};
			this.node.connect(node);
		};
	};
	return StringSynth;
});