  define(['./module', './chart', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc'],
      function(app, Chart, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc) {
          var audioContext = CurrentAudioContext.getInstance();
          app.controller('SingGraphCtrl', function($scope, PitchModel, DialModel) {
              var chart = new Chart();
              var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
              var updatePitch = function(data) {
                  var pitch = detector.findPitch(data);
                  if (pitch !== 0) {
                      PitchModel.currentFreq = pitch;
                      PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                      chart.notify(PitchModel.currentInterval);
                  }
              };

              $scope.signalOn = false;
              $scope.startMic = function() {
                  chart.start();
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

              $scope.pause = function() {
                  console.log('pause');
                  chart.pause();
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