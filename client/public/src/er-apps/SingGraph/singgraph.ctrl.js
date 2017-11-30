  define(['./module', './chart', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'voiceplayer'],
      function(app, Chart, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, VoicePlayer) {
          var audioContext = CurrentAudioContext.getInstance();
          app.controller('SingGraphCtrl', function($scope, PitchModel, DialModel) {
              var chart = new Chart();
              var beatDuration = 2000;
              $scope.rootNote = 48;
              $scope.state = "play";
              var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
              voicePlayer = new VoicePlayer(audioContext, 'male');


              

              var updatePitch = function(data) {
                  var pitch = detector.findPitch(data);
                  if (pitch !== 0) {
                      PitchModel.currentFreq = pitch;
                      PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                      chart.notify(PitchModel.currentInterval);
                  } else {
                    chart.notify(Number.NaN);
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
                
                  if ($scope.state == "play") {
                    $scope.state = "pause";
                    chart.pause();
                  } else {
                    $scope.state = "play";
                    chart.start();
                  }
              };

              $scope.$watch('rootNote', function() {
                PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
              });

              $scope.playSa = function() {
                  playNote(0);
              };

              $scope.playRe = function() {
                  playNote(2);
              };

              $scope.playGa= function() {
                  playNote(4);
              };

              function playNote(noteNum) {
                var midi = $scope.rootNote + noteNum;
                voicePlayer.play(midi, function(){}, beatDuration);   
              }
          });
      });