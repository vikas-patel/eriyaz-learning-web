define(['./module', './sequencegen', './display', './songs', 'note', 'webaudioplayer', 'recorderworker', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer'
    ],
    function(app, sequenceGen, Display, songs, Note, Player, recorderWorker, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, scorer) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('SongPracticeCtrl', function($scope, $rootScope, PitchModel) {
            $scope.rootNote = 46;
            $scope.score = 0;
            var display = new Display();
            var url = "er-shell/audio/do-dil-short.wav";

            var currRoot;
            var currThat;
            var startIndex = 0;
            var endIndex = 0;

            var marker = 0;
            var baseFreq = 261;

            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            $scope.tempo = 1;
            var beatDuration = songs.beatDuration;
            var timeSeries = songs.timeSeries;
            var pitchSeries = songs.pitchSeries;
            var currActiveNote = 0;
            var exerciseIndex = 0;
            var singTime = Date.now();
            var songBuffer;
            var wholeBeat = 1;
            var totalBeats;
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

                this.scheduleNote = function(noteNum, beats) {
                    //schedule note for next beep.
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
                    gameController.setIntervalHandler(function(interval) {
                        // display.markPitch(interval, Date.now() - singTime);
                    });
                    clock.scheduleAction(function() {
                        beepCount++;
                        if (beepCount == 1) {
                            gameController.setState(new PlayState(exerciseIndex));
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
                        // clock.scheduleNote(currentNoteIdx + $scope.rootNote);
                        display.clearPoints();
                        recorderWorker.postMessage({
                            command: 'clear'
                        });
                        gameController.setIntervalHandler(function(interval) {
                            // display.markPitch(interval, Date.now() - singTime);
                        });
                        playSound(exerciseIndex);
                        exercise = songs.exercises[exerciseIndex];
                        totalBeats = Math.ceil(exercise.t1 - exercise.t0);
                        startIndex = setIndex(exercise.t0);
                        endIndex = setIndex(exercise.t1);
                    }
                    if (count == totalBeats - 1) {
                        gameController.setState(new SingState(exerciseIndex));
                    }
                    // display.playAnimate(currentNoteIdx, beatDuration, count, 1);
                    display.drawIndicator(count, beatDuration, 1, 4, 1);
                    count++;

                    // if (beatsLeft == 0) {
                    //     currentNoteIdx++;
                    //     var note = this.exercise[currentNoteIdx].note;
                    //     beatsLeft = this.exercise[currentNoteIdx].beats;
                    //     // handle break
                    //     if (note != -100) {
                    //         clock.scheduleNote(note + $scope.rootNote, beatsLeft);   
                    //     }
                    // }
                    
                    clock.scheduleAction(function() {
                        // if (local.exercise[currentNoteIdx].beats == beatsLeft){
                        //     if (currentNoteIdx == 0) {
                        //         display.clearPlayMarkers();
                        //         display.clearPitchMarkers();
                        //         display.clearIndicator();
                        //         display.loadExercise(local.exercise);
                        //         singTime = Date.now() + beatDuration;
                        //         gameController.setIntervalHandler(function(interval) {
                        //             // display.markPitch(interval, Date.now() - singTime);
                        //         });
                        //     }
                        //     display.playAnimate(local.exercise[currentNoteIdx].note, beatDuration, totalBeats, beatsLeft);
                        //     totalBeats += local.exercise[currentNoteIdx].beats;
                        // }
                        // if (currentNoteIdx == local.exercise.length - 1 && beatsLeft == 1) {
                        //     gameController.setState(new SingState(exerciseIndex));
                        // }
                        // beatsLeft--;
                    });

                };
            };

            var SingState = function(exerciseIndex) {
                var currentNoteIdx = 0;
                var local = this;
                var count = 0;
                this.handleBeep = function() {
                    display.drawIndicator(count, beatDuration, 1, 7, 1);
                    if (count == 0) {
                        gameController.setIntervalHandler(function(data) {
                            recorderWorker.postMessage({
                              command: 'record',
                              floatarray: data
                            });
                            // display.markPitch(interval, Date.now() - singTime);
                        });    
                    } 
                    if (count == totalBeats - 1) {
                        gameController.setState(new FeedbackState(exerciseIndex));
                    }
                    count++;
                    clock.scheduleAction(function() {
                        // if (beatsLeft == 0) {
                        //     if (currentNoteIdx == 0) {
                        //         display.clearPlayMarkers();
                        //         display.clearPitchMarkers();
                        //         singTime = Date.now();
                        //     }
                        //     beatsLeft = local.exercise[currentNoteIdx].beats;
                        //     display.drawIndicator(totalBeats, beatDuration, beatsLeft, maxNote, minNote);
                        //     totalBeats += local.exercise[currentNoteIdx].beats;
                        //     (function(noteIndex) {
                        //         gameController.setIntervalHandler(function(interval) {
                        //             interval = pitchCorrection(interval, local.exercise[noteIndex].note);
                        //             display.markPitch(interval, Date.now() - singTime);
                        //             var roundedInterval = Math.round(interval);
                        //             var expected = local.exercise[noteIndex].note;
                        //             if (expected != -100) {
                        //                 display.markPitchFeedback(roundedInterval, Date.now() - singTime, scorer.scorePoint(roundedInterval, expected));
                        //             }
                        //         });
                        //     })(currentNoteIdx);
                        // }
                        // if (beatsLeft == 1) {
                        //     if (currentNoteIdx == local.exercise.length - 1) {
                        //         gameController.setState(new PlayState(exerciseIndex));
                        //         $scope.score = scorer.getExerciseScore();
                        //         $scope.$apply();
                        //         scorer.reset();
                        //     } else {
                        //         currentNoteIdx++;
                        //     }
                        // }
                        // beatsLeft--;
                    });
                };
            };

            var FeedbackState = function(exerciseIndex) {
                var local = this;
                var count = 0;
                this.handleBeep = function() {
                    if (count == 0) {
                        gameController.setIntervalHandler(function(interval) {
                            // display.markPitch(interval, Date.now() - singTime);
                        });
                        recorderWorker.postMessage({
                            command: 'concat'
                          });
                        var exercise = songs.exercises[exerciseIndex];
                        var arrayTime = timeSeries.slice(startIndex-1, endIndex-1);
                        var aPitch = pitchSeries.slice(startIndex-1, endIndex-1);
                        var arrayPitch = [];
                        for (var i = 0; i < aPitch.length; i++) {
                            var pitch = MusicCalc.getCents(PitchModel.rootFreq, aPitch[i]) / 100;
                            arrayPitch.push(pitch);
                        }
                    }
                    display.plotExerciseData(arrayTime, arrayPitch);
                    count++; 
                    $scope.playClicked();
                    clock.scheduleAction(function() {
                    });
                };
            };
            loadSound(url);
            gameController.setState(new StartingState());
            gameController.setIntervalHandler(function(interval) {
                // yet to initialize
            });
            var updatePitch = function(data) {
                gameController.handleNewInterval(data);
                // var pitch = detector.findPitch(data);
                // if (pitch !== 0) {
                //     PitchModel.currentFreq = pitch;
                //     PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                //     gameController.handleNewInterval(PitchModel.currentInterval);
                // } else {
                //     gameController.handleNewInterval(NaN);
                // }
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
                var i = 0, j = timeSeries.length-1;
                var temp = 0;
                while (j-i > 1) {
                    temp = parseInt((i+j)/2);
                    if (timeSeries[temp] > t0) {
                        j = temp;
                    } else {
                        i = temp;
                    }
                    
                }
                return j;
            }

            function loadSound(url) {
              var request = new XMLHttpRequest();
              request.open('GET', url, true);
              request.responseType = 'arraybuffer';

              // Decode asynchronously
              request.onload = function() {
                audioContext.decodeAudioData(request.response, function(buffer) {
                  songBuffer = buffer;
                }, function() {console.log("error on loading audio file.")});
              }
              request.send();
            }

            function playSound(exerciseIndex) {
              var source = audioContext.createBufferSource(); // creates a sound source
              source.buffer = songBuffer;                    // tell the source which sound to play
              source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
              var exercise = songs.exercises[exerciseIndex];
              source.start(0, exercise.t0, exercise.t1-exercise.t0);                           // play the source now
                                                         // note: on older systems, may have to use deprecated noteOn(time);
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
              display.plotData(pitchArray);
            };

            // $scope.$watch('rootNote', function() {
            //     currRoot = parseInt($scope.rootNote);

            //     baseFreq = MusicCalc.midiNumToFreq(currRoot);
            //     PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
            // });

            // $scope.$watch('tempo', function() {
            //     beatDuration = songs.beatDuration/$scope.tempo;
            //     if ($("#PlayButton").hasClass("Playing")) {
            //         restart();
            //     }
            // });

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

            function restart() {
                $scope.score = 0;
                singTime = Date.now();
                clock.stop();
                clock = new Clock(beatDuration);
                clock.registerWatcher(gameController);
                clock.start();
                display.setTimeUnit(beatDuration);
                gameController.setState(new StartingState());
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
                if (exerciseIndex < songs.exercises.length-1) {
                    exerciseIndex++;
                    //display.loadExercise(songs.lines[exerciseIndex]);
                }
            };

            $scope.prev = function() {
                if (exerciseIndex > 0) {
                    exerciseIndex--;
                    //display.loadExercise(songs.lines[exerciseIndex]);
                }
            };

            $scope.playRecord = function() {
                playConcatenated(globalArray);
            };

            $scope.play = function() {
                playSound(exerciseIndex);
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
            }
        });
    });