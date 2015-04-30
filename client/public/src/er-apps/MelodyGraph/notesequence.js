define(['./frequencyutil'], function(FrequencyUtil) {
    var middleCFreq = 261;

    function NoteSequence(freqs) {
        this.freqs = freqs;
        this.getIntervals = getIntervals;

        this.play = play;

        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);

        function getIntervals() {
            var centsArray = [];
            for (var i = 0; i < freqs.length; i++) {
                centsArray.push(FrequencyUtil.getCents(freqs[0], freqs[i]));
            }
            return centsArray;
        }
    }

    NoteSequence.getRandomSequence = function(length) {
        var freqs = [];
        freqs[0] = FrequencyUtil.getFreq(middleCFreq, FrequencyUtil.getRandomCents(1200));
        for (var i = 1; i < length; i++) {
            freqs[i] = FrequencyUtil.getFreq(freqs[0], FrequencyUtil.getRandomCents(2400));
        }
        return new NoteSequence(freqs);
    };

    return NoteSequence;
});