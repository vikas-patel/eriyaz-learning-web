define(['music-calc', 'webaudioplayer'], function(MusicCalc, Player) {
    var middleCFreq = 261;
    function Problem(level) {
        this.playTime = 500;
        this.note1 = MusicCalc.getFreq(middleCFreq, getRandomCents(0, 1200));
        this.note2 = MusicCalc.getFreq(middleCFreq, getRandomCents(0, 1200));
    };

    // Problem.prototype.play = function() {
    //     Player.playNote(this.note1, playTime);
    //     Player.playNote(this.note2, playTime, playTime);
    // };

    Problem.prototype.isUp = function() {
        if (this.note2 > this.note1) return true;
        else return false;
    };

    function getRandomCents(min, max) {
        var randomSign = 1;
        if (Math.random() < 0.5) {
            randomSign = -1;
        }
        return randomSign * (Math.floor(Math.random() * (max - min)) + min);
    }

    return Problem;

});