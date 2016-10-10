define(['./module', './sequencegen', './display', 'note', 'webaudioplayer', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', 'tanpura', 'recorderworker'
    ],
    function(app, sequenceGen, Display, Note, Player, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, Tanpura, recorderWorker) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('FastSingingCtrl', function($scope, $rootScope, PitchModel) {
            $scope.rootNote = 46;
            $scope.isSinging = true;
            $scope.playTime = 500;
            $scope.numNotes = 4;

            $scope.isTanpuraEnabled = true;
            $scope.loading = false;

            $scope.signalOn = false;

            var display = new Display();

            var currRoot;
            var currThat;

            var marker = 0;
            var baseFreq = 261;
            var playTime = 500;
            var timeAdjustment = 50;

            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;
            var tanpura = null;

            var currActiveNote = 0;


            var Clock = function(tickDuration, maxTicks) {
                var intervalId = 0;
                this.ticksCount = 0;
                this.maxTicks = maxTicks;
                this.tickDuration = tickDuration;
                this.watcher = null;
                var nullAction = function() {
                    console.log("null action");
                };
                this.nextBeepAction = nullAction;
                var startTime1 = audioContext.currentTime + this.tickDuration / 1000;

                this.registerWatcher = function(watcher) {
                    this.watcher = watcher;
                };

                this.start = function() {
                    console.log("clock start");
                    this.ticksCount = 0;
                    startTime1 = audioContext.currentTime + this.tickDuration / 1000;
                    var local = this;
                    intervalId = setInterval(function() {
                        local.ticksCount++;
                        console.log(local.ticksCount)
                        if (local.ticksCount >= local.maxTicks)
                            local.stop();
                        else {
                            player.scheduleNote(880, startTime1, 40);
                            startTime1 = startTime1 + local.tickDuration / 1000;
                            local.callScheduledAction();
                            local.watcher.handleBeep(local.ticksCount);
                        }
                    }, this.tickDuration);
                };
                this.stop = function() {
                    console.log("clock stop");
                    clearInterval(intervalId);
                };

                this.scheduleNote = function(noteNum) {
                    //schedule note for next beep.  
                    player.scheduleNote(MusicCalc.midiNumToFreq(noteNum), startTime1, this.tickDuration);
                };

                this.scheduleAction = function(callback) {
                    this.nextBeepAction = callback;
                };

                this.callScheduledAction = function() {
                    this.nextBeepAction();
                    this.nextBeepAction = nullAction;
                };

                this.setTicks = function(ticks) {
                    this.maxTicks = ticks;
                };

                this.setTickDuration = function(tickDuration) {
                    this.tickDuration = tickDuration;
                };

            };

            var singStartTime = 0;
            var clock = new Clock(playTime, 14);
            var sequenceHandler = {
                noteSequence: [0, 0, 0, 0],
                handleBeep: function(beepNum) {
                    console.log(beepNum);
                    if (beepNum >= 2 && beepNum <= 6)
                        clock.scheduleNote(this.noteSequence[beepNum - 2] + $scope.rootNote);
                    if (beepNum == 9) {
                        singStartTime = Date.now();
                        startRecording();
                        $scope.isSinging = true;
                    }

                    if (beepNum == 13) {
                        display.showNotes(this.noteSequence);
                        stopAndProcessRecording();
                        $scope.isSinging = false;
                    }
                }
            };

            clock.registerWatcher(sequenceHandler);

            var updatePitch = function(data) {
                var pitch = detector.findPitch(data);
                console.log(pitch)
                if (pitch !== 0) {
                    PitchModel.currentFreq = pitch;
                    PitchModel.currentInterval = MusicCalc.getCents(PitchModel.rootFreq, PitchModel.currentFreq) / 100;
                    if ($scope.isSinging) {
                        display.markPitch(PitchModel.currentInterval, Date.now() - singStartTime);
                    }
                }
            };

            var isRecording = false;
            var recorder = function(data) {
                if (isRecording) {
                    recorderWorker.postMessage({
                        command: 'record',
                        floatarray: data
                    });
                }
            };

            var audioStreamProcessor = function(data) {
                if ($scope.isSinging) {
                    updatePitch(data);
                    recorder(data);
                }
            };

            var startRecording = function() {
                recorderWorker.postMessage({
                    command: 'clear'
                });
                isRecording = true;
            };

            var stopAndProcessRecording = function() {
                isStarted = false;
                recorderWorker.postMessage({
                    command: 'concat'
                });
            };


            recorderWorker.onmessage = function(e) {
                switch (e.data.command) {
                    case 'concat':
                        computePitchGraph(e.data.floatarray);
                        break;
                }
            };

            function computePitchGraph(floatarray) {
                var offset = 0;
                var incr = 64;
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
                        pitchArray.push(PitchModel.currentInterval % 12);
                    } else pitchArray.push(-100);
                    offset = offset + incr;
                }
                display.plotData(pitchArray);
            }
            $scope.$watch('rootNote', function() {
                currRoot = parseInt($scope.rootNote);
                if (tanpura !== null)
                    tanpura.stop();
                $scope.loading = true;
                var progressListener = function(message, progress) {
                    if (progress === 100) {
                        //tanpura.play();
                        $scope.loading = false;
                        $scope.isTanpuraEnabled = true;
                        // $scope.$apply();
                    }
                };
                tanpura = Tanpura.getInstance();
                tanpura.setTuning($scope.rootNote, 7, progressListener);

                baseFreq = MusicCalc.midiNumToFreq(currRoot);
                PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
            });

            $scope.$watch('playTime', function() {
                playTime = parseInt($scope.playTime);
                display.setNoteDuration(playTime);
                clock.setTickDuration(playTime);
            });

            $scope.$on("$destroy", function() {
                if (micStream)
                    micStream.stop();
                tanpura.stop();

            });

            $scope.newSequence = function() {
                clock.start();

                currThat = sequenceGen.getRandomSequence(parseInt($scope.numNotes));
                sequenceHandler.noteSequence = currThat;
                //playThat(currThat);
                display.reset();
                currActiveNote = 0;

            };

            $scope.startMic = function() {
                console.log("start mic")
                if (!$scope.signalOn) {
                    MicUtil.getMicAudioStream(
                        function(stream) {
                            micStream = stream;
                            buffer = new AudioBuffer(audioContext, stream, 2048);
                            buffer.addProcessor(audioStreamProcessor);
                            /* buffer1 = new AudioBuffer(audioContext, stream, 2048);
                             buffer1.addProcessor(updatePitch);
                             buffer2 = new AudioBuffer(audioContext, stream, 16384);
                             buffer2.addProcessor(recorder);*/
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

        });
    });