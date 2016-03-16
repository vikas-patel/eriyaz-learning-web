define(['./module', './display', 'note', 'webaudioplayer', 'voiceplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer', './levels'],
    function(app, Display, Note, Player, VoicePlayer, CurrentAudioContext, MusicCalc, MicUtil, 
        PitchDetector, StabilityDetector, AudioBuffer, scorer, levels) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);
        var voicePlayer;

        app.controller('SingingGame2Ctrl', function($scope, $rootScope, PitchModel) {
            $scope.levels = levels;
            $scope.level = levels[0];
            exercises = $scope.level.exercises;
            $scope.rootNote = 47;
            $scope.score = 0;
            $scope.totalScore = 0;
            $scope.gender = "man";
            $scope.scoreByNote = [];
            $scope.attempt = 0;
            var maxAttempt = 5;
            var maxBlindAttempt = 3;
            var display = new Display();

            var currRoot;
            var currThat;

            var marker = 0;
            var baseFreq = 261;
            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            var beatDuration = 1000;

            var currActiveNote = 0;
            var singTime = Date.now();
            var Clock = function(tickDuration) {
                var intervalId = 0;
                this.watcher = null;
                var nullAction = function() {
                    console.log("null action");
                };
                this.nextBeepAction = nullAction;
                var startTime1;

                this.registerWatcher = function(watcher) {
                    this.watcher = watcher;
                };

                this.start = function() {
                    console.log("start");
                    startTime1 = audioContext.currentTime + beatDuration / 1000;
                    var local = this;
                    intervalId = setInterval(function() {
                        player.scheduleNote(880, startTime1, 40);
                        startTime1 = startTime1 + beatDuration / 1000;
                        local.callScheduledAction();
                        local.watcher.handleBeep();
                    }, tickDuration);
                };
                this.stop = function() {
                    clearInterval(intervalId);
                };

                this.scheduleNote = function(noteNum) {
                    //schedule note for next beep.
                    voicePlayer.schedule(noteNum, startTime1, beatDuration);
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
            clock.start();

            var StartingState = function() {
                var beepCount = 0;
                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        gameController.setIntervalHandler(function(interval) {
                            display.markPitch(interval, Date.now() - singTime);
                        });
                        beepCount++;
                        if (beepCount === 1) {
                            gameController.setState(new PlayState(0));
                        }

                    });

                };
                this.handleNewInterval = function() {
                    display.markPitch(interval, Date.now() - singTime);
                };
            };

            var PlayState = function(exerciseIndex) {
                this.exercise = exercises[exerciseIndex];
                var currentNoteIdx = 0;
                var yRange = Math.max(3, _.max(this.exercise));
                var beatCount = 0;
                var local = this;

                this.handleBeep = function() {
                    clock.scheduleNote(this.exercise[currentNoteIdx] + $scope.rootNote);
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            display.clearPlayMarkers();
                            display.clearPitchMarkers();
                            display.clearAnswerMarkers();
                            display.clearExercise();
                            if ($scope.attempt >= maxBlindAttempt) {
                                display.loadExercise(local.exercise, beatDuration);
                            }
                            
                            display.drawRange(yRange, local.exercise.length, beatDuration, false);
                            singTime = Date.now() + beatDuration;
                            gameController.setIntervalHandler(function(interval) {

                                // display.markPitch(interval, Date.now() - singTime);
                            });
                        }

                        // display.playAnimate(local.exercise[currentNoteIdx], beatDuration, currentNoteIdx);
                        display.traversePosition(yRange, beatDuration, currentNoteIdx, beatDuration);
                        if (currentNoteIdx < local.exercise.length - 1)
                            currentNoteIdx++;
                        else {

                            gameController.setState(new IdleState(exerciseIndex, 'sing'));
                        }
                        beatCount++;
                    });

                };
            };

            var IdleState = function(exerciseIndex, nextState) {
                this.exercise = exercises[exerciseIndex];
                var yRange = Math.max(3, _.max(this.exercise));
                var beatCount = 0;
                var local = this;

                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            beatCount++;
                            if (exerciseIndex == exercises.length) {
                                alert('Level Completed. Your Score: '+ $scope.totalScore);
                                return;
                            }
                            if ($scope.attempt >= maxAttempt) {
                                alert('Game Over. Your Score: '+ $scope.totalScore);
                                return;
                            }
                            // do nothing
                            if (nextState === 'sing') {
                                display.drawRange(yRange, local.exercise.length, beatDuration, true);
                                display.traversePosition(yRange, beatDuration, 0, 0);
                                gameController.setState(new SingState(exerciseIndex));
                            } else {
                                gameController.setState(new PlayState(exerciseIndex));    
                            }
                        }
                    });

                };
            };

            var SingState = function(exerciseIndex) {
                this.exercise = exercises[exerciseIndex];
                var yRange = Math.max(3, _.max(this.exercise));
                var currentNoteIdx = 0;
                var beatCount = 0;
                var local = this;
                var score = 0;
                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            display.clearPlayMarkers();
                            display.clearPitchMarkers();
                            singTime = Date.now() - beatDuration;
                        }
                        (function(noteIndex) {
                            gameController.setIntervalHandler(function(interval) {
                                interval = pitchCorrection(interval, local.exercise[noteIndex]);
                                display.markPitch(interval, Date.now() - singTime);
                                var roundedInterval = Math.round(interval);
                                display.markPitchFeedback(roundedInterval, Date.now() - singTime, scorer.scorePoint(roundedInterval, local.exercise[noteIndex]));
                                // $scope.$apply();
                            });
                        })(currentNoteIdx);
                        if (currentNoteIdx == 0) {
                            display.traversePosition(yRange, beatDuration, currentNoteIdx, beatDuration);
                            currentNoteIdx++;
                            // do nothing
                        } else if (currentNoteIdx < local.exercise.length) {
                            display.traversePosition(yRange, beatDuration, currentNoteIdx, beatDuration);
                            $scope.scoreByNote.push(scorer.getAnswer(local.exercise[currentNoteIdx-1]));
                            score += scorer.getExerciseScore()/local.exercise.length;
                            currentNoteIdx++;
                            scorer.reset();
                        } else {
                            $scope.scoreByNote.push(scorer.getAnswer(local.exercise[currentNoteIdx-1]));
                            score += scorer.getExerciseScore()/local.exercise.length;
                            $scope.score = Math.round(10*score);
                            var allCorrect = true;
                            $scope.scoreByNote.forEach(function(interval, index) {
                                display.markAnswer(interval, index*1000 + 500, local.exercise[index] == interval, beatDuration);
                                if (local.exercise[index] != interval) allCorrect = false;
                            });
                            if (allCorrect) {
                                $scope.attempt = 0;
                                $scope.totalScore += $scope.score;
                                gameController.setState(new IdleState(exerciseIndex + 1, 'play'));
                            }
                            else {
                                gameController.setState(new IdleState(exerciseIndex, 'play'));
                                $scope.attempt++;

                            }
                            gameController.setIntervalHandler(function(interval) {
                                // display.markPitch(interval, Date.now() - singTime);
                            });

                            scorer.reset();
                             $scope.scoreByNote = [];
                            $scope.$apply();

                        }
                        beatCount++;
                    });

                };
            };

            gameController.setState(new StartingState());


            var updatePitch = function(data) {
                var pitch = detector.findPitch(data);
                if (pitch !== 0) {
                    PitchModel.currentFreq = pitch;
                    PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                    // if ($scope.isPending) {
                    gameController.handleNewInterval(PitchModel.currentInterval);
                    // }
                } else {
                    // gameController.handleNewInterval(NaN);
                }
            };

            $scope.$watch('rootNote', function() {
                currRoot = parseInt($scope.rootNote);

                baseFreq = MusicCalc.midiNumToFreq(currRoot);
                PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
            });

            $scope.$on("$destroy", function() {
                clock.stop();
                if (micStream)
                    micStream.stop();
            });

            $scope.$watch('gender', function() {
                if ($scope.gender == "man") {
                    $scope.rootNote = 47;
                    voicePlayer = new VoicePlayer(audioContext, 'male');
                } else {
                    $scope.rootNote = 59;
                    voicePlayer = new VoicePlayer(audioContext, 'female');
                }
            });

            $scope.$watch('level', function() {
                exercises = $scope.level.exercises;
                reset();
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
                display.setFlash("Click 'New' to hear Tones");
            };

            function reset() {
                $scope.score = 0;
                $scope.totalScore = 0;
                $scope.scoreByNote = [];
                $scope.attempt = 0;
                singTime = Date.now();
                clock.stop();
                clock.start();
                gameController.setState(new StartingState());
            }

            function isDisabled(element, index, array) {
                return !element.enabled;
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
                console.log(actual + " " + (expected+diff));
                return expected + diff;
            }

        });
    });