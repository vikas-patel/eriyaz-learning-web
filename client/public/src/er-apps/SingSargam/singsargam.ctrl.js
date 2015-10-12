  define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'recorderworker', 'intensityfilter', './melodyextractor', './levels'],
    function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, recorderWorker, IntensityFilter, MelodyExtractor, levels) {
      var audioContext = CurrentAudioContext.getInstance();
      var recBufferSize = 8192;
      var rootFreq = 123.4;
      var numOfNotes = 4;
      var pitchArray = [];
      var volumeArray = [];
      var sangNotes = [];
      var minSpan;
      var expectedNotes = [{'name':'Sa', 'value': 0}, {'name':'Re', 'value': 2}, {'name':'Ga', 'value': 4},
                      {'name':'Ma', 'value': 5}];
      
      app.controller('SingSargamCtrl', function($scope, PitchModel, DialModel) {
        $scope.isStarted = false;
        $scope.isPlayReady = false;
        $scope.showOptions = false;
        var display = new Display($scope);
        $scope.feedback = "Start Mic";
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        $scope.count = 0;
        $scope.right = 0;
        $scope.levels = levels;
        $scope.level = levels[0];
        numOfNotes = levels[0].notes.length;
        $scope.noteLabelMap = {0:"Sa", 2:"Re", 4:"Ga", 5:"Ma", 7:"Pa", 9:"Dha", 11:"Ni", 12:"Sa"};


        $scope.$watch('level', function() {
            numOfNotes = $scope.level.notes.length;
        });

        $scope.$watch('count', function() {
            if ($scope.count == $scope.level.total) {
                // Display score & save
                $scope.score = $scope.right / $scope.count;
                $scope.showOverlay = true;
                ScoreService.save("SargamTuner", $scope.level.name, $scope.score);
            }
        });

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
            console.log(sangNotes);
            for (var i=1; i<sangNotes.length; i++) {
              var pitch = sangNotes[i].pitch - rootPitch;
              if (pitch < 0) pitch +=12;
              if (Math.round(pitch) != $scope.level.notes[i]) {
                $scope.offTuneNote = $scope.level.notes[i];
                return;
              }
            }
            $scope.offTuneNote = -1;
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
              currentInterval = Math.round(MusicCalc.getCents(rootFreq, pitch)) / 100;
              pitchArray.push(currentInterval);
              validPoints++;
            } else {
                pitchArray.push(Number.NaN);
            }
            volumeArray.push(volume);
            offset = offset + incr;
          }
          minSpan = validPoints/(numOfNotes*3);
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
          $scope.feedback = "Sing " + noteLabels() + "\nRecording...";
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
            $scope.count++;
            console.log("offTuneNote:"+$scope.offTuneNote);
            var offTuneNoteLabel = $scope.offTuneNote == -1 ? "None": $scope.noteLabelMap[$scope.offTuneNote];
            if (value == $scope.offTuneNote) {
                $scope.feedback = "Correct! Off tune note  : " + offTuneNoteLabel;
                $scope.right++;
            } else {
                $scope.feedback = "Oops! Off tune note : " + offTuneNoteLabel;
            }
            $scope.showOptions = false;
            display.plotData(pitchArray, sangNotes[0].pitch, sangNotes);
            //display.plotData2(volumeArray, sangNotes);
        };

        $scope.closeOverlay = function() {
            $scope.showOverlay = false;
            resetScore();
        };

        function resetScore() {
            $scope.count = 0;
            $scope.right = 0;
        }

        function noteLabels() {
            return _.reduce($scope.level.notes, function(memo, num){ return memo + $scope.noteLabelMap[num]; }, "");
        }
      });
    });