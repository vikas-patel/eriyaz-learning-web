/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var middleCFreq = 261;

function NoteSequence(freqs) {
    this.freqs = freqs;
    this.getIntervals = getIntervals;

    this.play = play;

    function play() {
        var playTime = 500;
        for (var i = 0; i < freqs.length; i++) {
            (function(index) {
                setTimeout(function() {
                    startTone(freqs[index]);
                }, playTime * index);
                setTimeout(function() {
                    stopTone();
                }, playTime * (index + 1));
            })(i);
        }
    }

    function getIntervals() {
        var centsArray = new Array();
        for(var i=0;i<freqs.length;i++) {
            centsArray.push(FrequencyUtil.getCents(freqs[0],freqs[i]));
        }
        return centsArray;
    }
}

NoteSequence.getRandomSequence = function(length) {
    var freqs = new Array();
    freqs[0] = FrequencyUtil.getFreq(middleCFreq, FrequencyUtil.getRandomCents(1200));
    for (var i = 1; i < length; i++) {
        freqs[i] = FrequencyUtil.getFreq(freqs[0], FrequencyUtil.getRandomCents(2400));
    }
    return new NoteSequence(freqs);
};

FrequencyUtil = function() {
};
FrequencyUtil.getRandomCents = function(range) {
    return Math.floor(Math.random() * range - range / 2);
};
FrequencyUtil.getFreq = function(baseFreq, cents) {
    return baseFreq * Math.pow(2, cents / 1200);
};
FrequencyUtil.getFreqsArray = function(baseFreq, centsArray) {
    var freqs = new Array();
    freqs[0] = baseFreq;
    for (var i = 1; i < centsArray.length; i++) {
        freqs[i] = FrequencyUtil.getFreq(freqs[0], centsArray[i]);
    }
    return freqs;
};
FrequencyUtil.getCents = function(freq1, freq2) {
    return Math.floor(1200 * (Math.log(freq2 / freq1) / Math.log(2)));
};

ChartUtil = function() {
};
ChartUtil.dataToSeries = function(data) {
    var series = new Array();
    for (var i = 0; i < data.length; i++) {
        series.push([i + 1, data[i]]);
    }
    return series;
};

ChartUtil.seriesToData = function(series) {
    var data = new Array();
    for (var i = 0; i < series.length; i++) {
        data.push(series[i][1]);
    }
    return data;
};

ChartUtil.getZeroSeries = function(length) {
    var series = new Array();
    for (var i = 0; i < length; i++) {
        series.push([i + 1, 0]);
    }
    return series;
};


Util = function() {
};
Util.multiplyArray = function(myArray,multiplier) {
    var retArray = new Array();
    for(var i=0;i<myArray.length;i++) {
        retArray.push(multiplier * myArray[i]);
    }  
    return retArray;
};