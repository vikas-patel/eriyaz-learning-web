  define(['./module', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'pitchdetector', 'music-calc', './recorderworker'],
    function(app, Display, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, PitchDetector, MusicCalc, recorderWorker) {
      var audioContext = CurrentAudioContext.getInstance();
      var pitchArray = [];
      var isStarted = false;
      var count = 0;
      var buffArray = [];
      app.controller('FreestylePhrasesCtrl', function($scope, PitchModel, DialModel) {
        var display = new Display();
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var updatePitch = function(data) {
          if (isStarted) {
            // console.log('updatePitch');
            // buffArray.push(data);
            // if (count < 8) {
            //   count++;

            // } else {
            //   buffArray.shift();
            // }

            recorderWorker.postMessage({
              command:'record',
              floatarray : data
            });

          }
        };

        function concatBuffers() {
          // console.log(buffArray);
          // for (var i = 0; i < buffArray.length; i++) {
          //   (function(index) {
          //     console.log(index);
          //     console.log(buffArray.indexOf(buffArray[index]));
          //     console.log(buffArray[index]);

          //   })(i);
          // }
          recorderWorker.postMessage({command:'concat'});
          // var concatenatedArray = new Float32Array(buffArray.length * 256);
          // var offset = 0;
          // for (var j = 0; j < buffArray.length; j++) {
          //   (function(buffer) {
          //     concatenatedArray.set(buffer, offset);
          //     // console.log(buffer);
          //   })(buffArray[j]);
          //   offset += buffArray[j].length;
          // }
          // var outBuffer = audioContext.createBuffer(1, concatenatedArray.length, audioContext.sampleRate);
          // var l = outBuffer.getChannelData(0);
          // l.set(concatenatedArray);
          // var source = audioContext.createBufferSource();
          // source.buffer = outBuffer;
          // source.connect(audioContext.destination);
          // source.start();
        }

        recorderWorker.onmessage = function(e) {
          switch(e.data.command) {
            case 'concat':
            // playConcatenated(e.data.floatarray);
          computePitchGraph(e.data.floatarray);

            break;
          case 'computepitch':
            display.plotData(e.data.pitchData);
          }

        };

        function playConcatenated(floatarray) {
          console.log('here');
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
        }

        function computePitchGraph(floatarray) {
          var offset=0;
          var incr = 64;
          var buffsize = 2048;
          var pitchArray = [];
          while(offset+buffsize < floatarray.length) {
            var subarray = new Float32Array(buffsize);
            for(var i=0;i<buffsize;i++) {
              subarray[i] = floatarray[offset+i];
            }
            // floatarray.subarray(offset,offset+buffsize);
             var pitch = detector.findPitch(subarray);
              if (pitch !== 0) {
                PitchModel.currentFreq = pitch;
                PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
              }
              pitchArray.push(PitchModel.currentInterval); 
              offset = offset + incr;
          }
          console.log(pitchArray);
          display.plotData(pitchArray);
          playConcatenated(floatarray);
        }

        function getPitchData() {
          // console.log(buffArray);
          // for (var j = 0; j < buffArray.length - 8; j++) {
          //   (function(idxj) {
          //     // console.log(idxj);
          //     var combBuffer = new Float32Array(2048);
          //     for (var i = 0; i < 8; i++) {
          //       (function(idxi) {
          //         combBuffer.set(buffArray[idxj + idxi], idxi * 256);
          //       })(i);
          //       // combBuffer.set(buffArray[j + i], i * 256);
          //     }
          //     // console.log(combBuffer);
          //     var pitch = detector.findPitch(combBuffer);
          //     if (pitch !== 0) {
          //       PitchModel.currentFreq = pitch;
          //       PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
          //     }
          //     pitchArray.push(PitchModel.currentInterval);
          //   })(j);

          // }
          recorderWorker.postMessage({command:'computepitch',rootFreq:PitchModel.rootFreq,pitchDetector:detector,musicCalc:MusicCalc});

        }

        $scope.signalOn = false;
        $scope.startMic = function() {
          if (!$scope.signalOn) {
            MicUtil.getMicAudioStream(
              function(stream) {
                buffer = new AudioBuffer(audioContext, stream, 8192);
                buffer.addProcessor(updatePitch);
                $scope.signalOn = true;
                console.log(stream);
              }
            );
          }

        };

        $scope.start = function() {
          recorderWorker.postMessage({command:'clear'});
          display.clear();
          pitchArray = [];
          isStarted = true;
          count = 0;
          buffArray = [];
        };
        $scope.stop = function() {
          isStarted = false;
          // setTimeout(function() {},5000);
          concatBuffers();
          // getPitchData();
          // display.plotData(pitchArray);
        };


      });
    });