define(['currentaudiocontext', 'phasevocoder'], function(CurrentAudioContext) {
	var context = CurrentAudioContext.getInstance();
	var TimeStretcher = function(buffer, tempo, start, end) {
		var BUFFER_SIZE = 2048;
		var il = new Float32Array(Math.round(buffer.sampleRate *2* (end-start)));
		var loriginal = buffer.getChannelData(0);
		var startIndex = Math.round(buffer.sampleRate*start);
		var endIndex = Math.round(buffer.sampleRate*end);
		for (var j = startIndex; j < endIndex; j++) {
			il[j - startIndex] = loriginal[j];
		}
		var ir = new Float32Array(Math.round(buffer.sampleRate *2* (end-start)));
		var roriginal = buffer.getChannelData(1);
		startIndex = Math.round(buffer.sampleRate*start);
		endIndex = Math.round(buffer.sampleRate*end);
		for (var j = startIndex; j < endIndex; j++) {
			ir[j - startIndex] = roriginal[j];
		}

		var position = 0;
		var phasevocoderL = new PhaseVocoder(BUFFER_SIZE/2, 44100); phasevocoderL.init();
		var phasevocoderR = new PhaseVocoder(BUFFER_SIZE/2, 44100); phasevocoderR.init();
		phasevocoderL.set_alpha(1/tempo);
		phasevocoderR.set_alpha(1/tempo);
		var outBufferL = [];
		var outBufferR = [];

		do {
	        var bufL = new Float32Array(BUFFER_SIZE);
	        var bufR = new Float32Array(BUFFER_SIZE);
	        bufL = il.subarray(position, position+BUFFER_SIZE);
	        bufR = ir.subarray(position, position+BUFFER_SIZE);
	        position += phasevocoderL.get_analysis_hop();
	        // Process left input channel
	        outBufferL = outBufferL.concat(phasevocoderL.process(bufL));
	        // Process right input channel
	        outBufferR = outBufferR.concat(phasevocoderR.process(bufR));
	    } while(position < il.length - BUFFER_SIZE);

	    var outBuffer = context.createBuffer(2, outBufferL.length, context.sampleRate);
	    var ol = outBuffer.getChannelData(0);
		var or = outBuffer.getChannelData(1);
		for (var i = 0; i < outBufferL.length; i++) {
			ol[i] = outBufferL[i];
		}
		for (var i = 0; i < outBufferR.length; i++) {
			or[i] = outBufferL[i];
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