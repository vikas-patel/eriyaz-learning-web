define(['music-calc','./problem'], function(MusicCalc,Problem) {
    var ProblemGen = function() {
        var middleCFreq = 261;
        var octaves = 2;
        var otherIntervalsRange = [0, 700];

        this.getNewProblem = function(level) {
            var freqs = new Array(level.numNotes);
            var mainFreq = MusicCalc.getFreq(middleCFreq, getRandomCents(0, 1200));
            for (var i = 0; i < freqs.length; i++) {
                if (i === (level.testNotes[0] - 1)) {
                    freqs[i] = mainFreq;
                } else if (i === (level.testNotes[1] - 1)) {
                    freqs[i] = MusicCalc.getFreq(mainFreq,
                        getRandomCents(level.interval[0],
                            level.interval[1]
                        ));
                } else {
                    freqs[i] = mainFreq;
                }
            }

            return new Problem(freqs,level.testNotes[0] - 1,level.testNotes[1] - 1);
        };


        function getRandomCents(min, max) {
            var randomSign = 1;
            if (Math.random() < 0.5) {
                randomSign = -1;
            }
            return randomSign * (Math.floor(Math.random() * (max - min)) + min);
        }
    };

    return new ProblemGen();
});