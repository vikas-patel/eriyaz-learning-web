define(['./module', './sequencegen', './display', './songs', 'note', 'webaudioplayer', './timestretcher', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer'
    ],
    function(app, sequenceGen, Display, songs, Note, Player, TimeStretcher, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, scorer) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('SongPracticeCtrl', function($scope, $rootScope, PitchModel) {
            $scope.score = 0;
            $scope.songs = songs;
            $scope.song = songs[0];
            $scope.sequences = [{name:"sing with original", actions:[1, 3]},
                                {name:"sing after original", actions:[1, 2]},
                                {name:"combine above two", actions:[1, 3, 1, 2]},
                                {name:"listen original only", actions:[1]}];
            $scope.sequence = $scope.sequences[0];
            var display = new Display(setRange);
            var stretcher;

            var currRoot;
            var currThat;

            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            $scope.tempo = 1;
            var defaultBeatDurtion = 1000;
            var beatDuration = defaultBeatDurtion;
            var currActiveNote = 0;
            var singTime = Date.now();
            var songBuffer;
            var wholeBeat = 1;
            var totalBeats = 1;
            var stretchedBuffer;
            var rStart;
            var rEnd;
            var source;
            var rawTime, arrayPitch;
            var t0, t1;
            var recorderWorker = new Worker("/worker/pitchworker.js?v=1");
            var stretchWorker = new Worker("/worker/timestretcher.js?v=1");
            var actionMessage = ["Listen", "Sing", "Listen & Sing"];
            var LOADING_MSG = "Wait... Loading Song";
            var SLOWER_MSG = "Wait... Reducing Song Tempo";
            function setRange(t0, t1) {
                rStart = t0;
                rEnd = t1; 
                defaultBeatDurtion = (rEnd - rStart)*1000;
                beatDuration = parseInt(defaultBeatDurtion/$scope.tempo);
                if ($scope.tempo < 1) {
                    calculateStretchedBuffer();
                } else {
                    stretchedBuffer = null;
                }
            }

            $scope.$watch('song', function() {
                loadSound();
                PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.song.rootNote);
            });

            var Clock = function(tickDuration) {
                var intervalId = 0;
                var nextTickCount = wholeBeat;
                this.watcher = null;
                var nullAction = function() {
                };
                this.nextBeepAction = nullAction;
                var startTime1 = audioContext.currentTime + beatDuration / 1000;

                this.registerWatcher = function(watcher) {
                    this.watcher = watcher;
                };
                this.start = function() {
                    var local = this;
                    intervalId = setInterval(function repeatAction() {
                        if (nextTickCount == wholeBeat) {
                            player.scheduleNote(880, startTime1, 25);
                            nextTickCount = 0;
                        }
                        nextTickCount++;
                        startTime1 = startTime1 + beatDuration / 1000;
                        local.callScheduledAction();
                        local.watcher.handleBeep();
                        return repeatAction;
                    }(), tickDuration);
                };
                this.stop = function() {
                    clearInterval(intervalId);
                };

                this.scheduleNote = function() {
                    //schedule note for next beep.
                    playSound(startTime1);
                };

                this.scheduleAction = function(callback) {
                    this.nextBeepAction = callback;
                };

                this.callScheduledAction = function() {
                    this.nextBeepAction();
                    this.nextBeepAction = nullAction;
                };

            };

            var gameController = {
                setState: function(state) {
                    this.state = state;
                },
                setIntervalHandler: function(handler) {
                    this.intervalHandler = handler;
                },
                handleBeep: function() {
                    this.state.handleBeep();
                },
                handleNewInterval: function(interval) {
                    this.intervalHandler(interval);
                }
            };

            var clock = new Clock(beatDuration);
            clock.registerWatcher(gameController);

            var ACTIONS = {
              PLAY: 1, SING: 2
            };

            var isActionTrue = function(number, action) {
              return !!(number & action);
            };
 
            var PlayState = function() {
                var currentNoteIdx = 5;
                var local = this;
                var count = 0;

                this.handleBeep = function() {
                    if (count == 0) {
                         display.clearUserPoints();
                    }
                    var action = $scope.sequence.actions[count];
                    //Play now (listen first)
                    if (isActionTrue(action, ACTIONS.PLAY)) {
                        playSound(0);
                    }
                    if (isActionTrue(action, ACTIONS.SING)) {
                        recorderWorker.postMessage({
                            command: 'init',
                            rootFreq: PitchModel.rootFreq,
                            sampleRate: audioContext.sampleRate,
                            time: (rEnd - rStart)/$scope.tempo
                          });
                    } else {
                        gameController.setIntervalHandler(function(data) {});
                    }
                    // end of sequence
                    if (count == $scope.sequence.actions.length-1) {
                         if ($scope.isLoop) {
                            gameController.setState(new PlayState());
                        } else {
                            gameController.setState(new FeedbackState());
                        }
                    }
                    display.drawIndicator(beatDuration);
                    display.setFlash(actionMessage[action-1]);
                    count++;
                    
                    clock.scheduleAction(function() {
                        if (isActionTrue($scope.sequence.actions[count], ACTIONS.SING)) {
                            display.clearUserPoints();
                            gameController.setIntervalHandler(function(data) {
                                recorderWorker.postMessage({
                                  command: 'record',
                                  floatarray: data
                                });
                            });
                        }
                        if (isActionTrue($scope.sequence.actions[count-1], ACTIONS.SING)) {
                            recorderWorker.postMessage({
                                    command: 'concat'
                                  });
                            recorderWorker.postMessage({
                                command: 'init',
                                rootFreq: PitchModel.rootFreq,
                                sampleRate: audioContext.sampleRate,
                                time: (rEnd - rStart)/$scope.tempo
                              });
                        }
                    });
                };
            };

            var FeedbackState = function() {
                var local = this;
                var count = 0;
                this.handleBeep = function() {
                    gameController.setIntervalHandler(function(interval) {
                        // empty, no action
                    });
                    if (count == 0) {
                        $scope.playClicked();
                        display.clearFlash();
                    }
                    count++;
                    // clock.scheduleAction(function() {
                        
                    //     count++;
                    // });
                };
            };
            gameController.setState(new PlayState());
            
            gameController.setIntervalHandler(function(interval) {
                // yet to initialize
            });
            var updatePitch = function(data) {
                gameController.handleNewInterval(data);
            };

            recorderWorker.onmessage = function(e) {
              switch (e.data.command) {
                case 'concat':
                  globalArray = e.data.recordedArray;
                  computePitchGraph(e.data.pitchArray);
                  break;
              }
            };

            function loadSound() {
              display.setFlash(LOADING_MSG);
              var url = "er-shell/audio/"+$scope.song.path;
              var request = new XMLHttpRequest();
              request.open('GET', url, true);
              request.responseType = 'arraybuffer';

              // Decode asynchronously
              request.onload = function() {
                audioContext.decodeAudioData(request.response, function(buffer) {
                songBuffer = buffer;
                loadExercise();
                display.clearFlash();
                }, function() {console.log("error on loading audio file.")});
              }
              request.send();
            }

            function playSound(time) {
              source = audioContext.createBufferSource(); // creates a sound source
              source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
              if (stretchedBuffer) {
                source.buffer = stretchedBuffer;
                source.start(time);
              } else {
                source.buffer = songBuffer;                    // tell the source which sound to play
                source.start(time, rStart, rEnd - rStart);                           // play the source now
              }
            }

            function computePitchGraph(floatarray) {
                var i0 = getIndex(rStart, rawTime);
                var i1 = getIndex(rEnd, rawTime);
                var subPSeries = arrayPitch.slice(i0, i1);
                var delay = crossCorrelation(subPSeries, floatarray);
                display.plotData(floatarray, $scope.tempo, delay);
            };

            function getIndex(t0, series) {
                var i = 0, j = series.length-1;
                var temp = 0;
                while (j-i > 1) {
                    temp = parseInt((i+j)/2);
                    if (series[temp] > t0) {
                        j = temp;
                    } else {
                        i = temp;
                    }
                    
                }
                return j;
            }

            function crossCorrelation(aReference, aUser) {
                var shifts = 20;
                var shiftNum = 5; // ~15ms
                var ratio = aReference.length/aUser.length;
                var sumArray = [];
                for (var i=0; i<shifts;i++) {
                    var sum = 0;
                    var ref = 0;
                    var index = 0;
                    for (var j=0;j<aReference.length;j++) {
                        index = Math.round(j/ratio) + i*shiftNum;
                        if (index > aUser.length-1) continue;
                        ref = aReference[j];
                        user = aUser[index];
                        if (ref < -5 || ref > 16) continue;
                        if (user < -5 || user > 16) continue;
                        sum = sum + (ref+6)*(user+6);
                    }
                    sumArray.push(sum);
                }
                var maxIndex = indexOfMax(sumArray);
                return maxIndex*(shiftNum/ratio);
            }

            function indexOfMax(arr) {
                if (arr.length === 0) {
                    return -1;
                }

                var max = arr[0];
                var maxIndex = 0;

                for (var i = 1; i < arr.length; i++) {
                    if (arr[i] > max) {
                        maxIndex = i;
                        max = arr[i];
                    }
                }

                return maxIndex;
            }

            // $scope.$watch('rootNote', function() {
            //     currRoot = parseInt($scope.rootNote);

            //     baseFreq = MusicCalc.midiNumToFreq(currRoot);
            //     PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
            // });

            $scope.$watch('tempo', function() {
                beatDuration = defaultBeatDurtion/$scope.tempo;
                if ($("#PlayButton").hasClass("Playing")) {
                    restart();
                }
                if ($scope.tempo < 1) {
                    calculateStretchedBuffer();
                } else {
                    stretchedBuffer = null;
                }
                
            });

            $scope.$on("$destroy", function() {
                clock.stop();
                if (micStream)
                    micStream.stop();
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
            };

            function isDisabled(element, index, array) {
                return !element.enabled;
            }
            
            function loadExercise() {
                display.clearPoints();
                beatDuration = defaultBeatDurtion/$scope.tempo;
                rawTime = $scope.song.timeSeries;
                rawFreq = $scope.song.pitchSeries;
                var arrayTime = [];
                var arrayFreq = [];
                for (var i = 0; i < rawFreq.length; i++) {
                    // if (rawFreq[i] > 0) {
                        arrayTime.push(rawTime[i]);
                        arrayFreq.push(rawFreq[i]);
                    // }
                }
                arrayPitch = [];
                for (var i = 0; i < arrayFreq.length; i++) {
                    if (arrayFreq[i] > 0) {
                        var pitch = MusicCalc.getCents(PitchModel.rootFreq, arrayFreq[i]) / 100;
                        arrayPitch.push(pitch);
                    } else {
                        arrayPitch.push(-100);
                    }
                }
                display.init(arrayPitch, arrayTime, songBuffer.duration, $scope.song.scale);
                if ($scope.tempo < 1) {
                    calculateStretchedBuffer();
                } else {
                    stretchedBuffer = null;
                }
            }

            function calculateStretchedBuffer() {
                display.setFlash(SLOWER_MSG);
                var channels = songBuffer.numberOfChannels;
                var channelData = new Array(channels);
                for (var i=0; i< channels;i++) {
                    channelData[i] = songBuffer.getChannelData(i);
                }
                stretchWorker.postMessage({
                    command: 'calculate',
                    sampleRate: songBuffer.sampleRate,
                    channelData: channelData,
                    tempo: $scope.tempo,
                    start: rStart,
                    end: rEnd
                });
            }

            stretchWorker.onmessage = function(e) {
              switch (e.data.command) {
                case 'done':
                    var outBufferList = e.data.outBufferList;
                    stretchedBuffer = audioContext.createBuffer(outBufferList.length, outBufferList[0].length, audioContext.sampleRate);
                    for (var j=0; j<outBufferList.length;j++) {
                        var o = stretchedBuffer.getChannelData(j);
                        for (var i = 0; i < outBufferList[j].length; i++) {
                            o[i] = outBufferList[j][i];
                        }
                    }
                    display.clearFlash();
                  break;
              }
            };

            function restart() {
                $scope.score = 0;
                singTime = Date.now();
                clock.stop();
                clock = new Clock(beatDuration);
                clock.registerWatcher(gameController);
                gameController.setState(new PlayState());
                clock.start();
            }

            function pitchCorrection(actual, expected) {
                var diff = (actual - expected)%12;
                if (diff >= 10) {
                    diff = diff - 12;
                } else if (diff <= -10) {
                    diff = diff + 12;
                }
                return expected + diff;
            }

            $scope.playClicked = function() {
                if ($("#PlayButton").hasClass("Playing")) {
                    clock.stop();
                    $("#PlayButton").removeClass("Playing");
                    $("#play-icon").addClass("icon-svg_play");
                    $("#play-icon").removeClass("icon-svg_pause");
                    display.stopIndicator();
                    source.stop();
                    gameController.setIntervalHandler(function(data) {});
                } else {
                    restart();
                    $("#PlayButton").addClass("Playing");
                    $("#play-icon").removeClass("icon-svg_play");
                    $("#play-icon").addClass("icon-svg_pause");
                    $scope.startMic();
                }
            };

            $scope.playRecord = function() {
                playConcatenated(globalArray);
            };

            function playConcatenated(floatarray) {
              var concatenatedArray = floatarray;
              var outBuffer = audioContext.createBuffer(1, concatenatedArray.length, audioContext.sampleRate);
              var l = outBuffer.getChannelData(0);
              l.set(concatenatedArray);
              var source = audioContext.createBufferSource();
              source.buffer = outBuffer;
              source.connect(audioContext.destination);
              source.start();
            }
        });
    });