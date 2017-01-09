define(['./module', './sequencegen', './display', './songs', 'note', 'webaudioplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer'
    ],
    function(app, sequenceGen, Display, songs, Note, Player, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, scorer) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('SongPracticeCtrl', function($scope, $rootScope, PitchModel) {
            $scope.rootNote = 46;
            $scope.score = 0;
            var display = new Display();

            var currRoot;
            var currThat;

            var marker = 0;
            var baseFreq = 261;

            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            $scope.tempo = 1;
            var beatDuration = songs.beatDuration;

            var currActiveNote = 0;
            var exerciseIndex = 0;
            var singTime = Date.now();
            var wholeBeat = songs.wholeBeat;
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
                    player.scheduleNote(MusicCalc.midiNumToFreq(noteNum), startTime1, beatDuration*beats);
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
                    clock.scheduleAction(function() {
                        gameController.setIntervalHandler(function(interval) {
                            display.markPitch(interval, Date.now() - singTime);
                        });
                        beepCount++;
                        if (beepCount === 1) {
                            gameController.setState(new PlayState(exerciseIndex));
                        }

                    });

                };
                this.handleNewInterval = function() {
                    display.markPitch(interval, Date.now() - singTime);
                };
            };

            var PlayState = function() {
                this.exercise = songs.lines[exerciseIndex];
                var currentNoteIdx = -1;
                var beatCount = 0;
                var local = this;
                var beatsLeft = 0;
                var totalBeats = 0;

                this.handleBeep = function() {
                    
                    if (beatsLeft == 0) {
                        currentNoteIdx++;
                        var note = this.exercise[currentNoteIdx].note;
                        beatsLeft = this.exercise[currentNoteIdx].beats;
                        // handle break
                        if (note != -100) {
                            clock.scheduleNote(note + $scope.rootNote, beatsLeft);   
                        }
                    }
                    
                    clock.scheduleAction(function() {
                        if (local.exercise[currentNoteIdx].beats == beatsLeft){
                            if (currentNoteIdx == 0) {
                                display.clearPlayMarkers();
                                display.clearPitchMarkers();
                                display.clearIndicator();
                                display.loadExercise(local.exercise);
                                singTime = Date.now() + beatDuration;
                                gameController.setIntervalHandler(function(interval) {
                                    // display.markPitch(interval, Date.now() - singTime);
                                });
                            }
                            display.playAnimate(local.exercise[currentNoteIdx].note, beatDuration, totalBeats, beatsLeft);
                            totalBeats += local.exercise[currentNoteIdx].beats;
                        }
                        if (currentNoteIdx == local.exercise.length - 1 && beatsLeft == 1) {
                            gameController.setState(new SingState(exerciseIndex));
                        }
                        beatsLeft--;
                    });

                };
            };

            var SingState = function(exerciseIndex) {
                this.exercise = songs.lines[exerciseIndex];
                var currentNoteIdx = 0;
                var beatCount = 0;
                var local = this;
                var beatsLeft = 0;
                var totalBeats = 0;
                var maxNote = _.max(this.exercise, _.property('note')).note;
                var minNote = _.min(this.exercise, _.property('note')).note;
                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        
                        if (beatsLeft == 0) {
                            if (currentNoteIdx == 0) {
                                display.clearPlayMarkers();
                                display.clearPitchMarkers();
                                singTime = Date.now();
                            }
                            beatsLeft = local.exercise[currentNoteIdx].beats;
                            display.drawIndicator(totalBeats, beatDuration, beatsLeft, maxNote, minNote);
                            totalBeats += local.exercise[currentNoteIdx].beats;
                            (function(noteIndex) {
                                gameController.setIntervalHandler(function(interval) {
                                    interval = pitchCorrection(interval, local.exercise[noteIndex].note);
                                    display.markPitch(interval, Date.now() - singTime);
                                    var roundedInterval = Math.round(interval);
                                    var expected = local.exercise[noteIndex].note;
                                    if (expected != -100) {
                                        display.markPitchFeedback(roundedInterval, Date.now() - singTime, scorer.scorePoint(roundedInterval, expected));
                                    }
                                });
                            })(currentNoteIdx);
                        }
                        if (beatsLeft == 1) {
                            if (currentNoteIdx == local.exercise.length - 1) {
                                gameController.setState(new PlayState(exerciseIndex));
                                $scope.score = scorer.getExerciseScore();
                                $scope.$apply();
                                scorer.reset();
                            } else {
                                currentNoteIdx++;
                            }
                        }
                        beatsLeft--;
                    });
                };
            };

            gameController.setState(new StartingState());

            var updatePitch = function(data) {
                var pitch = detector.findPitch(data);
                if (pitch !== 0) {
                    PitchModel.currentFreq = pitch;
                    PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                    gameController.handleNewInterval(PitchModel.currentInterval);
                } else {
                    gameController.handleNewInterval(NaN);
                }
            };

            $scope.$watch('rootNote', function() {
                currRoot = parseInt($scope.rootNote);

                baseFreq = MusicCalc.midiNumToFreq(currRoot);
                PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
            });

            $scope.$watch('tempo', function() {
                beatDuration = songs.beatDuration/$scope.tempo;
                if ($("#PlayButton").hasClass("Playing")) {
                    restart();
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
                if (exerciseIndex < songs.lines.length-1) {
                    exerciseIndex++;
                    display.loadExercise(songs.lines[exerciseIndex]);
                }
            };

            $scope.prev = function() {
                if (exerciseIndex > 0) {
                    exerciseIndex--;
                    display.loadExercise(songs.lines[exerciseIndex]);
                }
            };
        });
    });