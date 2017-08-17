var processArray;
var offset = 0;
var current = 0;
var incr = 128;
var buffsize = 2048;
var pitchArray = [];
var latency = 2048;
var rootFreq = 123;
var sampleRate;
importScripts('/worker/waveletPitch.js');

self.onmessage = function(e) {
	switch (e.data.command) {
		case 'init':
		sampleRate = e.data.sampleRate;
			// one extra buffer 2048
			processArray = new Float32Array(Math.ceil(e.data.time*sampleRate) + buffsize);
			rootFreq = e.data.rootFreq;
			offset = 0;
			current = 0;
			pitchArray = [];
			recordSize = 0;
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
		if (recordSize <= latency) {
			recordSize += floatarray.length;
			return;
		}
		processArray.set(floatarray, offset);
		offset += floatarray.length;
		calcPitch();
	}

	function calcPitch() {
		while (current + buffsize < offset) {
			var subarray = new Float32Array(buffsize);
			for (var i = 0; i < buffsize; i++) {
				subarray[i] = processArray[current + i];
			}
        // floatarray.subarray(offset,offset+buffsize);
        var pitch = findPitch(subarray);
        if (pitch == -1) {
        	pitchArray.push(-100);
        } else if (pitch == 0) {
        	pitchArray.push(-200);
        } else {
        	var currentFreq = pitch;
        	var currentInterval = getCents(rootFreq, currentFreq) / 100;
        	pitchArray.push(currentInterval);
        }

        current = current + incr;
    }
}


function concatBuffers() {
	self.postMessage({
		command: 'concat',
		pitchArray: pitchArray,
		recordedArray: processArray
	});
}

// Helper functions
function findPitch(data) {
	var freq = -1;
	if (rootMeanSquare(data) > 0.005) {
		freq = dywapitch_computepitch(data);
		freq = freq * (sampleRate/44100);
	}
	return freq;
}

function rootMeanSquare(data) {
	var sumSquare = 0;
	for (var i = 0; i < data.length; i++) {
		sumSquare += data[i] * data[i];
	}
	return Math.sqrt(sumSquare / data.length);
}

function getCents(freq1, freq2) {
	return Math.floor(1200 * (Math.log(freq2 / freq1) / Math.log(2)));
}