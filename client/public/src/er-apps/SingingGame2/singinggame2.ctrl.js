define(['./module', 'note', 'webaudioplayer', 'voiceplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer', './levels',
        './states/boot', './states/level', './states/preload', './states/levelboard'],
    function(app, Note, Player, VoicePlayer, CurrentAudioContext, MusicCalc, MicUtil, 
        PitchDetector, StabilityDetector, AudioBuffer, scorer, levels, Boot, Level, Preload, Levelboard) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);
        var voicePlayer;

        app.controller('SingingGame2Ctrl', function($scope, $rootScope, PitchModel, User, $http, $window, ScoreService) {
            var game = new Phaser.Game(654, 572, Phaser.AUTO, 'singinggame2');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('level', Level);
            game.state.add('levelboard', Levelboard);
            game.state.add('preload', Preload);

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
            // Load user medals
            $http.get('/medal/' + $window.localStorage.userId + "/singinggame2")
              .success(function(data) {
                  game.starArray = data;
                  game.state.start('boot');
              }).error(function(status, data) {
                  console.log("failed");
                  console.log(data);
              });

             User.get({
                id: $window.localStorage.userId
              }).$promise.then(function(user) {
                $scope.gender = user.gender;
                if ($scope.gender == "man") {
                    $scope.rootNote = 47;
                    voicePlayer = new VoicePlayer(audioContext, 'male');
                } else {
                    $scope.rootNote = 59;
                    voicePlayer = new VoicePlayer(audioContext, 'female');
                }
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

            game.start = function() {
                exercises = $scope.levels[game.level-1].exercises;
                reset();
            }

             if (!game.events) game.events = {};
              // save score event
              game.events.onLevelCompleted = new Phaser.Signal();
              game.events.onLevelCompleted.add(onLevelCompleted);

              function onLevelCompleted(level, medal, score) {
                // Save Score
                ScoreService.save("singinggame2", level, score);
                // Save Medals
                var levelScore = game.starArray[level-1];
                if (levelScore.medal >= medal && levelScore.score >= score) {
                    return;
                }
                levelScore.medal = Math.max(levelScore.medal, medal);
                levelScore.score = Math.max(levelScore.score, score);
                var userId = $window.localStorage.userId;
                  $http.post('/medal', levelScore).success(function(data) {
                    if (data && data.level) {
                      game.starArray[level-1] = data;
                    }
                  }).error(function(status, data) {
                      console.log("failed");
                      console.log(data);
                  });
            }

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
                    $scope.startMic();
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
            // clock.start();

            var StartingState = function() {
                var beepCount = 0;
                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        gameController.setIntervalHandler(function(interval) {
                            // display.markPitch(interval, Date.now() - singTime);
                        });
                        beepCount++;
                        if (beepCount === 1) {
                            gameController.setState(new PlayState(0));
                        }

                    });

                };
                this.handleNewInterval = function() {
                    // display.markPitch(interval, Date.now() - singTime);
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
                            game.state.getCurrentState().clear();
                            if ($scope.attempt >= maxBlindAttempt) {
                                game.state.getCurrentState().drawExercise(local.exercise, beatDuration);
                            }
                            game.state.getCurrentState().drawRange(yRange, local.exercise.length, beatDuration, false);
                            singTime = Date.now() + beatDuration;
                            gameController.setIntervalHandler(function(interval) {
                                // game.state.getCurrentState().markPitch(interval, Date.now()-singTime);
                            });
                        }
                        game.state.getCurrentState().animateMarker(yRange, beatDuration, currentNoteIdx, beatDuration, 'Play');
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
                                game.state.getCurrentState().levelCompleted();
                                return;
                            }
                            if ($scope.attempt >= maxAttempt) {
                                game.state.getCurrentState().gameOver();
                                return;
                            }
                            // do nothing
                            if (nextState === 'sing') {
                                game.state.getCurrentState().animateMarker(yRange, beatDuration, 0, 0, 'Sing');
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
                            singTime = Date.now() - beatDuration;
                        }
                        (function(noteIndex) {
                            gameController.setIntervalHandler(function(interval) {
                                interval = pitchCorrection(interval, local.exercise[noteIndex]);
                                var roundedInterval = Math.round(interval);
                                game.state.getCurrentState().markPitchFeedback(roundedInterval, Date.now() - singTime, scorer.scorePoint(roundedInterval, local.exercise[noteIndex]));
                                game.state.getCurrentState().markPitch(interval, Date.now()-singTime);
                            });
                        })(currentNoteIdx);
                        if (currentNoteIdx == 0) {
                            game.state.getCurrentState().animateMarker(yRange, beatDuration, currentNoteIdx, beatDuration, 'Sing');
                            currentNoteIdx++;
                            // do nothing
                        } else if (currentNoteIdx < local.exercise.length) {
                            game.state.getCurrentState().animateMarker(yRange, beatDuration, currentNoteIdx, beatDuration, 'Sing');
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
                                game.state.getCurrentState().markAnswer(interval, index*1000 + 500, local.exercise[index] == interval, beatDuration);
                                if (local.exercise[index] != interval) allCorrect = false;
                            })
                            if (allCorrect) {
                                game.state.getCurrentState().addScore($scope.score - $scope.attempt);
                                $scope.attempt = 0;
                                $scope.totalScore += $scope.score;
                                gameController.setState(new IdleState(exerciseIndex + 1, 'play'));
                            }
                            else {
                                game.state.getCurrentState().failed();
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
                return expected + diff;
            }

        });
    });