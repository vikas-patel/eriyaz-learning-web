  define(['./module', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'tanpura','jquery'],
    function(app, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, Tanpura,$) {
      var audioContext = CurrentAudioContext.getInstance();
      app.controller('PitchDialCtrl', function($scope, PitchModel, DialModel, $rootScope) {
        $scope.rootNote = 56;
        $scope.progress = 0;
        $scope.loading = false;
        var tanpura = null;
        $scope.$watch('rootNote', function() {
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

        $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams, fromState, fromParams) {
            if (fromState.name == 'freestyle') {
              tanpura.stop();
            }
          });

        var detector = PitchDetector.getDetector('fft', audioContext.sampleRate);
        var updatePitch = function(data) {
          var pitch = detector.findPitch(data);
          if (pitch !== 0) {
            PitchModel.currentFreq = pitch;
            PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
            DialModel.setValue(PitchModel.currentInterval);
          }
        };


        $scope.startMic = function() {

          MicUtil.getMicAudioStream(
            function(stream) {
              buffer = new AudioBuffer(audioContext, stream, 2048);
              buffer.addProcessor(updatePitch);
            }
          );
        };
      });
    });