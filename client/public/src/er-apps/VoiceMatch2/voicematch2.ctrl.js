define(['./module', 'note', 'webaudioplayer', 'voiceplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', 'tone', './scorer', './levels',
        './states/boot', './states/level', './states/preload', './states/levelboard'],
    function(app, Note, Player, VoicePlayer, CurrentAudioContext, MusicCalc, MicUtil, 
        PitchDetector, StabilityDetector, AudioBuffer, Tone, scorer, Levels, Boot, Level, Preload, Levelboard) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);
        var voicePlayer;

        app.controller('VoiceMatch2Ctrl', function($scope, $rootScope, PitchModel, User, $http, $window, ScoreService) {
            var game = new Phaser.Game(654, 572, Phaser.CANVAS, 'voicematch2');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('level', Level);
            game.state.add('levelboard', Levelboard);
            game.state.add('preload', Preload);

            $scope.rootNote = 47;
            $scope.score = 0;
            $scope.totalScore = 0;
            $scope.gender = "man";
            $scope.scoreByNote = [];
            $scope.attempt = 0;
            var level;
            var currentNote;
            var repeat = false;
            var maxAttempt = 5;
            var maxBlindAttempt = 3;
            var maxBeatCount;
            var maxExerciseCount = 10;

            var currRoot;
            var currThat;

            var marker = 0;
            var baseFreq = 261;
            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            var beatDuration = 1500;
            game.beatDuration = 1500;

            var currActiveNote = 0;
            var singTime = Date.now();
            // var synth = new Tone.PolySynth(3, Tone.SimpleSynth).set({
            //     'volume' : 4,
            //     'oscillator' : {
            //         'type' : 'triangle17',
            //         // 'partials' : [16, 8, 4, 2, 1, 0.5, 1, 2]
            //     },
            //     'envelope' : {
            //         'attack' : 0.01,
            //         'decay' : 0.1,
            //         'sustain' : 0.2,
            //         'release' : 1.7,
            //     }
            // }).toMaster();
            // Load user medals
            var synth = new Tone.Synth().toMaster();
            $http.get('/medal/' + $window.localStorage.userId + "/voicematch2")
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
                level = Levels[game.level-1];
                maxBeatCount = level.maxNotes;
                reset();
            }

             if (!game.events) game.events = {};
              // save score event
              game.events.onLevelCompleted = new Phaser.Signal();
              game.events.onLevelCompleted.add(onLevelCompleted);

              function onLevelCompleted(level, medal, score) {
                // Save Score
                ScoreService.save("voicematch2", level, score);
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
                    if (level.isInstrument) {
                        synth.triggerAttackRelease(MusicCalc.midiNumToFreq(noteNum), level.duration/1000, '+'+(startTime1- audioContext.currentTime));
                    } else {
                        //schedule note for next beep.
                        voicePlayer.schedule(noteNum, startTime1, level.duration);
                    }
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
                    if (this.intervalHandler) this.intervalHandler(interval);
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
                // this.handleNewInterval = function() {
                //     // display.markPitch(interval, Date.now() - singTime);
                // };
            };

            var PlayState = function(exerciseIndex) {
                var yRange = Math.max(3, _.max(level.notes));
                var beatCount = 0;
                if (!repeat) {
                    currentNote = level.notes[Math.floor(Math.random()*level.notes.length)];
                }
                var local = this;

                this.handleBeep = function() {
                    // play alternate beat
                    if (beatCount%2 == 0) clock.scheduleNote(currentNote + $scope.rootNote);
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            game.state.getCurrentState().clear();
                            if (!repeat) game.state.getCurrentState().clearAnswer();
                            if ($scope.attempt >= maxBlindAttempt) {
                                for (var i = 1; i <= maxBeatCount; i = i+2) {
                                    game.state.getCurrentState().drawExercise(currentNote, beatDuration*i);
                                }
                            }
                            game.state.getCurrentState().drawRange(yRange, maxBeatCount, beatDuration, false);
                            singTime = Date.now() + beatDuration;
                            gameController.setIntervalHandler(function(interval) {
                                // game.state.getCurrentState().markPitch(interval, Date.now()-singTime);
                            });
                        }
                        game.state.getCurrentState().animateMarker(yRange, beatDuration, beatCount, beatDuration, 'Play');
                        if (beatCount == maxBeatCount-1) {
                            gameController.setState(new IdleState(exerciseIndex, 'sing'));
                        }
                        beatCount++;
                    });

                };
            };

            var IdleState = function(exerciseIndex, nextState) {
                var yRange = Math.max(3, _.max(level.notes));
                var beatCount = 0;
                var local = this;

                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            beatCount++;
                            if (exerciseIndex == maxExerciseCount) {
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
                var yRange = Math.max(3, _.max(level.notes));
                var currentNoteIdx = 0;
                var beatCount = 0;
                var local = this;
                var score = 0;
                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            singTime = Date.now() - beatDuration;
                        }
                        (function(note) {
                            gameController.setIntervalHandler(function(interval) {
                                interval = pitchCorrection(interval, note);
                                var roundedInterval = Math.round(interval);
                                if (beatCount%2 == 1) {
                                    game.state.getCurrentState().markPitchFeedback(roundedInterval, Date.now() - singTime, scorer.scorePoint(roundedInterval, note));
                                    game.state.getCurrentState().markPitch(interval, Date.now()-singTime);
                                }
                            });
                        })(currentNote);
                        if (beatCount == 0) {
                            game.state.getCurrentState().animateMarker(yRange, beatDuration, beatCount, beatDuration, 'Sing');
                            // do nothing
                        } else if (beatCount < maxBeatCount) {
                            game.state.getCurrentState().animateMarker(yRange, beatDuration, beatCount, beatDuration, 'Sing');
                            if (beatCount%2==1) {
                                $scope.scoreByNote.push(scorer.getAnswer(currentNote));
                                if (maxBeatCount == 1) score += scorer.getExerciseScore()/maxBeatCount;
                                else score += scorer.getExerciseScore()/(maxBeatCount/2 + 0.5);
                                scorer.reset();
                            }
                        } else {
                            $scope.scoreByNote.push(scorer.getAnswer(currentNote));
                            if (maxBeatCount == 1) score += scorer.getExerciseScore()/maxBeatCount;
                            else score += scorer.getExerciseScore()/(maxBeatCount/2 + 0.5);
                            $scope.score = Math.round(10*score);
                            var allCorrect = true;
                            $scope.scoreByNote.forEach(function(interval, index) {
                                game.state.getCurrentState().markAnswer(interval, 2*index*beatDuration + beatDuration/2, 
                                    interval - currentNote, beatDuration, $scope.attempt != 0);
                                if (currentNote != interval) allCorrect = false;
                            })
                            if (allCorrect) {
                                game.state.getCurrentState().addScore($scope.score - $scope.attempt);
                                $scope.attempt = 0;
                                $scope.totalScore += $scope.score;
                                repeat = false;
                                gameController.setState(new IdleState(exerciseIndex + 1, 'play'));
                            }
                            else {
                                game.state.getCurrentState().failed();
                                repeat = true;
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
                if (micStream) MicUtil.stopStream(micStream);
                game.destroy();
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