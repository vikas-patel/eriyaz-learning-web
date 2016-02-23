define(['./module', './player', './display', 'note', 'webaudioplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './levels'],
    function(app, Player, Display, Note, WebPlayer, CurrentAudioContext, MusicCalc, MicUtil, 
        PitchDetector, StabilityDetector, AudioBuffer, levels) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var webPlayer = new WebPlayer(audioContext);


        app.controller('VoiceMatch2Ctrl', function($scope, $rootScope, PitchModel) {
            $scope.rootNote = 47;
            $scope.isPending = true;
            $scope.playTime = 500;
            $scope.score = 0;
            $scope.levels = levels;
            $scope.level = levels[0];
            // localStorage.voicematch2_bestScore = 0;
            $scope.bestScore = localStorage.voicematch2_bestScore || 0;
            $scope.timeLeft = 600;
            $scope.gender = "man";
            var exercises = [4, 5, 7, 9, 9, 7, 5, 4];
            var notes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            var playIntervalId;
            // var player = new Player($scope.rootNote, notes, 'male');
            var player;
            var display = new Display();

            var currRoot;
            var currThat;
            var currentNote;
            var currentIndex = -1;
            var failed = 0;
            var maxFail = 4;

            var marker = 0;
            var baseFreq = 261;
            var playTime = 500;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
            var micStream;

            var currActiveNote = 0;
            var isPlaying = false;
            var timeinterval;

            var updatePitch = function(data) {
                if (isPlaying) return;
                var pitch = detector.findPitch(data);
                if (pitch !== 0) {
                    PitchModel.currentFreq = pitch;
                    PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                    if ($scope.isPending) {
                        display.notifyInterval(PitchModel.currentInterval);
                        stabilityDetector.push(PitchModel.currentInterval);
                    }
                }
            };

            $scope.$watch('rootNote', function() {
                currRoot = parseInt($scope.rootNote);

                baseFreq = MusicCalc.midiNumToFreq(currRoot);
                PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
            });

            $scope.$watch('gender', function() {
                if ($scope.gender == "man") {
                    $scope.rootNote = 47;
                    player = new Player($scope.rootNote, notes, 'male');
                } else {
                  $scope.rootNote = 58;
                  player = new Player($scope.rootNote, notes, 'female');
                }
                reset();
            });

            $scope.$watch('level', function() {
                display.drawSlots($scope.level.notes);
                reset();
            });

            $scope.$watch('playTime', function() {
                playTime = parseInt($scope.playTime);
            });
            
            $scope.$on("$destroy", function() {
                clearLoop();
                if (micStream)
                    micStream.stop();
            });

            $scope.newSequence = function() {
                currentNote = $scope.level.notes[Math.floor(Math.random()*$scope.level.notes.length)];
                currentIndex++;
                failed = 0;
                playThatLoop(currentNote);
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

            function clearLoop() {
                if (playIntervalId) clearInterval(playIntervalId);
            }

            function playThat(note) {
                isPlaying = true;
                player.play(note, function(){isPlaying = false;}, $scope.level.duration);
            }

            function playThatLoop(note) {
                playThat(note);
                clearLoop();
                playIntervalId = setInterval(function() {
                    playThat(note);
                }, 6000)
            }

            $scope.repeat = function() {
                playThatLoop(currentNote);
            };

            $scope.showAns = function() {
                display.showNotes(currentNote);
            };

            $scope.playMyGuess = function() {
                playThat(display.getNotes());
            };

            function reset() {
                currentIndex = -1;
                $scope.score = 0;
                failed = 0;
                clearLoop();
            }

            function unitStabilityDetected(interval) {
                display.notifyUnitStable(interval);
            }

            function aggStabilityDetected(interval) {
                clearLoop();
                var diff = interval - currentNote;
                if(diff == 0) {
                    if (failed == 0) $scope.score += 10;
                    if (failed == 1) $scope.score += 10;
                    if (failed == 2) $scope.score += 5;
                    if (failed == 3) $scope.score += 2;
                    $scope.$apply();
                } else {
                    failed ++;
                }
                // if (Math.abs(diff) == 1) $scope.score += 5;
                // if (Math.abs(diff) == 2) $scope.score += 2;
                display.notifyAggStable(interval);
                display.stop();
                display.clearPoints();
                display.setFlash("Stable Tone Detected!");
                setTimeout(function() {
                    webPlayer.playNote(MusicCalc.midiNumToFreq(interval + currRoot), playTime);
                    display.playAnimate(interval, playTime, currActiveNote, diff, failed == 1);
                    display.start(++currActiveNote);
                    if (failed == maxFail) {
                        if ($scope.score > (localStorage.voicematch2_bestScore || 0)) {
                            localStorage.voicematch2_bestScore = $scope.score;
                        }
                        alert('Game Over. Your Score: '+ $scope.score);
                        reset();
                        return;
                    }
                    setTimeout(function() {
                        if (diff == 0) {
                            if (currentIndex == $scope.level.total-1) {
                                if ($scope.score > (localStorage.voicematch2_bestScore || 0)) {
                                    localStorage.voicematch2_bestScore = $scope.score;
                                }
                                alert('Level Completed. Your Score: '+ $scope.score);
                            } else {
                                $scope.newSequence();
                            }
                        } else {
                            $scope.repeat();
                        }
                    }, 1000)
                }, 100);
            }
        });
    });