define(['require', 'currentaudiocontext'], function(require, CurrentAudioContext) {
	var context = CurrentAudioContext.getInstance();
	var SoundBank = function() {
		this.samples = [];
		this.init = function() {
			this.loadSample(require.toUrl('/assets/c2sharp.mp3'), 37);
			this.loadSample(require.toUrl('/assets/g2sharp.mp3'), 44);
			this.loadSample(require.toUrl('/assets/c3sharp.mp3'), 49);
			this.loadSample(require.toUrl('/assets/g3sharp.mp3'), 56);
		};

		this.loadSample = function(url, noteNum) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			var local = this;
			request.onload = function() {
				// createBuffer(request.response);
				context.decodeAudioData(request.response, function(buffer) {
					local.samples.push({
						noteNum: noteNum,
						buffer: buffer
					});
					if (local.samples.length == 4) {
						local.oninit();
					}
				}, function() {
					console.log('could not load audio');
				});
			};
			request.send();
		};

		this.getNearestSample = function(noteNum) {
			var diffs = this.samples.map(function(obj) {
				return Math.abs(noteNum - obj.noteNum);
			});
			var minIndex = diffs.indexOf(Math.min.apply(Math, diffs));
			return this.samples[minIndex];
		};

		this.init();
	};
	return SoundBank;
});