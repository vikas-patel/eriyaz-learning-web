  define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc'],
    function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc) {
      var audioContext = CurrentAudioContext.getInstance();
      var pitchArray = [];
      var isStarted = false;
      var count = 0;
      var buffArray = [];

      app.controller('FreestylePhrasesCtrl', function($scope, PitchModel, DialModel) {
        var display = new Display();
        var detector = PitchDetector.getDetector('fft', audioContext.sampleRate);
        var updatePitch = function(data) {
          if (isStarted) {
            // console.log('updatePitch');
            buffArray.push(data);
            // if (count < 8) {
            //   count++;

            // } else {
            //   buffArray.shift();
            // }

          }
        };

        function getPitchData() {
          console.log(buffArray);
          for (var j = 0; j < buffArray.length - 8; j++) {
            (function(idxj) {
              // console.log(idxj);
              var combBuffer = new Float32Array(2048);
              for (var i = 0; i < 8; i++) {
                (function(idxi) {
                  combBuffer.set(buffArray[idxj + idxi], idxi * 256);
                })(i);
                // combBuffer.set(buffArray[j + i], i * 256);
              }
              // console.log(combBuffer);
              var pitch = detector.findPitch(combBuffer);
              if (pitch !== 0) {
                PitchModel.currentFreq = pitch;
                PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
              }
              pitchArray.push(PitchModel.currentInterval);
            })(j);

          }

        }

        $scope.signalOn = false;
        $scope.startMic = function() {
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, 256);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
              }
            );
          }
        };

        $scope.start = function() {
          display.clear();
          pitchArray = [];
          isStarted = true;
          count = 0;
          buffArray = [];
        };
        $scope.stop = function() {
          isStarted = false;
          getPitchData();
          display.plotData(pitchArray);
        };


      });
    });