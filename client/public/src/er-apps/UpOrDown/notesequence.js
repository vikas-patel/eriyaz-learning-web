define(['melody', 'note', 'webaudioplayer', 'currentaudiocontext'], function(Melody, Note, Player, CurrentAudioContext) {
    var middleCFreq = 261;
    var octaves = 2;
    var audioContext = CurrentAudioContext.getInstance();
    var player = new Player(audioContext);

    function NoteSequence(freqs) {
        this.freqs = freqs;

        this.play = play;
        this.isUp = isUp;
        this.isDown = isDown;
        this.isSame = isSame;


        function play() {
            var melody = new Melody();
            for (var i = 0; i < freqs.length; i++) {
                melody.addNote(Note.createFromFreq(freqs[i]), 1000);
            }
            player.playMelody(melody);
        }

        function isUp(index1, index2) {
            if (freqs[index2] > freqs[index1])
                return true;
            else
                return false;
        }

        function isDown(index1, index2) {
            if (freqs[index2] < freqs[index1])
                return true;
            else
                return false;
        }

        function isSame(index1, index2) {
            var centDiff = Math.floor(1200 * (Math.log(freqs[index2] / freqs[index1]) / Math.log(2)));
            if (Math.abs(centDiff) <= 50)
                return true;
            else return false;
        }
    }

    NoteSequence.getRandomSequence = function(length) {
        var freqGen = new RandomFreqGen();
        var freqs = [];
        for (var i = 0; i < length; i++) {
            freqs[i] = freqGen.getRandomFreq();
        }
        return new NoteSequence(freqs);
    };

    function RandomFreqGen() {
        this.getRandomFreq = getRandomFreq;

        function getRandomFreq() {
            return middleCFreq * Math.pow(2, getRandomCents() / 1200);
        }

        function getRandomCents() {
            return (Math.floor(Math.random() * octaves * 1200) - octaves * 1200 / 2);
        }
    }
    return NoteSequence;
});