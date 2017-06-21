importScripts("/worker/complex.js", "/worker/real.js", "/worker/PV_fast.js");  
self.onmessage = function(e) {
	switch (e.data.command) {
		case 'calculate':
			calculate(e.data.channelData, e.data.sampleRate, e.data.tempo, e.data.start, e.data.end);
			break;
	}
};

function calculate(channelData, sampleRate, tempo, start, end) {
	console.log("worker thread: calculating slower audio");
	var BUFFER_SIZE = 2048;
	var channels = channelData.length;
	var startIndex = Math.round(sampleRate*start);
	var endIndex = Math.round(sampleRate*end);
	var iList = new Array(channels);
	var phasevocoder = new Array(channels);
	var outBufferList = new Array(channels);
	for (var i=0; i<channels;i++) {
		outBufferList[i] = [];
		phasevocoder[i] = new PhaseVocoder(BUFFER_SIZE/2, sampleRate); 
		phasevocoder[i].init();
		phasevocoder[i].set_alpha(1/tempo);
		iList[i] = new Float32Array(Math.round(sampleRate *2* (end-start)));
		for (var j = startIndex; j < endIndex; j++) {
			iList[i][j - startIndex] = channelData[i][j];
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
    // post output buffer
    self.postMessage({
		command: 'done',
		outBufferList: outBufferList
	});
}