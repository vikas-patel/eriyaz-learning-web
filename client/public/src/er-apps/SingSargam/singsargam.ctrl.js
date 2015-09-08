  define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', 'recorderworker', 'intensityfilter'],
    function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, recorderWorker, IntensityFilter) {
      var audioContext = CurrentAudioContext.getInstance();
      var recBufferSize = 8192;

      app.controller('SingSargamCtrl', function($scope, PitchModel, DialModel) {
        $scope.isStarted = false;
        $scope.isPlayReady = false;
        var display = new Display();
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var updatePitch = function(data) {
          if ($scope.isStarted) {
            recorderWorker.postMessage({
              command: 'record',
              floatarray: data
            });
          }
        };

        function concatBuffers() {
          recorderWorker.postMessage({
            command: 'concat'
          });
        }

        recorderWorker.onmessage = function(e) {
          switch (e.data.command) {
            case 'concat':
              $scope.isPlayReady = true;
              $scope.$apply();
              computePitchGraph(e.data.floatarray);
              playConcatenated(e.data.floatarray);
              globalArray = e.data.floatarray;
              break;
          }
        };

        function playConcatenated(floatarray) {
          var concatenatedArray = floatarray;
          var outBuffer = audioContext.createBuffer(1, concatenatedArray.length, audioContext.sampleRate);
          var l = outBuffer.getChannelData(0);
          // console.log(concatenatedArray);
          l.set(concatenatedArray);
          // console.log(l);
          var source = audioContext.createBufferSource();
          source.buffer = outBuffer;
          source.connect(audioContext.destination);
          source.start();
          display.playAnimate(Math.round(floatarray.length * 1000 / audioContext.sampleRate));

        }

        function computePitchGraph(floatarray) {
          var offset = 0;
          var incr = 64;
          var buffsize = 2048;
          var pitchArray = [];
          var volumeArray = [];
          var diffVolArray = [];
          var volLast = 0;
          while (offset + buffsize < floatarray.length) {
            var subarray = new Float32Array(buffsize);
            for (var i = 0; i < buffsize; i++) {
              subarray[i] = floatarray[offset + i];
            }
            // floatarray.subarray(offset,offset+buffsize);
            var pitch = detector.findPitch(subarray);
            var volume = IntensityFilter.rootMeanSquare(subarray);
            if (pitch !== 0) {
              PitchModel.currentFreq = pitch;
              PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
              pitchArray.push(Math.round(PitchModel.currentInterval));
            } else {
                pitchArray.push(Number.NaN);
            }
            volumeArray.push(volume);
            diffVolArray.push(volume - volLast);
            volLast = volume;
            offset = offset + incr;
          }
          var maxMinArray = [];
          var lastValue = 0;
          for (var i=20; i< volumeArray.length; i=i+10) {
              if (volumeArray[i] > volumeArray[i-10] && volumeArray[i] > volumeArray[i+10]) {
                maxMinArray.push({index:i, value: volumeArray[i], jump: volumeArray[i]-lastValue});
                lastValue = volumeArray[i];
              }
              if (volumeArray[i] < volumeArray[i-10] && volumeArray[i] < volumeArray[i+10]) {
                maxMinArray.push({index:i, value: volumeArray[i], jump:volumeArray[i]-lastValue});
                lastValue = volumeArray[i];
              }
          }
          display.plotData(pitchArray);
          var sortArray = _.sortBy(maxMinArray, function(num){ return -num.jump; });
          var topArray = sortArray.slice(0, 5);
          var returnArray = _.sortBy(topArray, function(num) {return num.index;});
          for (var i=0; i<returnArray.length-1; i++) {
            var copyArray = pitchArray.slice(returnArray[i].index, (returnArray[i].index + returnArray[i+1].index)/2);
            console.log(copyArray);
            var stdDev = IntensityFilter.standardDeviation(copyArray);
            console.log("stdDev:"+stdDev);
            var pitch = _.chain(copyArray).countBy().pairs().max(_.last).head().value();
            returnArray[i].pitch = pitch;
            console.log("pitch:"+pitch);
          }
          display.plotData2(volumeArray, returnArray);
        }


        $scope.signalOn = false;
        $scope.mic = function() {
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, recBufferSize);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
                $scope.$apply();
              }
            );
          }

        };

        $scope.start = function() {
          recorderWorker.postMessage({
            command: 'clear'
          });
          display.clear();
          $scope.isStarted = true;
        };
        $scope.stop = function() {
          $scope.isStarted = false;
          concatBuffers();
        };

        $scope.replay = function() {
          playConcatenated(globalArray);
        };
      });
    });