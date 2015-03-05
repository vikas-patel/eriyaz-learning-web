define(['intensityfilter','wavelet-pitch', 'fft-pitch'], function(IntensityFilter) {
	var WaveletAlgo = function(sampleRate) {
		this.findPitch = function(data) {
			var freq = 0;
			if (IntensityFilter.rootMeanSquare(data) > 0.01) {
				freq = dywapitch_computepitch(data);
			}
			freq = freq * (sampleRate/44100);
			return freq;
		};
	};

	var FftAlgo = function(sampleRate) {
		this.pitchAnalyzer = new PitchAnalyzer();
		this.findPitch = function(data) {
			this.pitchAnalyzer.input(data);
			this.pitchAnalyzer.process();
			var tone = this.pitchAnalyzer.findTone();
			if (tone === null) {
				// console.log('No tone found!');
				return 0;
			} else {
				// console.log('Found a tone, frequency:', tone.freq, 'volume:', tone.db);
				return tone.freq * (sampleRate/44100);
			}
		};
	};

	return {
		getDetector: function(algo, sampleRate) {
			if (algo === 'wavelet') {
				return new WaveletAlgo(sampleRate);
			} else return new FftAlgo(sampleRate);
		}
	};
});