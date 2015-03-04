var self;
var PitchService = function(callback) {
	// make this available in callback functions
	self = this;
	this.callback = callback;
	this.root = 110;
	this.adjustment = 1.088; //pitch adjustment to pitch.js determined pitch(incorrect by itself.)
	this.currFreq;
	//tone.js
	initAudio();
    this.pitch = new PitchAnalyzer(44100);
    audioContext = window.AudioContext || window.webkitAudioContext;
	this.startUserMedia = function() {
		try {
			navigator.getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;
			navigator.getUserMedia({audio: true}, this.mediaCallback, error);
		} catch (e) {
			alert('getUserMedia threw exception :' + e);
		}
	};
	
	this.setRoot = function() {
		this.root = this.currFreq;
	};
	
	this.mediaCallback = function(stream) {
		var context = new audioContext();
		bufferedStream = context.createScriptProcessor(2048, 1, 1);
		volume = context.createGain();
		audioInput = context.createMediaStreamSource(stream);
		audioInput.connect(volume);
		volume.connect(bufferedStream);
		bufferedStream.connect(context.destination);
		console.log("root1"+self.root);

		medianFilter = new MedianFilter();
		bufferedStream.onaudioprocess = function(e) {
			// console.log("root2 " + self.root);
			var data = e.inputBuffer.getChannelData(0);
			// self.pitch.input(data);
			// self.pitch.process();
			// var tone = self.pitch.findTone();
			// console.log("tone " + tone);
			// if (tone === null) {
				// console.log('No tone found!');
			// } else {
				// console.log('Found a tone, frequency:', tone.freq, 'volume:', tone.db);
				// self.currFreq = tone.freq * this.adjustment;
				// console.log(currFreq);
				// pitchtracker = new dywapitchtracker(initial_prevpitch,pitchConfidence);
				// var newFreq = pitchcorrecter(pitchtracker,currFreq);
				// currFreq = newFreq;

				console.log(IntensityFilter.meanAbs(data));
				console.log(IntensityFilter.rootMeanSquare(data));
				var waveletFreq = 0;
				if(IntensityFilter.rootMeanSquare(data) > 0.01) {
					waveletFreq = dywapitch_computepitch(data);
				}
				console.log(medianFilter);
				self.currFreq = medianFilter.process(waveletFreq);
				// self.currFreq = waveletFreq;
				
				var interval = Math.round(1200 * (Math.log(self.currFreq / self.root) / Math.log(2))) / 100;
				if (isInfinity(interval) == "false") {
					self.callback(interval);
				}
			// }
		};
	};
};



// Move to util module
function isInfinity(num) {
	if (num === num+1) {
		return "true";
	} else {
		return "false";
	}
}

function error() {
    alert('Problem with mic input. Try reloading.');
}