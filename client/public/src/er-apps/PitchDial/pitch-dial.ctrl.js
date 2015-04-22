  define(['./module', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'tanpura'],
    function(app, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, Tanpura) {
      var audioContext = CurrentAudioContext.getInstance();
      app.controller('PitchDialCtrl', function($scope, PitchModel, DialModel,$rootScope) {
        $scope.rootNote = 56;
        $scope.$watch('rootNote', function() {
          PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
          tanpura = Tanpura.getInstance($scope.rootNote, 7);
          tanpura.play();
        });

        $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams, fromState, fromParams) {
            if (fromState.name == 'freestyle') {
              tanpura.stop();
            }
          });

        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
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