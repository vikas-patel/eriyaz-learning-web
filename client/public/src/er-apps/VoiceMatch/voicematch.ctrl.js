define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', './stabilityDetector'],
  function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, StabilityDetector) {
    var audioContext = CurrentAudioContext.getInstance();
    var player = new WebAudioPlayer(audioContext);
    app.controller('VoiceMatchCtrl', function($scope, PitchModel, DialModel) {
      var currentNote;
      var rootNote;
      var playDuration = 1000;
      var timeRange = 3000;
      var minInterval = -7;
      var maxInterval = 12;
      var display = new Display();
      var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
      var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);

      display.setFlash("Start Mic");
      var updatePitch = function(data) {
        var pitch = detector.findPitch(data);
        if (pitch !== 0) {
          PitchModel.currentFreq = pitch;
          PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
          display.notifyInterval(PitchModel.currentInterval);
          stabilityDetector.push(PitchModel.currentInterval);
        }
      };

      $scope.rootNote = 47;
      $scope.signalOn = false;
      $scope.total = 0;
      $scope.right = 0;
      $scope.$watch('rootNote', function() {
        rootNote = parseInt($scope.rootNote);
        PitchModel.rootFreq = MusicCalc.midiNumToFreq(rootNote);
        console.log(PitchModel.rootFreq);
        console.log(rootNote);
      });

      $scope.startMic = function() {
        if (!$scope.signalOn) {
          MicUtil.getMicAudioStream(
            function(stream) {
              buffer = new AudioBuffer(audioContext, stream, 2048);
              buffer.addProcessor(updatePitch);
              $scope.signalOn = true;
            }
          );
        }
        display.setFlash("Click 'New' to hear Tone");
      };

      $scope.new = function() {
        if ($scope.signalOn) {
          display.clear();
          currentNote = rootNote + Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
          console.log(currentNote);
          player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);

          setTimeout(function() {
            display.start();
            display.setFlash("Now Sing and Stabalize");
          }, playDuration);
        } else {
          display.setFlash("Please start Mic first.");
        }
      };

      $scope.repeat = function() {
        player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
      };

      function unitStabilityDetected(interval) {
        display.notifyUnitStable(interval);
      }

      function aggStabilityDetected(interval) {
        console.log(interval);
        display.notifyAggStable(interval);
        display.stop();
        display.setFlash("Stable Tone Detected!");
        setTimeout(function() {
          player.playNote(MusicCalc.midiNumToFreq(rootNote + interval), playDuration);
          display.setFlash("You Sung..");
          display.playAnimate(interval, playDuration);
          setTimeout(function() {
            player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
            display.setFlash("Actual..");
            display.playAnimate(currentNote - rootNote, playDuration);
            setTimeout(function() {
              $scope.total++;
              if (currentNote === rootNote + interval) {
                $scope.right++;
                display.setFlash("Right!");
              } else {
                display.setFlash("Wrong :(");
              }
            }, playDuration + 100);
          }, playDuration + 100);
        }, 100);
      }

    });
  });