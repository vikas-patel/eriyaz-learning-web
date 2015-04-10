define([], function() {
    FrequencyUtil = function() {};
    FrequencyUtil.getRandomCents = function(range) {
        return Math.floor(Math.random() * range - range / 2);
    };
    FrequencyUtil.getFreq = function(baseFreq, cents) {
        return baseFreq * Math.pow(2, cents / 1200);
    };
    FrequencyUtil.getFreqsArray = function(baseFreq, centsArray) {
        var freqs = [];
        freqs[0] = baseFreq;
        for (var i = 1; i < centsArray.length; i++) {
            freqs[i] = FrequencyUtil.getFreq(freqs[0], centsArray[i]);
        }
        return freqs;
    };

    FrequencyUtil.getCentsArray = function(baseFreq, freqsArray) {
        var cents = [];
        cents[0] = 0;
        for (var i = 1; i < freqsArray.length; i++) {
            cents[i] = FrequencyUtil.getCents(baseFreq, freqsArray[i]);
        }
        return cents;
    };

    FrequencyUtil.getCents = function(freq1, freq2) {
        return Math.floor(1200 * (Math.log(freq2 / freq1) / Math.log(2)));
    };

    return FrequencyUtil;
});