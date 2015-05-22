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

        function concatBuffers() {
          console.log(buffArray);
          for(var i=0;i<buffArray.length;i++) {
            (function(index) {
            console.log(index);
            console.log(buffArray.indexOf(buffArray[index]));
            console.log(buffArray[index]);

          })(i);
          }
          var concatenatedArray = new Float32Array(buffArray.length * 256);
          var offset = 0;
          for (var j = 0; j < buffArray.length; j++) {
            (function(buffer) {
            concatenatedArray.set(buffer, offset);
            // console.log(buffer);
            })(buffArray[j]);
            offset += buffArray[j].length;
          }
          var outBuffer = audioContext.createBuffer(1, concatenatedArray.length, audioContext.sampleRate);
          var l = outBuffer.getChannelData(0);
          // console.log(concatenatedArray);
          l.set(concatenatedArray);
          // console.log(l);
          var source = audioContext.createBufferSource();
          source.buffer = outBuffer;
          source.connect(audioContext.destination);
          source.start();
          // display.plotAudioData(l);
        }

        function getPitchData() {
          // console.log(buffArray);
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
          // setTimeout(function() {},5000);
          concatBuffers();
          getPitchData();
          display.plotData(pitchArray);
        };


      });
    });