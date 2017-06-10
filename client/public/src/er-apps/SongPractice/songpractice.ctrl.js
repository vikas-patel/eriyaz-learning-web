define(['./module', './sequencegen', './display', './songs', 'note', 'webaudioplayer', './timestretcher', 'recorderworker', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer'
    ],
    function(app, sequenceGen, Display, songs, Note, Player, TimeStretcher, recorderWorker, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, scorer) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('SongPracticeCtrl', function($scope, $rootScope, PitchModel) {
            $scope.score = 0;
            $scope.songs = songs;
            $scope.song = songs[0];
            var display = new Display(setRange);
            var stretcher;

            var currRoot;
            var currThat;
            var startIndex = 0;
            var endIndex = 0;

            var marker = 0;

            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            $scope.tempo = 1;
            var defaultBeatDurtion = 1000;
            var beatDuration = defaultBeatDurtion;
            var timeSeries = $scope.song.timeSeries;
            var pitchSeries = $scope.song.pitchSeries;
            var currActiveNote = 0;
            var exerciseIndex = 0;
            var singTime = Date.now();
            var songBuffer;
            var wholeBeat = 1;
            var totalBeats = 1;
            var stretchedBuffer;
            var arrayTime;
            var arrayPitch;
            var rStart;
            var rEnd;
            var endTime;

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
                exerciseIndex = 0;
                if ($scope.song.isFemale) {
                    PitchModel.rootFreq = 246.8;
                } else {
                    PitchModel.rootFreq = 123.4;
                }
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
                    intervalId = setInterval(function() {
                        if (nextTickCount == wholeBeat) {
                            player.scheduleNote(880, startTime1, 40);
                            nextTickCount = 0;
                        }
                        nextTickCount++;
                        startTime1 = startTime1 + beatDuration / 1000;
                        local.callScheduledAction();
                        local.watcher.handleBeep();
                    }, tickDuration);
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

            var StartingState = function() {
                var beepCount = 0;
                this.handleBeep = function() {
                    gameController.setState(new PlayState(exerciseIndex));
                    gameController.setIntervalHandler(function(interval) {
                        // display.markPitch(interval, Date.now() - singTime);
                    });
                    //loadExercise();
                    clock.scheduleAction(function() {
                        beepCount++;
                        if (beepCount == 1) {
                            //gameController.setState(new PlayState(exerciseIndex));
                        }

                    });

                };
                this.handleNewInterval = function() {
                    display.markPitch(interval, Date.now() - singTime);
                };
            };
 
            var PlayState = function(exerciseIndex) {
                var currentNoteIdx = 5;
                var local = this;
                var count = 0;

                this.handleBeep = function() {
                    if (count == 0) {
                        //Play now (listen first)
                        playSound(0);
                        display.clearUserPoints();
                        recorderWorker.postMessage({
                            command: 'clear'
                        });
                    }
                    if (count == totalBeats-1) {
                        // sing along this play sound
                        clock.scheduleNote();
                    }
                    if (count == totalBeats*3-1) {
                        gameController.setState(new FeedbackState(exerciseIndex));
                    }
                    display.drawIndicator(count, beatDuration, 1, 4, 1, totalBeats*3);
                    count++;
                    
                    clock.scheduleAction(function() {
                        //display.drawIndicator(count*totalBeats, beatDuration, totalBeats, 4, 1);
                        if (count > totalBeats-1) {
                            gameController.setIntervalHandler(function(data) {
                                recorderWorker.postMessage({
                                  command: 'record',
                                  floatarray: data
                                });
                            });
                        }
                    });
                };
            };

            var FeedbackState = function(exerciseIndex) {
                var local = this;
                var count = 0;
                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        if (count == 0) {
                            gameController.setIntervalHandler(function(interval) {
                                // display.markPitch(interval, Date.now() - singTime);
                            });
                            recorderWorker.postMessage({
                                command: 'concat'
                              });
                            $scope.playClicked();
                            // display.plotExerciseData(arrayTime, arrayPitch, totalBeats, 1000/beatDuration, true);
                        }
                        if (count == 1) {
                            gameController.setState(new PlayState(exerciseIndex));
                            // $scope.playClicked();
                        }
                        count++;
                    });
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
                  computePitchGraph(e.data.floatarray);
                  // playConcatenated(e.data.floatarray);
                  globalArray = e.data.floatarray;
                  break;
              }
            };

            function setIndex(t0) {
                var i = 0, j = $scope.song.timeSeries.length-1;
                var temp = 0;
                while (j-i > 1) {
                    temp = parseInt((i+j)/2);
                    if ($scope.song.timeSeries[temp] > t0) {
                        j = temp;
                    } else {
                        i = temp;
                    }
                    
                }
                return j;
            }

            function loadSound() { 
              var url = "er-shell/audio/"+$scope.song.path;
              var request = new XMLHttpRequest();
              request.open('GET', url, true);
              request.responseType = 'arraybuffer';

              // Decode asynchronously
              request.onload = function() {
                audioContext.decodeAudioData(request.response, function(buffer) {
                songBuffer = buffer;
                loadExercise();
                }, function() {console.log("error on loading audio file.")});
              }
              request.send();
            }

            function playSound(time) {
              var source = audioContext.createBufferSource(); // creates a sound source
              source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
              if (stretchedBuffer) {
                source.buffer = stretchedBuffer;
                source.start(time);
              } else {
                source.buffer = songBuffer;                    // tell the source which sound to play
                // var exercise = $scope.song.exercises[exerciseIndex];
                source.start(time, rStart, rEnd - rStart);                           // play the source now
              }
            }

            function computePitchGraph(floatarray) {
              var offset = 0;
              var incr = 256;
              var buffsize = 2048;
              var pitchArray = [];
              while (offset + buffsize < floatarray.length) {
                var subarray = new Float32Array(buffsize);
                for (var i = 0; i < buffsize; i++) {
                  subarray[i] = floatarray[offset + i];
                }
                // floatarray.subarray(offset,offset+buffsize);
                var pitch = detector.findPitch(subarray);
                if (pitch !== 0) {
                  PitchModel.currentFreq = pitch;
                  PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                  pitchArray.push(PitchModel.currentInterval);
                } else pitchArray.push(-100);
                offset = offset + incr;
              }
              display.plotData(pitchArray, totalBeats, 1000/beatDuration);
            };

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
                var t0 = 0;
                var t1 = songBuffer.duration;
                // var exercise = $scope.song.exercises[exerciseIndex];
                // totalBeats = Math.ceil(t1 - t0);
                //defaultBeatDurtion = (t1 - t0)*1000 + 300;
                beatDuration = defaultBeatDurtion/$scope.tempo;
                startIndex = setIndex(t0);
                endIndex = setIndex(t1);
                arrayTime = $scope.song.timeSeries.slice(startIndex-1, endIndex-1);
                var aPitch = $scope.song.pitchSeries.slice(startIndex-1, endIndex-1);
                arrayPitch = [];
                for (var i = 0; i < aPitch.length; i++) {
                    var pitch = MusicCalc.getCents(PitchModel.rootFreq, aPitch[i]) / 100;
                    arrayPitch.push(pitch);
                }
                display.plotExerciseData(arrayTime, arrayPitch, 0.0, 1000/beatDuration, false);
                if ($scope.tempo < 1) {
                    calculateStretchedBuffer();
                } else {
                    stretchedBuffer = null;
                }
            }

            function calculateStretchedBuffer() {
                stretcher = new TimeStretcher(songBuffer, $scope.tempo, rStart, rEnd);
                stretchedBuffer = stretcher.out();
            }

            function restart() {
                $scope.score = 0;
                singTime = Date.now();
                clock.stop();
                clock = new Clock(beatDuration);
                clock.registerWatcher(gameController);
                clock.start();
                // display.setTimeUnit(beatDuration);
                gameController.setState(new PlayState());
            }

            function cancelCurrentLoop() {
                marker = 0;
                clearInterval(currLoopId);
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
                } else {
                    restart();
                    $("#PlayButton").addClass("Playing");
                    $("#play-icon").removeClass("icon-svg_play");
                    $("#play-icon").addClass("icon-svg_pause");
                    $scope.startMic();
                }
            };

            $scope.next = function() {
                if (exerciseIndex < $scope.song.exercises.length-1) {
                    exerciseIndex++;
                    loadExercise();
                }
            };

            $scope.prev = function() {
                if (exerciseIndex > 0) {
                    exerciseIndex--;
                    loadExercise();
                }
            };

            $scope.last = function() {
                exerciseIndex = $scope.song.exercises.length-1;
                loadExercise();
            };

            $scope.playRecord = function() {
                playConcatenated(globalArray);
            };

            $scope.play = function() {
                playSound(0);
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

            // var SingState = function(exerciseIndex) {
            //     var currentNoteIdx = 0;
            //     var local = this;
            //     var count = 0;
            //     this.handleBeep = function() {
            //         display.drawIndicator(count, beatDuration, 1, 7, 1);
            //         if (count == 0) {
            //             gameController.setIntervalHandler(function(data) {
            //                 recorderWorker.postMessage({
            //                   command: 'record',
            //                   floatarray: data
            //                 });
            //                 // display.markPitch(interval, Date.now() - singTime);
            //             });    
            //         } 
            //         if (count == totalBeats - 1) {
            //             gameController.setState(new FeedbackState(exerciseIndex));
            //         }
            //         count++;
            //         clock.scheduleAction(function() {
            //         });
            //     };
            // };
        });
    });