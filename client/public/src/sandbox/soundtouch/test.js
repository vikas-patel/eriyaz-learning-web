var t = new RateTransposer(true);
var s = new Stretch(true);
var st= new SoundTouch();
st.pitch =0.8;
st.tempo = 1;
// s.tempo = .5;
// t.rate = 3;
var context = new webkitAudioContext();

var buffer;

loadSample = function(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        console.log('url loaded');
        // createBuffer(request.response);
        context.decodeAudioData(request.response, function(theBuffer) {
            console.log(theBuffer);
            buffer = theBuffer;
        }, function(){console.log('could not load audio');});
    }

    console.log('reading url');
    request.send();
}

// function createBuffer(arrayBuffer) {
//     offset = 0;
//     startTime = 0;
//     var start = new Date();
//     // NOTE the second parameter is required, or a TypeError is thrown
//     buffer = context.createBuffer(arrayBuffer, false,context.sampleRate);
//     console.log('loaded audio in ' + (new Date() - start));
// }

//loadSample('badromance.mp3')
loadSample('sa.mp3')

var BUFFER_SIZE = 16384;

var node = context.createScriptProcessor(BUFFER_SIZE, 2, 2);

var samples = new Float32Array(BUFFER_SIZE * 2);

node.onaudioprocess = function(e) {
    var l = e.outputBuffer.getChannelData(0);
    var r = e.outputBuffer.getChannelData(1);
    var framesExtracted = f.extract(samples, BUFFER_SIZE);
    if (framesExtracted == 0) {
        pause();
    }
    for (var i = 0; i < framesExtracted; i++) {
        l[i] = samples[i * 2];
        r[i] = samples[i * 2 + 1];
    }
};

function play() {
    node.connect(context.destination);
}

function pause() {
    node.disconnect();
}

var source = {
    extract: function(target, numFrames, position) {
        var l = buffer.getChannelData(0);
        // var r = buffer.getChannelData(1);
        for (var i = 0; i < numFrames; i++) {
            target[i * 2] = l[i + position];
            target[i * 2 + 1] = l[i + position];
        }
        return Math.min(numFrames, l.length - position);
    }
};


f = new SimpleFilter(source, st);

play();
// f.sourcePosition(0);
// st.clear();
// console.log(f.sourcePosition);

setInterval(function(){f.clear(); }, 3000);