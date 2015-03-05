  define(['./module', 'mic', 'audiobuffer', 'webaudioplayer', 'pitchdetector'], function(app, MicUtil, AudioBuffer, WebAudioPlayer, PitchDetector) {
    var WebAudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new WebAudioContext();
    app.controller('PitchDialCtrl', function($scope, PitchModel, DialModel) {
      var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
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
        var playTime = 1000;
        console.log(player.startTone);
        player.startTone(PitchModel.rootFreq);
        setTimeout(
          function() {
            player.stopTone();
          }, playTime);
      };
    });
  });