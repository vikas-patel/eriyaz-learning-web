define(['jquery', './dial', 'mic', 'audiobuffer', 'fft-pitch', 'webaudio-tools', './tone'], function($, Dial, MicUtil, AudioBuffer) {
    var adjustment = 1.088; //pitch adjustment to pitch.js determined pitch(incorrect by itself.)
    var labels1 = ["P1", "m2", "M2", "m3", "M3", "P4", "TR", "P5", "m6", "M6", "m7", "M7", "P1"];
    var labels2 = ["Sa", "Re'", "Re", "Ga'", "Ga", "Ma", "Ma''", "Pa", "Dha'", "Dha", "Ni'", "Ni", "Sa"];
    var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni", "Sa"];
    var labelsWestern = ["1", "2b", "2", "3b", "3", "4", "4#/5b", "5", "6b", "6", "7b", "7", "1"];

    //state variables. 
    var root = 110;
    var currInterval; //in semitones
    var currFreq;

    //other globals;
    var audioContext;
    var pitch;

    var dial;

    var init = function() {
        initAudio();
        pitch = new PitchAnalyzer(44100);
        WebAudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new WebAudioContext();

        dial = Dial.getDial("dial", labelsIndian);
        //attach events
        document.getElementById('labelSystem').onchange = changed;
        document.getElementById('setRoot').onclick = setRoot;
        document.getElementById('playRoot').onclick = playRoot;
    };

    var main = function() {
        dial.draw();
        MicUtil.getMicAudioStream(
            function(stream) {
                buffer = new AudioBuffer(audioContext, stream, 2048); 
                buffer.addProcessor(updatePitch); 
            }
        );
    };


    $(document).ready(function() {
        init();
        main();
    });


    function changed() {
        var labels = labelsIndian;
        var labelSystem = document.getElementById('labelSystem').value;
        if (labelSystem === 'western') {
            labels = labelsWestern;
        }
        dial.setLabels(labels);
    }

    function updatePitch(data) {
        pitch.input(data);
        pitch.process();
        var tone = pitch.findTone();
        if (tone === null) {
            console.log('No tone found!');
        } else {
            console.log('Found a tone, frequency:', tone.freq, 'volume:', tone.db);
            currFreq = tone.freq * adjustment;
            currInterval = Math.round(1200 * (Math.log(currFreq / root) / Math.log(2))) / 100;
            dial.setValue(currInterval);
        }
    }

    function setRoot() {
        root = currFreq;
    }

    function playRoot() {
        var playTime = 1000;
        startTone(root);
        setTimeout(
            function() {
                stopTone();
            }, playTime);
    }

});