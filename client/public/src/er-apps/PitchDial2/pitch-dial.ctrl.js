  define(['./module', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'webaudioplayer', 'voiceplayer', './display', './levels', 'pitchdetector', 'music-calc', 'jquery', 'intensityfilter','./scorer'],
    function(app, MicUtil, CurrentAudioContext, AudioBuffer, WebAudioPlayer, VoicePlayer, Display,levels, PitchDetector, MusicCalc, $, IntensityFilter, scorer) {
      var audioContext = CurrentAudioContext.getInstance();
      app.controller('PitchDialCtrl2', function($scope, PitchModel, User, $window) {
        var labelsHindustani = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni", ""];
        var labelsCarnatic = ["Sa", "Re", "", "", "Ga", "Ma", "", "Pa", "Dha", "", "", "Ni", ""];
        $scope.rootNote = 56;
        $scope.genre  = "hindustani";
        $scope.progress = 0;
        $scope.loading = false;
        var micStream;
        $scope.volume = 0;

        $scope.levels = levels;
        $scope.level = levels[0];
        exercises = $scope.level.exercises;
        var beatDuration = 2000;
        $scope.attempt = 0;
        $scope.correct = 0;

        var display = new Display(labelsHindustani);
        display.draw();

        // User.get({
        //         id: $window.localStorage.userId
        //       }).$promise.then(function(user) {
        //         $scope.gender = user.gender;
        //         if ($scope.gender == "man") {
        //             $scope.rootNote = 47;
        //             voicePlayer = new VoicePlayer(audioContext, 'male');
        //         } else {
        //             $scope.rootNote = 58;
        //             voicePlayer = new VoicePlayer(audioContext, 'female');
        //         }
        //       });

        $scope.$watch('rootNote', function() {
          PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
        });

        $scope.$watch('genre', function(newValue, oldValue) {
              if (newValue == oldValue) return;
              if (newValue == "carnatic") {
                  display.setLabels(labelsCarnatic);
              } else {
                  display.setLabels(labelsHindustani);
              }
        });

        $scope.reward = function() {
            display.reward();
        };

        $scope.$on("$destroy", function() {
              // clock.stop();
              if(micStream) 
                micStream.stop();
        });

        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var updatePitch = function(data) {
          var pitch = detector.findPitch(data);
          if (pitch !== 0) {
            PitchModel.currentFreq = pitch;
            PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
            display.setValue(PitchModel.currentInterval);
            $scope.volume = 2*IntensityFilter.rootMeanSquare(data);
            gameController.handleNewInterval(PitchModel.currentInterval);
            $scope.$apply();
          }
        };


        $scope.startMic = function() {

          MicUtil.getMicAudioStream(
            function(stream) {
              micStream = stream;
              buffer = new AudioBuffer(audioContext, stream, 2048);
              buffer.addProcessor(updatePitch);
            }
          );
        };

        
        var Clock = function(tickDuration) {
                var intervalId = 0;
                this.watcher = null;
                var nullAction = function() {
                };
                this.nextBeepAction = nullAction;
                var startTime1;

                this.registerWatcher = function(watcher) {
                    this.watcher = watcher;
                };

                this.start = function() {
                    $scope.startMic();
                    startTime1 = audioContext.currentTime + beatDuration / 1000;
                    var local = this;
                    intervalId = setInterval(function() {
                        // player.scheduleNote(880, startTime1, 40);
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
                handleNewInterval: function(data) {
                    if (this.intervalHandler)   this.intervalHandler(data);
                }
            };

            // var clock = new Clock(beatDuration);
            // clock.registerWatcher(gameController);
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
                            // game.state.getCurrentState().clear();
                            // if ($scope.attempt >= maxBlindAttempt) {
                            //     game.state.getCurrentState().drawExercise(local.exercise, beatDuration);
                            // }
                            // game.state.getCurrentState().drawRange(yRange, local.exercise.length, beatDuration, false);
                            display.drawLabel();
                            singTime = Date.now() + beatDuration;
                            gameController.setIntervalHandler(function(data) {
                                // interval = getInterval(data);
                                // interval = pitchCorrection(interval, local.exercise[currentNoteIdx]);
                                // game.state.getCurrentState().markPitch(interval, Date.now()-singTime);
                            });
                            // game.state.getCurrentState().showMessage("Listen Now");
                        }
                        // game.state.getCurrentState().animateMarker(yRange, beatDuration, currentNoteIdx, beatDuration, 'Play');
                        if (currentNoteIdx < local.exercise.length - 1)
                            currentNoteIdx++;
                        else {
                            gameController.setState(new SingState(exerciseIndex, 'sing'));
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
                            gameController.setIntervalHandler(function(data) {
                              // do nothing
                            });
                            // game.state.getCurrentState().hideMessage();
                            if (exerciseIndex == exercises.length) {
                                // game.state.getCurrentState().levelCompleted();
                                return;
                            }
                            // if ($scope.attempt >= maxAttempt) {
                            //     game.state.getCurrentState().gameOver();
                            //     return;
                            // }
                            // do nothing
                            if (nextState === 'sing') {
                                // game.state.getCurrentState().animateMarker(yRange, beatDuration, 0, 0, 'Sing');
                                gameController.setState(new SingState(exerciseIndex));
                            } else {
                                // var consecutives = scorer.getConsecutiveCorrect(answers);
                                // if (consecutives > 2) {
                                //     if (levelIndex == levels.length - 1) {
                                //         game.state.getCurrentState().levelCompleted();
                                //         return;
                                //     }
                                //     nextLevel();
                                //     exerciseIndex = 0;
                                //     game.state.getCurrentState().showLevelUp();
                                // }
                                var actualNotes = scorer.getActualNotes();
                                var allCorrect = true;
                                actualNotes.forEach(function(interval, index) {
                                        if (local.exercise[index] != interval) allCorrect = false;
                                })
                                if (actualNotes.length != local.exercise.length) allCorrect = false;
                                // console.log(actualNotes);
                                var consecutives = 0;
                                if (allCorrect) {
                                    // answers.push(true);
                                    console.log("correct");
                                    $scope.score = scorer.getScore(actualNotes);
                                    $scope.attempt = 0;
                                    $scope.correct++;
                                    if ($scope.correct > 2) {
                                        exerciseIndex++;
                                        $scope.correct = 0;
                                    }
                                    
                                }
                                else {
                                    console.log("fail");
                                    $scope.attempt++;
                                    if ($scope.attempt > 2 && exerciseIndex > 0) {
                                        exerciseIndex--;
                                        $scope.attempt = 0;
                                    }
                                }
                                display.drawLabel();
                                gameController.setState(new PlayState(exerciseIndex));
                                scorer.reset();
                                $scope.score = 0;
                                $scope.$apply();
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
                      (function(noteIndex) {
                            gameController.setIntervalHandler(function(interval) {
                                // display.markPitch(interval, Date.now() - singTime);
                                // var roundedInterval = Math.round(interval);
                                // display.markPitchFeedback(roundedInterval, Date.now() - singTime, scorer.scorePoint(roundedInterval, local.exercise[noteIndex]));
                                while (interval < 0) interval = interval + 12;
                                interval = interval%12;
                                scorer.scorePoint(interval, noteIndex);
                                // scorer.scorePoint(roundedInterval, local.exercise[noteIndex]);
                                // $scope.score = scorer.getExerciseScore();
                                $scope.$apply();
                            });
                        })(currentNoteIdx);
                        if (beatCount === 0) {
                            // display.clearPlayMarkers();
                            // display.clearPitchMarkers();
                            singTime = Date.now();
                        }
                       
                        display.drawLabel(local.exercise[currentNoteIdx]);
                        if (currentNoteIdx < local.exercise.length - 1) {
                            currentNoteIdx++;
                        } else {
                            
                            gameController.setState(new IdleState(exerciseIndex));
                            // if (scorer.getExerciseScore() > 0.7){
                            //   if (exerciseIndex == exercises.length - 1) {
                            //     exerciseIndex = 0;
                            //   } else {
                            //     exerciseIndex++;
                            //   }
                            //   gameController.setState(new PlayState(exerciseIndex, 'play'));
                            // }
                            // else {
                            //   if (exerciseIndex > 0) exerciseIndex--;
                            //   gameController.setState(new PlayState(exerciseIndex, 'play'));
                            // }
                            

                        }
                        beatCount++;
                    });

                };
            };

            gameController.setState(new StartingState());
      });
    });