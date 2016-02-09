define(['wavelet-pitch'], function() {
	var WaveletAlgo = function(sampleRate, isMan) {
		if (isMan) {
			// midi 41
			pitchtracker.minFreq = 87*(44100/sampleRate);
			// midi 61
			pitchtracker.maxFreq = 277*(44100/sampleRate);
		} else {
			// midi 54
			pitchtracker.minFreq = 184*(44100/sampleRate);
			// midi 74
			pitchtracker.maxFreq = 587*(44100/sampleRate);
		}
		this.findPitch = function(data) {
			var raw_pitch = _dywapitch_computeWaveletPitch(data);
			var freq = dynamic_post_process(pitchtracker,raw_pitch);
			freq = freq * (sampleRate/44100);
			return freq;
		};
	};

	// ***********************************
	// the dynamic postprocess
	// ***********************************

	/***
	It states: 
	 - a pitch cannot change much all of a sudden (20%) (impossible humanly,
	 so if such a situation happens, consider that it is a mistake and drop it. 
	 - a pitch cannot double or be divided by 2 all of a sudden : it is an
	 algorithm side-effect : divide it or double it by 2. 
	 - a lonely voiced pitch cannot happen, nor can a sudden drop in the middle
	 of a voiced segment. Smooth the plot. 
	***/
	var pitchtracker = {
		_prevPitch : -1, //dotwashere
		_pitchConfidence : -1
	};

	function dynamic_post_process(pitchtracker, pitch) {
		
		// equivalence
		if (pitch === 0.0) pitch = -1.0;
		
		//
		var estimatedPitch = -1;
		var acceptedError = 0.2;
		var maxConfidence = 5;
		
		if (pitch != -1) {
			// I have a pitch here
			if (pitchtracker._prevPitch == -1) {
				// no previous
				estimatedPitch = pitch;
				pitchtracker._prevPitch = pitch;
				pitchtracker._pitchConfidence = 1;
				
			} else if (Math.abs(pitchtracker._prevPitch - pitch)/pitch < acceptedError) {
				// similar : remember and increment pitch
				pitchtracker._prevPitch = pitch;
				estimatedPitch = pitch;
				pitchtracker._pitchConfidence = Math.min(maxConfidence, pitchtracker._pitchConfidence + 1); // maximum 3
				
			} else if ((pitchtracker._pitchConfidence >= maxConfidence-2) && Math.abs(pitchtracker._prevPitch - 2*pitch)/(2*pitch) < acceptedError) { //dotwashere 2
				// close to half the last pitch, which is trusted
				estimatedPitch = 2*pitch; //dotwashere
				pitchtracker._prevPitch = estimatedPitch;
				
			} else if ((pitchtracker._pitchConfidence >= maxConfidence-2) && Math.abs(pitchtracker._prevPitch - 0.5*pitch)/(0.5*pitch) < acceptedError) {
				// close to twice the last pitch, which is trusted
				estimatedPitch = 0.5*pitch;
				pitchtracker._prevPitch = estimatedPitch;
				
			} else {
				if (pitchtracker._pitchConfidence > maxConfidence-2) {
					// previous trusted : keep previous
					estimatedPitch = pitchtracker._prevPitch;
					pitchtracker._pitchConfidence = Math.max(0, pitchtracker._pitchConfidence - 1);
				} else if (pitch < pitchtracker.maxFreq && pitch > pitchtracker.minFreq) {
					estimatedPitch = pitch;
					pitchtracker._prevPitch = pitch;
					pitchtracker._pitchConfidence = 1;
				} else {
					estimatedPitch = pitchtracker._prevPitch;
					pitchtracker._pitchConfidence = Math.max(0, pitchtracker._pitchConfidence - 1);
				}
			}
			//console.log(Math.floor(pitch/10)*10 + " " + Math.floor(estimatedPitch/10)*10);
		} else {
			// no pitch now
			if (pitchtracker._prevPitch != -1) {
				// was pitch before
				if (pitchtracker._pitchConfidence >= 1) {
					// continue previous
					estimatedPitch = pitchtracker._prevPitch;
					pitchtracker._pitchConfidence = Math.max(0, pitchtracker._pitchConfidence - 1);
				} else {
					pitchtracker._prevPitch = -1;
					estimatedPitch = -1; //dotwashere
					pitchtracker._pitchConfidence = 0;
				}
			}
		}
		
		// put "_pitchConfidence="&pitchtracker._pitchConfidence
		if (pitchtracker._pitchConfidence >= 1) {
			// ok
			pitch = estimatedPitch;
		} else {
			pitch = -1;
		}
		
		// equivalence
		if (pitch == -1) pitch = 0.0;
		
		return pitch;
	}

	return {
		getDetector: function(sampleRate, isMan) {
			return new WaveletAlgo(sampleRate, isMan);
		}
	};
});