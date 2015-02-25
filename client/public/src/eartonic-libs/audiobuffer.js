/* Chunk stream data into a buffered frame and process these frames.*/
define([], function() {
	var AudioBuffer = function(audioContext, stream, size) {
		this.audioContext = audioContext;
		this.size = size;
		this.stream = stream;

		this.bufferedStream = audioContext.createScriptProcessor(this.size, 1, 1);
		this.volume = this.audioContext.createGain();
		this.audioInput = this.audioContext.createMediaStreamSource(stream);
		this.audioInput.connect(this.volume);
		this.volume.connect(this.bufferedStream);
		this.bufferedStream.connect(this.audioContext.destination);

		this.addProcessor = function(callback) {
			this.bufferedStream.onaudioprocess = function(e) {
				var data = e.inputBuffer.getChannelData(0);
				callback(data);
			};
		};
	};

	AudioBuffer.prototype.size = 1024;
	return AudioBuffer;
});