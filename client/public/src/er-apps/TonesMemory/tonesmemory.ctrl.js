define(['./module', './sequencegen', './display', 'note', 'webaudioplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer'
    ],
    function(app, sequenceGen, Display, Note, Player, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('TonesMemoryCtrl', function($scope, $rootScope, PitchModel) {
            $scope.rootNote = 50;
            $scope.isPending = true;
            $scope.playTime = 500;
            $scope.numNotes = 3;

            var display = new Display();

            var currRoot;
            var currThat;

            var marker = 0;
            var baseFreq = 261;
            var playTime = 1200;

            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
            var micStream;

            var currActiveNote = 0;

            var updatePitch = function(data) {
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