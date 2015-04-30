define(['music-calc','./problem'], function(MusicCalc,Problem) {
     var Problem = function(freqs, note1, note2) {
        this.freqs = freqs;
        this.note1 = note1;
        this.note2 = note2;

        this.isUp = function() {
            if (freqs[note2] > freqs[note1])
                return true;
            else
                return false;
        };

        this.isDown = function() {
            if (freqs[note2] < freqs[note1])
                return true;
            else
                return false;
        };

        this.isSame = function() {
            var centDiff = Math.floor(1200 * (Math.log(freqs[note2] / freqs[note1]) / Math.log(2)));
            if (Math.abs(centDiff) <= 20)
                return true;
            else return false;
        };
    };

    return Problem;

});