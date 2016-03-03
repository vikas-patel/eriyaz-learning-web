define(['bufferloader'], function(BufferLoader) {
	var Player = function(audioContext, type) {
		// midi audio map
		this.context = audioContext;
		this.urlMap = new Map();
		var audioPath;
		var audioExn;
		if (type == 'female') {
			this.rootNote = 58;
			audioPath = "er-shell/audio/female/";
			audioExn = ".m4a";
		} else {
			this.rootNote = 47;
			audioPath = "er-shell/audio/male/";
			audioExn = ".mp3";
		}
		for (var i = 0; i<=12; i++) {
			var midi = this.rootNote + i;
			this.urlMap.set(midi, audioPath + midi + audioExn);
		}
		var player = this;
		bufferLoader = new BufferLoader(audioContext, this.urlMap, function(bufferMap){player.bufferMap = bufferMap;});
		bufferLoader.load();
	};

	Player.prototype.play = function(midi, callbackFn, duration) {
		var source = this.context.createBufferSource();
		source.buffer = this.bufferMap.get(midi);
		source.connect(this.context.destination);
		if (duration) {
			var offset = duration <=500 ? 0.5 : 0;
			console.log(offset);
			source.start(this.context.currentTime, source.buffer.duration - duration/1000 - offset, source.buffer.duration-offset);
		} else {
			source.start(0);
		}
		source.onended = callbackFn;
	};

	return Player;
});