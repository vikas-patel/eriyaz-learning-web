  define(['./module', './main-display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', './stabalizer-view', 'stabilitydetector', 'tanpura'],
    function(app, MainDisplay, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, StabalizerView, StabilityDetector, Tanpura) {
      var audioContext = CurrentAudioContext.getInstance();
      var player = new WebAudioPlayer(audioContext);

      app.controller('SwarMasteryCtrl', function($scope, PitchModel) {
        var mainDisplay = new MainDisplay();
        var stabView = new StabalizerView();
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
        var playDuration = 1000;
        var tanpura = null;
        var rootNote;
        var problemInterval;

        var updatePitch = function(data) {
          var pitch = detector.findPitch(data);
          if (pitch !== 0) {
            PitchModel.currentFreq = pitch;
            PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
            if ($scope.isPending) {
              stabView.notifyInterval(PitchModel.currentInterval);
              stabilityDetector.push(PitchModel.currentInterval);
            }
          }
        };


        $scope.signalOn = false;
        $scope.notes = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];
        $scope.rootNote = 56;
        $scope.isSettings = false;
        $scope.selected = [true, false, true, false, true, true, false, true, false, true, false, true, true];
        $scope.isPending = false;
        $scope.total = 0;
        $scope.right = 0;

        $scope.$watch('rootNote', function() {
          rootNote = parseInt($scope.rootNote);
          PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
          if (tanpura !== null)
            tanpura.stop();
          $scope.loading = true;
          var progressListener = function(message, progress) {
            if (progress === 100) {
              tanpura.play();
              $scope.loading = false;
              // $scope.$apply();
            }
          };
          tanpura = Tanpura.getInstance();
          tanpura.setTuning($scope.rootNote, 7, progressListener);
        });

        $scope.$watchCollection('selected', function() {
          var selIndices = [];
          $scope.selected.forEach(function(element, index) {
            if (element) {
              selIndices.push(index);
            }
          });
          mainDisplay.changeSettings(selIndices);
        });

        $scope.$on("$destroy", function() {
          tanpura.stop();
          if (micStream)
            micStream.stop();
        });
        $scope.startMic = function() {
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, 2048);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
                $scope.$apply();
              }
            );
          }
        };

        $scope.showSettings = function() {
          $scope.isSettings = true;
        };

        $scope.newNote = function() {
          if ($scope.signalOn) {
            mainDisplay.clear();
            stabView.clear();
            var randomNote;
            while (!$scope.selected[randomNote]) {
              randomNote = Math.round(Math.random() * 12.9);
            }
            problemInterval = randomNote;
            mainDisplay.markQuestion(problemInterval);
            $scope.isPending = true;
            stabView.start();
          } else {
            mainDisplay.setFlash("Please start Mic first.");
          }
        };

        function unitStabilityDetected(interval) {
          stabView.notifyUnitStable(interval);
        }



        function aggStabilityDetected(interval) {
          var ansInterval = ((interval % 12) + 12) % 12;
          //small hack for S'
          if (problemInterval === 12 && ansInterval === 0) {
            ansInterval = 12;
          }
          stabView.stop();
          mainDisplay.clear();
          setTimeout(function() {
            mainDisplay.setFlash("You Sung..");
            player.playNote(MusicCalc.midiNumToFreq(rootNote + ansInterval), playDuration);
            mainDisplay.playAnimate(ansInterval, playDuration);
            setTimeout(function() {
              mainDisplay.setFlash("Actual..");
              player.playNote(MusicCalc.midiNumToFreq(rootNote + problemInterval), playDuration);
              mainDisplay.playAnimate(problemInterval, playDuration);
              setTimeout(function() {
                $scope.total++;
                if (problemInterval === ansInterval) {
                  $scope.right++;
                  mainDisplay.setFlash("Right!");
                } else {
                  mainDisplay.setFlash("Wrong :(");
                }
                $scope.isPending = false;
                $scope.$apply();
              }, playDuration + 100);
            }, playDuration + 100);
          }, 100);
        }
      });
    });