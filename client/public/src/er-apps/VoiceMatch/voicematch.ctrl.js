define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 
  'pitchdetector', 'music-calc', 'stabilitydetector', './levels'],
  function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, StabilityDetector, levels) {
    var audioContext = CurrentAudioContext.getInstance();
    var player = new WebAudioPlayer(audioContext);
    var labels = ['Pa', '', 'Dha', '', 'Ni', 'Sa', '', 'Re', '', 'Ga', 'ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa\''];
    var scale = ['kali#3','safed#5', 'kali#4', 'safed#6', 'kali#5', 'Safed#7', 'Safed#1', 'Kali#1', 'Safed#2', 'Kali#2', 'Safed#3', 'Safed#4', 'Kali#3', 'Safed#5', 'Kali#4', 'Safed#6', 'Kali#5', 'Safed#7', 'Safed#1'];

    app.controller('VoiceMatchCtrl', function($scope, PitchModel, DialModel, ScoreService, $interval, User, $window) {
      var currentNote;
      var playDuration = 1000;
      var timeRange = 3000;
      var minInterval = -5;
      var maxInterval = 12;
      $scope.levels = levels;
      $scope.level = levels[0];
      $scope.rootNote = 47;
      var display = new Display(timeRange);
      var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
      var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
      var micStream;
      var stopBeep;
      $scope.signalOn = false;
      $scope.isPending = false;
      $scope.total = 0;
      $scope.right = 0;

      User.get({
        id: $window.localStorage.userId
      }).$promise.then(function(user) {
        $scope.gender = user.gender;
      });

      var updatePitch = function(data) {
        var pitch = detector.findPitch(data);
        if (pitch !== 0) {
          PitchModel.currentFreq = pitch;
          PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
          if ($scope.isPending) {
            display.notifyInterval(PitchModel.currentInterval + $scope.rootNote);
            stabilityDetector.push(PitchModel.currentInterval + $scope.rootNote);
          }
        }
      };

      $scope.$watch('gender', function() {
        if ($scope.gender == "man") {
            $scope.rootNote = 47;
        } else {
          $scope.rootNote = 58;
        }
        PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
      });

      $scope.$watch('level', function() {
          display.draw($scope.level.notes);
          if (!$scope.signalOn) display.setFlash("Start Mic");
      });

      $scope.reset = function() {
          if (stopBeep) $interval.cancel(stopBeep);
          $scope.resetScore();
          display.clear();
      };

      $scope.restart = function() {
            $scope.reset();
            $scope.new();
        };

      $scope.$on('exercise-complete',function() {
          ScoreService.save("VoiceMatch", $scope.level.name, $scope.right/$scope.total);
        });

      $scope.$on('overlay-close',function() {
          $scope.reset();
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
        if (!$scope.signalOn) {
            display.setFlash("Please start Mic first.");
            return;
        }
        if (!$scope.gender) {
            display.setFlash("Please set user type first.");
            return; 
        }
        display.clear();
        var randomNote = $scope.level.notes[Math.floor(Math.random()*$scope.level.notes.length)];
        currentNote = $scope.rootNote + randomNote;
        player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
        if ($scope.level.isBeepPersistent) {
            stopBeep = $interval(function() {
              player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
            }, 2000);
        }
        
        $scope.isPending = true;
        setTimeout(function() {
          display.start();
          display.setFlash("Now Sing and Stabalize");
        }, playDuration + 300);
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
        if (stopBeep) $interval.cancel(stopBeep);
        display.notifyAggStable(interval);
        display.stop();
        display.setFlash("Stable Tone Detected!");
        setTimeout(function() {
          display.setFlash("You Sung..");
          player.playNote(MusicCalc.midiNumToFreq(interval), playDuration);
          display.playAnimate(interval, playDuration);
          setTimeout(function() {
            display.setFlash("Actual..");
            player.playNote(MusicCalc.midiNumToFreq(currentNote), playDuration);
            display.playAnimate(currentNote, playDuration);
            setTimeout(function() {
              $scope.total++;
              if (currentNote === interval) {
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