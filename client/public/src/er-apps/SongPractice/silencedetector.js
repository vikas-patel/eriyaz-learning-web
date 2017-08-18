define([],function() {

	var silenceDetector = function (originalSignal, samplingRate) {
		// for identifying each sample whether it is voiced or unvoiced
        var voiced = new Float32Array(originalSignal.length);
        var samplePerFrame = 512;
        firstSamples = samplePerFrame * 200;// according to formula
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
            if ((Math.abs(originalSignal[i] - m) / sd) > 0.3) { //0.3 =THRESHOLD.. adjust value yourself
                voiced[i] = 1;
            } else {
                voiced[i] = 0;
            }
        }
        // 4. calculation of voiced and unvoiced signals
        // mark each frame to be voiced or unvoiced frame
        var frameCount = 0;
        var usefulFramesCount = 1;
        var count_voiced = 0;
        var count_unvoiced = 0;
        var voicedFrame = new Array(Math.ceil(originalSignal.length / samplePerFrame));
        // the following calculation truncates the remainder
        var loopCount = originalSignal.length - (originalSignal.length % samplePerFrame);
        for (var i = 0; i < loopCount; i += samplePerFrame) {
            count_voiced = 0;
            count_unvoiced = 0;
            for (var j = i; j < i + samplePerFrame; j++) {
                if (voiced[j] == 1) {
                    count_voiced++;
                } else {
                    count_unvoiced++;
                }
            }
            if (count_voiced > count_unvoiced) {
                usefulFramesCount++;
                voicedFrame[frameCount++] = 1;
            } else {
                voicedFrame[frameCount++] = 0;
            }
        }
        return voicedFrame;

	}

	return silenceDetector;
});