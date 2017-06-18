  define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'recorderworker'],
    function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, recorderWorker) {
      var audioContext = CurrentAudioContext.getInstance();
      var isStarted = false;
      var recBufferSize = 8192;

      app.controller('FreestylePhrasesCtrl', function($scope, PitchModel, DialModel) {
        var display = new Display();
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var updatePitch = function(data) {
          if (isStarted) {
            recorderWorker.postMessage({
              command: 'record',
              floatarray: data
            });
          }
        };

        function concatBuffers() {
          recorderWorker.postMessage({
            command: 'concat'
          });
        }

        recorderWorker.onmessage = function(e) {
          switch (e.data.command) {
            case 'concat':
              computePitchGraph(e.data.floatarray);
              playConcatenated(e.data.floatarray);
              globalArray = e.data.floatarray;
              break;
          }
        };

        function playConcatenated(floatarray) {
          var concatenatedArray = floatarray;
          var outBuffer = audioContext.createBuffer(1, concatenatedArray.length, audioContext.sampleRate);
          var l = outBuffer.getChannelData(0);
          // console.log(concatenatedArray);
          l.set(concatenatedArray);
          // console.log(l);
          var source = audioContext.createBufferSource();
          source.buffer = outBuffer;
          source.connect(audioContext.destination);
          source.start();
          display.playAnimate(Math.round(floatarray.length * 1000 / audioContext.sampleRate));

        }

        function computePitchGraph(floatarray) {
          var offset = 0;
          var incr = 16;
          var buffsize = 2048;
          var pitchArray = [];
          while (offset + buffsize < floatarray.length) {
            var subarray = new Float32Array(buffsize);
            for (var i = 0; i < buffsize; i++) {
              subarray[i] = floatarray[offset + i];
            }
            // floatarray.subarray(offset,offset+buffsize);
            var pitch = detector.findPitch(subarray);
            if (pitch !== 0) {
              PitchModel.currentFreq = pitch;
              PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
              pitchArray.push(PitchModel.currentInterval);
            } else pitchArray.push(-100);
            offset = offset + incr;
          }
          display.plotData(pitchArray);
        }


        $scope.signalOn = false;
        $scope.startMic = function() {
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, recBufferSize);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
              }
            );
          }

        };

        $scope.start = function() {
          recorderWorker.postMessage({
            command: 'clear'
          });
          display.clear();
          isStarted = true;
        };
        $scope.stop = function() {
          isStarted = false;
          concatBuffers();
        };

        $scope.replay = function() {
          playConcatenated(globalArray);
        };
      });
    });