  define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'recorderworker', 'intensityfilter', './melodyextractor'],
    function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, recorderWorker, IntensityFilter, MelodyExtractor) {
      var audioContext = CurrentAudioContext.getInstance();
      var recBufferSize = 8192;
      var rootFreq = 123.4;
      var numOfNotes = 4;

      app.controller('SingSargamCtrl', function($scope, PitchModel, DialModel) {
        $scope.isStarted = false;
        $scope.isPlayReady = false;
        var display = new Display();
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var updatePitch = function(data) {
          if ($scope.isStarted) {
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
              $scope.isPlayReady = true;
              $scope.$apply();
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
          var incr = 64;
          var buffsize = 2048;
          var pitchArray = [];
          var volumeArray = [];
          var volLast = 0;
          while (offset + buffsize < floatarray.length) {
            var subarray = new Float32Array(buffsize);
            for (var i = 0; i < buffsize; i++) {
              subarray[i] = floatarray[offset + i];
            }
            // floatarray.subarray(offset,offset+buffsize);
            var pitch = detector.findPitch(subarray);
            var volume = IntensityFilter.rootMeanSquare(subarray);
            if (pitch !== 0) {
              currentInterval = MusicCalc.getCents(rootFreq, pitch) / 100;
              pitchArray.push(Math.round(currentInterval));
            } else {
                pitchArray.push(Number.NaN);
            }
            volumeArray.push(volume);
            offset = offset + incr;
          }
          display.plotData(pitchArray);
          var returnArray = MelodyExtractor.getMelody(volumeArray, pitchArray, numOfNotes);
          display.plotData2(volumeArray, returnArray);
        }


        $scope.signalOn = false;
        $scope.mic = function() {
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, recBufferSize);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
                $scope.$apply();
              }
            );
          }

        };

        $scope.start = function() {
          recorderWorker.postMessage({
            command: 'clear'
          });
          display.clear();
          $scope.isStarted = true;
        };
        $scope.stop = function() {
          $scope.isStarted = false;
          concatBuffers();
        };

        $scope.replay = function() {
          playConcatenated(globalArray);
        };
      });
    });