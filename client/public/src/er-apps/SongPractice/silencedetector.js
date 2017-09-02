define([],function() {

    var noteSegmenter = function(pitches, samplingRate) {
        var notes = [];
        var tolerance = 0.5;
        var buffer = 128;
        var interval = buffer*1000/samplingRate; //ms
        var minDuration = 100; //ms
        var start = 0;
        var avg = pitches[0];
        for (var i = 1; i < pitches.length; i++) {
            if (Math.abs(pitches[i] - avg) > tolerance) {
                if ((i-start)*interval > minDuration) {
                    notes.push([avg, start, i-1]);
                }
                avg = pitches[i];
                start = i;
            } else {
                avg = (avg * (i-start) + pitches[i])/(i+1-start);
            }
        }
        console.log(notes);
        return notes;
    }

	var silenceDetector = function (originalSignal, samplingRate) {
		// for identifying each sample whether it is voiced or unvoiced
        var voiced = new Array(originalSignal.length);
        var samplePerFrame = 512;
        firstSamples = samplePerFrame * 20;// according to formula
        var silenceThreshold = 0.3;
        var unvoicedThreshold = 0.6;
        var sum = 0;
        var sd = 0.0;
        var m = 0.0;
        // 1. calculation of mean
        for (var i = 0; i < firstSamples; i++) {
            sum += originalSignal[i];
        }
        m = sum / firstSamples;// mean
        sum = 0;// reuse var for S.D.

        // 2. calculation of Standard Deviation
        for (var i = 0; i < firstSamples; i++) {
            sum += Math.pow((originalSignal[i] - m), 2);
        }
        sd = Math.sqrt(sum / firstSamples);
        // 3. identifying one-dimensional Mahalanobis distance function
        // i.e. |x-u|/s greater than ####3 or not,
        for (var i = 0; i < originalSignal.length; i++) {
            distance = Math.abs(originalSignal[i] - m) / sd;
            if (distance > 3.0) { //0.3 =THRESHOLD.. adjust value yourself
                voiced[i] = 2;
            } else if (distance > 1.0) {
                voiced[i] = 1;
            } else {
                voiced[i] = 0;
            }
        }
        // 4. calculation of voiced and unvoiced signals
        // mark each frame to be voiced or unvoiced frame
        var frameCount = 0;
        var count_voiced = 0;
        var count_unvoiced = 0;
        var count_silence = 0;
        var avg = 0;
        var voicedFrame = new Array(Math.ceil(originalSignal.length / samplePerFrame));
        // the following calculation truncates the remainder
        var loopCount = originalSignal.length - (originalSignal.length % samplePerFrame);
        for (var i = 0; i < loopCount; i += samplePerFrame) {
            count_voiced = 0;
            count_unvoiced = 0;
            count_silence = 0;
            for (var j = i; j < i + samplePerFrame; j++) {
                if (voiced[j] == 2) {
                    count_voiced++;
                } else if (voiced[j] == 1) {
                    count_unvoiced++;
                } else {
                    count_silence++;
                }
            }

            if (count_voiced > count_unvoiced && count_voiced > count_silence) {
                voicedFrame[frameCount++] = 2;
            } else if (count_unvoiced > count_voiced && count_unvoiced > count_silence) {
                voicedFrame[frameCount++] = 1;
            } else {
                voicedFrame[frameCount++] = 0;
            }
        }
        console.log(voicedFrame);
        return voicedFrame;

	}

	return noteSegmenter;
});