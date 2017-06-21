define(['currentaudiocontext', 'phasevocoder'], function(CurrentAudioContext) {
	var context = CurrentAudioContext.getInstance();
	var TimeStretcher = function(buffer, tempo, start, end) {
		console.log("calculating slower audio");
		var BUFFER_SIZE = 2048;
		var channels = buffer.numberOfChannels;
		var startIndex = Math.round(buffer.sampleRate*start);
		var endIndex = Math.round(buffer.sampleRate*end);
		var iList = new Array(channels);
		var phasevocoder = new Array(channels);
		var outBufferList = new Array(channels);
		for (var i=0; i<channels;i++) {
			outBufferList[i] = [];
			phasevocoder[i] = new PhaseVocoder(BUFFER_SIZE/2, buffer.sampleRate); 
			phasevocoder[i].init();
			phasevocoder[i].set_alpha(1/tempo);
			iList[i] = new Float32Array(Math.round(buffer.sampleRate *2* (end-start)));
			for (var j = startIndex; j < endIndex; j++) {
				iList[i][j - startIndex] = buffer.getChannelData(i)[j];
			}
		}
		var position = 0;
		do {
			for (var i=0; i<channels;i++) {
				var buf = new Float32Array(BUFFER_SIZE);
				buf = iList[i].subarray(position, position+BUFFER_SIZE);
				outBufferList[i] = outBufferList[i].concat(phasevocoder[i].process(buf));
			}
	        position += phasevocoder[0].get_analysis_hop();
	    } while(position < iList[0].length - BUFFER_SIZE);

	    var outBuffer = context.createBuffer(channels, outBufferList[0].length, context.sampleRate);
	    for (var j=0; j<channels;j++) {
	    	var o = outBuffer.getChannelData(j);
	    	for (var i = 0; i < outBufferList[j].length; i++) {
				o[i] = outBufferList[j][i];
			}
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