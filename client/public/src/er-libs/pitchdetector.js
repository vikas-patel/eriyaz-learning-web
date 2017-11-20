define(['intensityfilter', 'yin-pitch','wavelet-pitch', 'fft-pitch'], function(IntensityFilter, yinPitch) {
	var WaveletAlgo = function(sampleRate) {
		this.findPitch = function(data) {
			var freq = 0;
			if (IntensityFilter.rootMeanSquare(data) > 0.01) {
				freq = dywapitch_computepitch(data);
				freq = freq * (sampleRate/44100);
			}
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

	var yinAlgo = function(sampleRate) {
		this.findPitch = function(data) {
			if (IntensityFilter.rootMeanSquare(data) > 0.01) {
				freqAndProb = yinPitch(data);
				if (!freqAndProb) return null;
				freqAndProb[0] = freqAndProb[0] * (sampleRate/44100);
				// console.log(freqAndProb);
				return freqAndProb;
			}
			return null;
		}
	};

	return {
		getDetector: function(algo, sampleRate) {
			if (algo === 'wavelet') {
				return new WaveletAlgo(sampleRate);
			} else if (algo === 'yin') {
				return new yinAlgo(sampleRate);
			} 
			else return new FftAlgo(sampleRate);
		}
	};
});