define(['./module', './sequencegen', './display', './songs', 'note', 'webaudioplayer', './timestretcher', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer'
    ],
    function(app, sequenceGen, Display, songs, Note, Player, TimeStretcher, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, scorer) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('SongPracticeCtrl', function($scope, $rootScope, PitchModel) {
            $scope.score = 0;
            $scope.songs = songs;
            $scope.song = songs[0];
            $scope.sequences = [{name:"sing with original", actions:[1, 3]},
                                {name:"sing after original", actions:[1, 2]},
                                {name:"combine above two", actions:[1, 3, 1, 2]},
                                {name:"listen original only", actions:[1]}];
            $scope.sequence = $scope.sequences[0];
            var display = new Display(setRange);
            var stretcher;

            var currRoot;
            var currThat;

            var currLoopId;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            $scope.tempo = 1;
            var defaultBeatDurtion = 1000;
            var beatDuration = defaultBeatDurtion;
            var timeSeries = $scope.song.timeSeries;
            var pitchSeries = $scope.song.pitchSeries;
            var currActiveNote = 0;
            var singTime = Date.now();
            var songBuffer;
            var wholeBeat = 1;
            var totalBeats = 1;
            var stretchedBuffer;
            var arrayTime;
            var arrayPitch = [];
            var rStart;
            var rEnd;
            var source;
            var recorderWorker = new Worker("/worker/pitchworker.js");
            var stretchWorker = new Worker("/worker/timestretcher.js");
            var actionMessage = ["Listen", "Sing", "Listen & Sing"];
            var LOADING_MSG = "Wait... Loading Song";
            var SLOWER_MSG = "Wait... Reducing Song Tempo";
            function setRange(t0, t1) {
                rStart = t0;
                rEnd = t1; 
                defaultBeatDurtion = (rEnd - rStart)*1000;
                beatDuration = parseInt(defaultBeatDurtion/$scope.tempo);
                if ($scope.tempo < 1) {
                    calculateStretchedBuffer();
                } else {
                    stretchedBuffer = null;
                }
            }

            $scope.$watch('song', function() {
                loadSound();
                PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.song.rootNote);
            });

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
                    intervalId = setInterval(function repeatAction() {
                        if (nextTickCount == wholeBeat) {
                            player.scheduleNote(880, startTime1, 40);
                            nextTickCount = 0;
                        }
                        nextTickCount++;
                        startTime1 = startTime1 + beatDuration / 1000;
                        local.callScheduledAction();
                        local.watcher.handleBeep();
                        return repeatAction;
                    }(), tickDuration);
                };
                this.stop = function() {
                    clearInterval(intervalId);
                };

                this.scheduleNote = function() {
                    //schedule note for next beep.
                    playSound(startTime1);
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

            var ACTIONS = {
              PLAY: 1, SING: 2
            };

            var isActionTrue = function(number, action) {
              return !!(number & action);
            };
 
            var PlayState = function() {
                var currentNoteIdx = 5;
                var local = this;
                var count = 0;

                this.handleBeep = function() {
                    if (count == 0) {
                         display.clearUserPoints();
                    }
                    var action = $scope.sequence.actions[count];
                    //Play now (listen first)
                    if (isActionTrue(action, ACTIONS.PLAY)) {
                        playSound(0);
                    }
                    if (isActionTrue(action, ACTIONS.SING)) {
                        recorderWorker.postMessage({
                            command: 'init',
                            rootFreq: PitchModel.rootFreq,
                            sampleRate: audioContext.sampleRate,
                            time: (rEnd - rStart)/$scope.tempo
                          });
                    }
                    // end of sequence
                    if (count == $scope.sequence.actions.length-1) {
                         if ($scope.isLoop) {
                            gameController.setState(new PlayState());
                        } else {
                            gameController.setState(new FeedbackState());
                        }
                    }
                    display.drawIndicator(beatDuration);
                    display.setFlash(actionMessage[action-1]);
                    count++;
                    
                    clock.scheduleAction(function() {
                        if (isActionTrue($scope.sequence.actions[count], ACTIONS.SING)) {
                            display.clearUserPoints();
                            gameController.setIntervalHandler(function(data) {
                                recorderWorker.postMessage({
                                  command: 'record',
                                  floatarray: data
                                });
                            });
                        }
                        if (isActionTrue($scope.sequence.actions[count-1], ACTIONS.SING)) {
                            recorderWorker.postMessage({
                                    command: 'concat'
                                  });
                            recorderWorker.postMessage({
                                command: 'init',
                                rootFreq: PitchModel.rootFreq,
                                sampleRate: audioContext.sampleRate,
                                time: (rEnd - rStart)/$scope.tempo
                              });
                        }
                    });
                };
            };

            var FeedbackState = function() {
                var local = this;
                var count = 0;
                this.handleBeep = function() {
                    gameController.setIntervalHandler(function(interval) {
                        // empty, no action
                    });
                    if (count == 0) {
                        $scope.playClicked();
                        display.clearFlash();
                    }
                    count++;
                    // clock.scheduleAction(function() {
                        
                    //     count++;
                    // });
                };
            };
            gameController.setState(new PlayState());
            
            gameController.setIntervalHandler(function(interval) {
                // yet to initialize
            });
            var updatePitch = function(data) {
                gameController.handleNewInterval(data);
            };

            recorderWorker.onmessage = function(e) {
              switch (e.data.command) {
                case 'concat':
                  computePitchGraph(e.data.pitchArray);
                  globalArray = e.data.recordedArray;
                  break;
              }
            };

            function loadSound() {
              display.setFlash(LOADING_MSG);
              var url = "er-shell/audio/"+$scope.song.path;
              var request = new XMLHttpRequest();
              request.open('GET', url, true);
              request.responseType = 'arraybuffer';

              // Decode asynchronously
              request.onload = function() {
                audioContext.decodeAudioData(request.response, function(buffer) {
                songBuffer = buffer;
                loadExercise();
                display.clearFlash();
                }, function() {console.log("error on loading audio file.")});
              }
              request.send();
            }

            function playSound(time) {
              source = audioContext.createBufferSource(); // creates a sound source
              source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
              if (stretchedBuffer) {
                source.buffer = stretchedBuffer;
                source.start(time);
              } else {
                source.buffer = songBuffer;                    // tell the source which sound to play
                source.start(time, rStart, rEnd - rStart);                           // play the source now
              }
            }

            function computePitchGraph(floatarray) {
                display.plotData(floatarray, $scope.tempo, false);
            };

            // $scope.$watch('rootNote', function() {
            //     currRoot = parseInt($scope.rootNote);

            //     baseFreq = MusicCalc.midiNumToFreq(currRoot);
            //     PitchModel.rootFreq = MusicCalc.midiNumToFreq(currRoot);
            // });

            $scope.$watch('tempo', function() {
                beatDuration = defaultBeatDurtion/$scope.tempo;
                if ($("#PlayButton").hasClass("Playing")) {
                    restart();
                }
                if ($scope.tempo < 1) {
                    calculateStretchedBuffer();
                } else {
                    stretchedBuffer = null;
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
            
            function loadExercise() {
                display.clearPoints();
                beatDuration = defaultBeatDurtion/$scope.tempo;
                arrayTime = $scope.song.timeSeries;
                var aPitch = $scope.song.pitchSeries;
                arrayPitch = [];
                for (var i = 0; i < aPitch.length; i++) {
                    var pitch = MusicCalc.getCents(PitchModel.rootFreq, aPitch[i]) / 100;
                    arrayPitch.push(pitch);
                }
                display.init(arrayPitch, arrayTime, songBuffer.duration, $scope.song.scale);
                if ($scope.tempo < 1) {
                    calculateStretchedBuffer();
                } else {
                    stretchedBuffer = null;
                }
            }
            var t0, t1;

            function calculateStretchedBuffer() {
                display.setFlash(SLOWER_MSG);
                var channels = songBuffer.numberOfChannels;
                var channelData = new Array(channels);
                for (var i=0; i< channels;i++) {
                    channelData[i] = songBuffer.getChannelData(i);
                }
                stretchWorker.postMessage({
                    command: 'calculate',
                    sampleRate: songBuffer.sampleRate,
                    channelData: channelData,
                    tempo: $scope.tempo,
                    start: rStart,
                    end: rEnd
                });
            }

            stretchWorker.onmessage = function(e) {
              switch (e.data.command) {
                case 'done':
                    var outBufferList = e.data.outBufferList;
                    stretchedBuffer = audioContext.createBuffer(outBufferList.length, outBufferList[0].length, audioContext.sampleRate);
                    for (var j=0; j<outBufferList.length;j++) {
                        var o = stretchedBuffer.getChannelData(j);
                        for (var i = 0; i < outBufferList[j].length; i++) {
                            o[i] = outBufferList[j][i];
                        }
                    }
                    display.clearFlash();
                  break;
              }
            };

            function restart() {
                $scope.score = 0;
                singTime = Date.now();
                clock.stop();
                clock = new Clock(beatDuration);
                clock.registerWatcher(gameController);
                gameController.setState(new PlayState());
                clock.start();
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
                    display.stopIndicator();
                    source.stop();
                } else {
                    restart();
                    $("#PlayButton").addClass("Playing");
                    $("#play-icon").removeClass("icon-svg_play");
                    $("#play-icon").addClass("icon-svg_pause");
                    $scope.startMic();
                }
            };

            $scope.playRecord = function() {
                playConcatenated(globalArray);
            };

            // $scope.play = function() {
            //     playSound(0);
            // };

            function playConcatenated(floatarray) {
              var concatenatedArray = floatarray;
              var outBuffer = audioContext.createBuffer(1, concatenatedArray.length, audioContext.sampleRate);
              var l = outBuffer.getChannelData(0);
              l.set(concatenatedArray);
              var source = audioContext.createBufferSource();
              source.buffer = outBuffer;
              source.connect(audioContext.destination);
              source.start();
            }
        });
    });