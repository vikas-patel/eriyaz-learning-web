  define(['./module', './main-display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', './stabalizer-view', 'stabilitydetector'],
    function(app, MainDisplay, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, StabalizerView, StabilityDetector) {
      var audioContext = CurrentAudioContext.getInstance();

      app.controller('SwarMasteryCtrl', function($scope, PitchModel, SettingsModel) {
        var mainDisplay = new MainDisplay();
        mainDisplay.changeSettings(SettingsModel);
        var stabView = new StabalizerView();
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
        var currentNote;

        var updatePitch = function(data) {
          var pitch = detector.findPitch(data);
          if (pitch !== 0) {
            PitchModel.currentFreq = pitch;
            PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
            stabView.notifyInterval(PitchModel.currentInterval);
            stabilityDetector.push(PitchModel.currentInterval);
          }
        };

        $scope.signalOn = false;
        $scope.notes = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];
        $scope.rootNote = 56;
        $scope.isSettings = false;
        $scope.selected = [true, false, true, false, true, true, false, true, false, true, false, true, true];

        $scope.startMic = function() {
          stabView.start();
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, 2048);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
              }
            );
          }
        };

        $scope.showSettings = function() {
          $scope.isSettings = true;
        };

        $scope.newNote = function() {
          mainDisplay.clear();
          stabView.clear();
          var randomNote;
          while (!$scope.selected[randomNote]) {
            randomNote = Math.round(Math.random() * 12.9);
          }
          currentNote = randomNote;
          mainDisplay.markQuestion(currentNote);
        };

        function unitStabilityDetected(interval) {
          stabView.notifyUnitStable(interval);
        }



        function aggStabilityDetected(interval) {
          stabView.stop();
          mainDisplay.clear();

        }
      });
    });