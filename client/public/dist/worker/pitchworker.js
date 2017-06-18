var processArray;
var offset = 0;
var current = 0;
var incr = 128;
var buffsize = 2048;
var pitchArray = [];
var rootFreq = 123;
var sampleRate;
importScripts('/worker/waveletPitch.js');

self.onmessage = function(e) {
	switch (e.data.command) {
		case 'init':
			sampleRate = e.data.sampleRate;
			// one extra buffer 2048
			processArray = new Float32Array(Math.ceil(e.data.time*sampleRate) + 2048);
			rootFreq = e.data.rootFreq;
			offset = 0;
			current = 0;
			pitchArray = [];
			break;
		case 'record':
			record(e.data.floatarray);
			break;
		case 'concat':
			concatBuffers();
			break;
	}
};

function record(floatarray) {
	processArray.set(floatarray, offset);
	offset += floatarray.length;
	calcPitch();
}

function findPitch(data) {
	var freq = 0;
	freq = dywapitch_computepitch(data);
	freq = freq * (sampleRate/44100);
	return freq;
}

function getCents(freq1, freq2) {
	return Math.floor(1200 * (Math.log(freq2 / freq1) / Math.log(2)));
}

function calcPitch() {
	while (current + buffsize < offset) {
        var subarray = new Float32Array(buffsize);
        for (var i = 0; i < buffsize; i++) {
          subarray[i] = processArray[current + i];
        }
        // floatarray.subarray(offset,offset+buffsize);
        var pitch = findPitch(subarray);
        if (pitch !== 0) {
          var currentFreq = pitch;
          var currentInterval = getCents(rootFreq, currentFreq) / 100;
          pitchArray.push(currentInterval);
        } else 
        	pitchArray.push(-100);
        current = current + incr;
     }
}

function concatBuffers() {
	// var concatenatedArray = new Float32Array(buffArray.length * buffArray[0].length);
	// var offset = 0;
	// for (var j = 0; j < buffArray.length; j++) {
	// 	(function(buffer) {
	// 		concatenatedArray.set(buffer, offset);
	// 	})(buffArray[j]);
	// 	offset += buffArray[j].length;
	// }
	self.postMessage({
		command: 'concat',
		pitchArray: pitchArray,
		recordedArray: processArray
	});
}