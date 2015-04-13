  define(['./module', 'mic','currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector'], function(app, MicUtil,CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector) {
    var audioContext = CurrentAudioContext.getInstance();
    app.controller('PitchDialCtrl', function($scope, PitchModel, DialModel) {
      var detector = PitchDetector.getDetector('fft', audioContext.sampleRate);
      var updatePitch = function(data) {
        var pitch = detector.findPitch(data);
        if (pitch !== 0) {
          PitchModel.currentFreq = pitch;
          PitchModel.currentInterval = Math.round(1200 * (Math.log(PitchModel.currentFreq / PitchModel.rootFreq) / Math.log(2))) / 100;
          // DialModel.value = PitchModel.currentInterval;
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

      $scope.setRoot = function() {
        PitchModel.rootFreq = PitchModel.currentFreq;
      };

      $scope.playRoot = function() {
        var player = new WebAudioPlayer(audioContext);
        player.playNote(PitchModel.rootFreq, 1000);
      };
    });
  });