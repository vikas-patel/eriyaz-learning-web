  define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'recorderworker', 'intensityfilter', './melodyextractor'],
    function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, recorderWorker, IntensityFilter, MelodyExtractor) {
      var audioContext = CurrentAudioContext.getInstance();
      var recBufferSize = 8192;
      var rootFreq = 123.4;
      var numOfNotes = 4;
      var pitchArray = [];
      var volumeArray = [];
      var sangNotes = [];
      var minSpan;
      var options = [{'name':'Re', 'value': 2}, {'name':'Ga', 'value': 4},
                      {'name':'Ma', 'value': 5}, {'name':'None', 'value': -1}];
      var expectedNotes = [{'name':'Sa', 'value': 0}, {'name':'Re', 'value': 2}, {'name':'Ga', 'value': 4},
                      {'name':'Ma', 'value': 5}];

      app.controller('SingSargamCtrl', function($scope, PitchModel, DialModel) {
        $scope.isStarted = false;
        $scope.isPlayReady = false;
        $scope.options = options;
        $scope.showOptions = false;
        var display = new Display();
        $scope.feedback = "Start Mic";
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
              computePitch(e.data.floatarray);
              sangNotes = MelodyExtractor.getMelody(volumeArray, pitchArray, numOfNotes, minSpan);
              console.log(sangNotes);
              findOffTuneNote();
              globalArray = e.data.floatarray;
              $scope.feedback = "Select the first off tune note.";
              $scope.showOptions = true;
              $scope.$apply();
              break;
          }
        };

        function findOffTuneNote() {
            var rootPitch = sangNotes[0].pitch;
            for (var i=1; i<sangNotes.length; i++) {
              var pitch = sangNotes[i].pitch - rootPitch;
              if (pitch != expectedNotes[i].value) {
                $scope.offTuneNote = expectedNotes[i];
                return;
              }
            }
            $scope.offTuneNote = {'name':'None', value: -1};
        }

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

        function computePitch(floatarray) {
          var offset = 0;
          var incr = 64;
          var buffsize = 2048;
          pitchArray = [];
          volumeArray = [];
          var volLast = 0;
          var validPoints = 0;
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
              pitchArray.push(currentInterval);
              validPoints++;
            } else {
                pitchArray.push(Number.NaN);
            }
            volumeArray.push(volume);
            offset = offset + incr;
          }
          minSpan = validPoints/(numOfNotes*4);
        }


        $scope.signalOn = false;
        $scope.mic = function() {
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, recBufferSize);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
                $scope.feedback = "Press 'Record' and Sing 'SaReGaMa'.";
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
          $scope.feedback = "Recording...";
        };
        $scope.stop = function() {
          $scope.isStarted = false;
          concatBuffers();
          $scope.feedback = "";
        };

        $scope.replay = function() {
          playConcatenated(globalArray);
        };

        $scope.checkAnswer = function(value) {
            $scope.total++;
            if (value == $scope.offTuneNote.value) {
                $scope.feedback = "Correct! Off tune note  : " + $scope.offTuneNote.name;
                $scope.correct++;
            } else {
                $scope.feedback = "Oops! Off tune note : " + $scope.offTuneNote.name;
            }
            $scope.showOptions = false;
            display.plotData(pitchArray, sangNotes[0].pitch, sangNotes);
            //display.plotData2(volumeArray, sangNotes);
        };
      });
    });