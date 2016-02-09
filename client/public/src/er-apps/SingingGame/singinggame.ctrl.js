define(['./module', './sequencegen', './display', './exercises', 'note', 'webaudioplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer'
    ],
    function(app, sequenceGen, Display, exercises, Note, Player, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, scorer) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('SingingGameCtrl', function($scope, $rootScope, PitchModel) {
            $scope.rootNote = 46;
            $scope.score = 0;
            var display = new Display();

            var currRoot;
            var currThat;

            var marker = 0;
            var baseFreq = 261;
            var playTime = 1000;

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
                var startTime1 = audioContext.currentTime + beatDuration / 1000;

                this.registerWatcher = function(watcher) {
                    this.watcher = watcher;
                };

                this.start = function() {
                    console.log("start");
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
                    player.scheduleNote(MusicCalc.midiNumToFreq(noteNum), startTime1, beatDuration);
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
                var beatCount = 0;
                var local = this;

                this.handleBeep = function() {
                    clock.scheduleNote(this.exercise[currentNoteIdx] + $scope.rootNote);
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            display.clearPlayMarkers();
                            display.clearPitchMarkers();
                            display.loadExercise(local.exercise);
                            singTime = Date.now() + 1000;
                            gameController.setIntervalHandler(function(interval) {
                                display.markPitch(interval, Date.now() - singTime);
                            });
                        }

                        display.playAnimate(local.exercise[currentNoteIdx], beatDuration, currentNoteIdx);
                        if (currentNoteIdx < local.exercise.length - 1)
                            currentNoteIdx++;
                        else {

                            gameController.setState(new SingState(exerciseIndex));
                        }
                        beatCount++;
                    });

                };
            };

            var SingState = function(exerciseIndex) {
                this.exercise = exercises[exerciseIndex];
                var currentNoteIdx = 0;
                var beatCount = 0;
                var local = this;
                this.handleBeep = function() {
                    clock.scheduleAction(function() {
                        if (beatCount === 0) {
                            display.clearPlayMarkers();
                            display.clearPitchMarkers();
                            singTime = Date.now();

                        }
                        (function(noteIndex) {
                            gameController.setIntervalHandler(function(interval) {
                                display.markPitch(interval, Date.now() - singTime);
                                var roundedInterval = Math.round(interval);
                                display.markPitchFeedback(roundedInterval, Date.now() - singTime, scorer.scorePoint(roundedInterval, local.exercise[noteIndex]));
                                $scope.score = scorer.getExerciseScore();
                                $scope.$apply();
                            });
                        })(currentNoteIdx);
                        if (currentNoteIdx < local.exercise.length - 1)
                            currentNoteIdx++;
                        else {
                            if (scorer.getExerciseScore() > 0.7)
                                gameController.setState(new PlayState(exerciseIndex + 1));
                            else gameController.setState(new PlayState(exerciseIndex));
                            scorer.reset();
                            $scope.score = 0;
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
                    gameController.handleNewInterval(NaN);
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

            function isDisabled(element, index, array) {
                return !element.enabled;
            }

          
            function cancelCurrentLoop() {
                marker = 0;
                clearInterval(currLoopId);
            }

           

        });
    });