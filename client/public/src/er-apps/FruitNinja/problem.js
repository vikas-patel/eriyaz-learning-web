define(['music-calc', 'webaudioplayer', 'currentaudiocontext'], function(MusicCalc, Player, CurrentAudioContext) {
    function Problem(note_diff) {
        this.playTime = 500;
        this.lastNote = 261;
        this.note_diff = note_diff;
        var audioContext = CurrentAudioContext.getInstance();
        this.player = new Player(audioContext);
    };

    Problem.prototype.next = function() {
        this.currentNote = MusicCalc.getFreq(this.lastNote, getRandomCents(this.note_diff.min, this.note_diff.max));
        // range C1-C7 (32-2100)
        // reset
        if (this.currentNote < 32 || this.currentNote > 2093) this.currentNote = 261;
        if (this.currentNote > this.lastNote){
            this.isUp = true;
        } else {
            this.isUp = false;
        }
        // play note
        this.player.playNote(this.currentNote, this.playTime);
        this.lastNote = this.currentNote;
    };

    Problem.prototype.play = function(delay) {
        this.player.playNote(this.lastNote, this.playTime, delay);
    }

    function getRandomCents(min, max) {
        var randomSign = 1;
        if (Math.random() < 0.5) {
            randomSign = -1;
        }
        return randomSign * (Math.floor(Math.random() * (max - min)) + min);
    }
    var instance;
    return {
        getInstance: function (note_diff) {
            if (note_diff) {
                instance = new Problem(note_diff);
            }
            return instance;
        }
    };

});