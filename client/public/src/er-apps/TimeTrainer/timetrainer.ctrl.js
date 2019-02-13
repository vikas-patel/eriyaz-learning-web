define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'intensityfilter','./intensity-display'],
  function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, IntensityFilter,IntensityDisplay) {
    var audioContext = CurrentAudioContext.getInstance();
    var player = new WebAudioPlayer(audioContext);
    var timeRange = 100000;

    var pulseTimes = [];
    var startTime;
      var beat = 1000;

    var Metronome = function() {
      this.play = function() {
        var startTime1 = audioContext.currentTime + 0.05;
        startTime = startTime1;
        for (var i = 0; i < 6; i++) {
          player.scheduleNote(220, startTime1, 40);
          startTime1 = startTime1 + beat / 1000;
        }
      };
    };
    var metronome = new Metronome();

    var PulseStartDetector = function(pulseCallback) {
      var cache = [];
      this.push = function(val) {
        cache.push(val);
        if (cache.length > 4) {
          cache.shift();
        }
        if (cache.length === 4) {
          if (cache[0] === 0 && cache[1] === 0 && cache[2] === 1 && cache[3] === 1) {
            pulseTimes.push(audioContext.currentTime);
          }
        }
      };
    };

    var PulseEndDetector = function(pulseCallback) {
      var cache = [];
      this.push = function(val) {
        cache.push(val);
        if (cache.length > 4) {
          cache.shift();
        }
        if (cache.length === 4) {
          if (cache[0] === 1 && cache[1] === 1 && cache[2] === 0 && cache[3] === 0) {
            pulseTimes.push(audioContext.currentTime);
          }
        }
      };
    };

    app.controller('TimeTrainerCtrl', function($scope) {
    var intensityDisplay = new IntensityDisplay();

      var display = new Display(timeRange);
      display.drawLevel(1);
      var micStream;
      var pulseStartDetector = new PulseStartDetector();
      var pulseEndDetector = new PulseEndDetector();
      var updatePitch = function(data) {
        intensityDisplay.showIntensity(IntensityFilter.rootMeanSquare(data));
        if (IntensityFilter.rootMeanSquare(data) > 0.1) {
          pulseStartDetector.push(1);
          pulseEndDetector.push(1);
        } else {
          pulseStartDetector.push(0);
          pulseEndDetector.push(0);
        }
      };

      $scope.signalOn = false;

      $scope.startMic = function() {
        if (!$scope.signalOn) {
          MicUtil.getMicAudioStream(
            function(stream) {
              micStream = stream;
              buffer = new AudioBuffer(audioContext, stream, 256);
              buffer.addProcessor(updatePitch);
              $scope.signalOn = true;
              $scope.$apply();
            }
          );
        }
      };

      $scope.newRhythm = function() {
        metronome.play();
        pulseTimes = [];

      };

      $scope.check = function() {
        console.clear();
        for (var i = 0; i < pulseTimes.length; i++) {
          console.log(pulseTimes[i] - startTime - 2);
        }
        display.plotPulses(pulseTimes,startTime,beat);
      };

      $scope.tapped = function(event1) {
        console.log(event1);
        console.log(event1.timeStamp);
        console.log(audioContext.currentTime);
        pulseTimes.push(audioContext.currentTime);

      };
      console.log(metronome);
      $scope.$on('$destroy', function() {
        if (micStream)
          micStream.stop();
      });


    });
  });