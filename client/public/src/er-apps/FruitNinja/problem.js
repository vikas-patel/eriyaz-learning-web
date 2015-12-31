define(['music-calc', 'webaudioplayer', 'currentaudiocontext'], function(MusicCalc, Player, CurrentAudioContext) {
    function Problem(level) {
        this.playTime = 500;
        this.lastNote = 261;
        var audioContext = CurrentAudioContext.getInstance();
        this.player = new Player(audioContext);
    };

    Problem.prototype.next = function() {
        this.currentNote = MusicCalc.getFreq(this.lastNote, getRandomCents(900, 1200));
        // range C1-C7 (32-2100)
        // reset
        if (this.currentNote < 32 || this.currentNote > 2093) this.currentNote = 261;
        console.log("currentNote:"+this.currentNote);
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
        getInstance: function () {
            if (!instance) {
                instance = new Problem();
            }
            return instance;
        }
    };

});