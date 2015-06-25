define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'stabilitydetector', './levels'],
  function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, StabilityDetector, levels) {
    var audioContext = CurrentAudioContext.getInstance();
    var player = new WebAudioPlayer(audioContext);
    app.controller('VoiceMatchCtrl', function($scope, PitchModel, DialModel) {
      var currentNote;
      var rootNote;
      var playDuration = 1000;
      var timeRange = 3000;
      var minInterval = -5;
      var maxInterval = 12;
      var display = new Display(timeRange);
      var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
      var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
      var micStream;
      $scope.levels = levels;
      $scope.level = levels[0];
      $scope.rootNote = 47;
      $scope.signalOn = false;
      $scope.isPending = false;
      $scope.total = 0;
      $scope.right = 0;
      display.setFlash("Start Mic");

      var updatePitch = function(data) {
        var pitch = detector.findPitch(data);
        if (pitch !== 0) {
          PitchModel.currentFreq = pitch;
          PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
          if ($scope.isPending) {
            display.notifyInterval(PitchModel.currentInterval);
            stabilityDetector.push(PitchModel.currentInterval);
          }
        }
      };

      $scope.$watch('rootNote', function() {
        rootNote = parseInt($scope.rootNote);
        PitchModel.rootFreq = MusicCalc.midiNumToFreq(rootNote);
      });

      $scope.$watch('level', function() {
          $scope.resetScore();
          display.clear();
      });

      $scope.$watch('total', function() {
          if ($scope.total == $scope.level.total) {
              // Display score & save
              $scope.score = $scope.right / $scope.total;
              $scope.showOverlay = true;
              ScoreService.save("VoiceMatch", $scope.level.name, $scope.score);
          }
      });

      $scope.startMic = function() {
        if (!$scope.signalOn) {
          MicUtil.getMicAudioStream(
            function(stream) {
              micStream = stream;
              buffer = new AudioBuffer(audioContext, stream, 2048);
              buffer.addProcessor(updatePitch);
              $scope.signalOn = true;
              $scope.$apply();
            }
          );
        }
        display.setFlash("Click 'New' to hear Tone");
      };

      $scope.$on('$destroy', function() {
        if (micStream)
          micStream.stop();
      });

      $scope.new = function() {
        if ($scope.signalOn) {
          display.clear();
          currentNote = rootNote + Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
          player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
          $scope.isPending = true;
          setTimeout(function() {
            display.start();
            display.setFlash("Now Sing and Stabalize");
          }, playDuration + 300);
        } else {
          display.setFlash("Please start Mic first.");
        }
      };

      $scope.repeat = function() {
        player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
      };

      $scope.resetScore = function() {
          $scope.total = 0;
          $scope.right = 0;
      }

      function unitStabilityDetected(interval) {
        display.notifyUnitStable(interval);
      }

      function aggStabilityDetected(interval) {
        display.notifyAggStable(interval);
        display.stop();
        display.setFlash("Stable Tone Detected!");
        setTimeout(function() {
          display.setFlash("You Sung..");
          player.playNote(MusicCalc.midiNumToFreq(rootNote + interval), playDuration);
          display.playAnimate(interval, playDuration);
          setTimeout(function() {
            display.setFlash("Actual..");
            player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
            display.playAnimate(currentNote - rootNote, playDuration);
            setTimeout(function() {
              $scope.total++;
              if (currentNote === rootNote + interval) {
                $scope.right++;
                display.setFlash("Right!");
              } else {
                display.setFlash("Wrong :(");
              }
              $scope.isPending = false;
              $scope.$apply();
            }, playDuration + 100);
          }, playDuration + 100);
        }, 100);
      }

    });
  });