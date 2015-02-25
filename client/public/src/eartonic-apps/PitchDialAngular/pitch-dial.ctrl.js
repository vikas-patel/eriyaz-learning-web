  define(['./module', 'mic', 'audiobuffer', 'webaudioplayer', 'fft-pitch'], function(app, MicUtil, AudioBuffer, WebAudioPlayer) {
    var WebAudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new WebAudioContext();
    app.controller('PitchDialCtrl', function($scope, PitchModel, DialModel) {
      var adjustment = 1.088;
      var updatePitch = function(data) {
        var pitchCalculator = new PitchAnalyzer(44100);
        pitchCalculator.input(data);
        pitchCalculator.process();
        var tone = pitchCalculator.findTone();
        if (tone === null) {
          console.log('No tone found!');
        } else {
          console.log('Found a tone, frequency:', tone.freq, 'volume:', tone.db);
          PitchModel.currentFreq = tone.freq * adjustment;
          PitchModel.currentInterval = Math.round(1200 * (Math.log(PitchModel.currentFreq / PitchModel.rootFreq) / Math.log(2))) / 100;
          // DialModel.value = PitchModel.currentInterval;
          DialModel.setValue(PitchModel.currentInterval);
          // $scope.$digest();
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