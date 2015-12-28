define(['./module', './sequencegen', './display', './exercises', 'note', 'webaudioplayer', 'currentaudiocontext',
            'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer'
        ],
        function(app, sequenceGen, Display, exercises, Note, Player, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer) {
            var sequence;
            var audioContext = CurrentAudioContext.getInstance();
            var player = new Player(audioContext);


            app.controller('SingingGameCtrl', function($scope, $rootScope, PitchModel) {
                    $scope.rootNote = 46;
                    $scope.isPending = true;
                    $scope.playTime = 500;
                    $scope.numNotes = 3;

                    var display = new Display();

                    var currRoot;
                    var currThat;

                    var marker = 0;
                    var baseFreq = 261;
                    var playTime = 1000;

                    var currLoopId;

                    var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
                    var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
                    var micStream;

                    var beatDuration = 1000;

                    var currActiveNote = 0;
                    console.log(exercises);
                    var Clock = function(tickDuration) {
                        var intervalId = 0;
                        this.watcher = null;

                        this.registerWatcher = function(watcher) {
                            this.watcher = watcher;
                        };

                        this.start = function() {
                            console.log("start");
                            console.log(this.watcher);
                            var local = this;
                            intervalId = setInterval(function() {
                                local.watcher.handleBeep();
                            }, tickDuration);
                        };
                        this.stop = function() {
                            clearInterval(intervalId);
                        };

                    };

                    var startTime1 = audioContext.currentTime + beatDuration/1000;

                    var states = {
                        STOPPED: 0,
                        ON_EXERCISE: 1
                    };
                    var currentState = states.STOPPED;
                    var currentExerciseIdx;
                    var currentExercise;
                    var currentNoteIdx;
                    var singTime = Date.now();
                    var testClock = {


                        handleBeep: function() {
                            player.scheduleNote(220, startTime1, 40);
                            startTime1 = startTime1 + beatDuration / 1000;
                            if (currentState === states.STOPPED) {
                                console.log("started");
                                currentExerciseIdx = 0;
                                currentExercise = exercises[currentExerciseIdx];
                                currentState = states.ON_EXERCISE;
                                currentNoteIdx = 0;
                            } else if (currentState === states.ON_EXERCISE) {
                                console.log(currentExercise[currentNoteIdx]);
                                display.playAnimate(currentExercise[currentNoteIdx],beatDuration,currentNoteIdx);
                                if (currentNoteIdx < currentExercise.length - 1)
                                    currentNoteIdx++;
                                else {
                                    currentExerciseIdx++;
                                    currentExercise = exercises[currentExerciseIdx];
                                    display.loadExercise(currentExercise);
                                    currentNoteIdx = 0;
                                    singTime = Date.now();
                                }
                            }
                            }
                        };

                        var clock = new Clock(beatDuration);
                        clock.registerWatcher(testClock);
                        clock.start();

                        var updatePitch = function(data) {
                            var pitch = detector.findPitch(data);
                            if (pitch !== 0) {
                                PitchModel.currentFreq = pitch;
                                PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                                if ($scope.isPending) {
                                    display.markPitch(PitchModel.currentInterval,Date.now()-singTime);
                                    stabilityDetector.push(PitchModel.currentInterval);
                                }
                            }
                        };

                        $scope.$watch('rootNote', function() {
                            currRoot = parseInt($scope.rootNote);

                            baseFreq = MusicCalc.midiNumToFreq(currRoot);
                            PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
                        });


                        $scope.$on("$destroy", function() {
                            cancelCurrentLoop();
                            if (micStream)
                                micStream.stop();
                        });

                        $scope.newSequence = function() {
                            currThat = sequenceGen.getRandomSequence(parseInt($scope.numNotes));
                            playThat(currThat);
                            display.reset();
                            currActiveNote = 0;
                            display.start(currActiveNote);

                        };

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

                        function playThat(that) {
                            cancelCurrentLoop();
                            intervalSequence = that;
                            var startTime = audioContext.currentTime + playTime / 1000;
                            currLoopId = setInterval(function() {
                                noteStartTime = startTime + playTime * marker / 1000;
                                var noteFreq = baseFreq * Math.pow(2, intervalSequence[marker] / 12);
                                player.scheduleNote(noteFreq, noteStartTime, playTime);
                                marker++;
                                if (marker >= intervalSequence.length) {
                                    cancelCurrentLoop();
                                }
                            }, playTime);
                        }

                        function cancelCurrentLoop() {
                            marker = 0;
                            clearInterval(currLoopId);
                        }

                        $scope.repeat = function() {
                            playThat(currThat);
                        };

                        $scope.showAns = function() {
                            display.showNotes(currThat);
                        };

                        $scope.playMyGuess = function() {
                            console.log(display.getNotes());
                            playThat(display.getNotes());
                        };


                        function unitStabilityDetected(interval) {
                            display.notifyUnitStable(interval);
                        }

                        function aggStabilityDetected(interval) {
                            display.notifyAggStable(interval);
                            display.stop();
                            display.clearPoints();
                            display.setFlash("Stable Tone Detected!");
                            setTimeout(function() {
                                player.playNote(MusicCalc.midiNumToFreq(interval + currRoot), playTime);
                                display.playAnimate(interval, playTime, currActiveNote);
                                display.start(++currActiveNote);
                            }, 100);
                        }
                    });
            });