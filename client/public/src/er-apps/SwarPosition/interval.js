define(['melody', 'note', 'webaudioplayer', 'currentaudiocontext'], function(Melody, Note, Player, CurrentAudioContext) {
    var audioContext = CurrentAudioContext.getInstance();
    var player = new Player(audioContext);

    var Interval = function(freq1, freq2, octaves) {
        this.freq1 = freq1;
        this.freq2 = freq2;
        this.octaves = octaves;

        this.play = function() {
            var playTime = 1000;
            var melody = new Melody();
            melody.addNote(Note.createFromFreq(this.freq1, playTime));
            melody.addNote(Note.createFromFreq(this.freq2, playTime));
            player.playMelody(melody);
        };


        this.getCents = function() {
            return Math.floor(1200 * (Math.log(this.freq2 / this.freq1) / Math.log(2)));
        };

    };

    return Interval;
});