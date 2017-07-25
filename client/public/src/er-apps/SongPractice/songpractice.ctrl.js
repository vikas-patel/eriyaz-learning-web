define(['./module', './sequencegen', './display', './audioBufferToWav', './songs', 'lyrics', 'note', 'webaudioplayer', './pitchshifter', 'currentaudiocontext',
        'music-calc', 'mic-util', 'pitchdetector', 'stabilitydetector', 'audiobuffer', './scorer','hopscotch'
    ],
    function(app, sequenceGen, Display, audioBufferToWav, songs, Lyrics, Note, Player, PitchShifter, CurrentAudioContext, MusicCalc, MicUtil, PitchDetector, StabilityDetector, AudioBuffer, scorer,hopscotch) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);
        var lrc = new Lyrics();

        app.controller('SongPracticeCtrl', function($scope, $rootScope, PitchModel) {

            // Define the tour!
            
            var tour = {
              id: "hello-hopscotch",
              steps: [
                {
                  title: "Welome",
                  content: "Click next to start the tour",
                  target:document.querySelector("head"),
                  placement: "bottom"
                },
                {
                  title: "Songs",
                  content: "Select the song you want to learn.",
                  target: "song-select",
                  placement: "right",
                  yOffset : -20,
                },
                {
                  content: "Drag slider to where song starts.",
                  target: "seekbar",
                  placement: "right",
                  yOffset : -20,
                  xOffset : -900
                },
                {
                  content: "select an area to select a small portion of song for practice.",
                  target: "PlayButton",
                  placement: "right",
                  yOffset : -300,
                },
                {
                  title: "Start Practice",
                  content: "Start practicing by clicking this play button",
                  target: "PlayButton",
                  placement: "right"
                }
              ]
            };

             $scope.$watch('$viewContentLoaded', function(){
                 //Here your view content is fully loaded !!
                 // Start the tour!
            hopscotch.startTour(tour);
             });
            
            $scope.score = 0;
            $scope.songs = songs;
            // $scope.song = songs[0];
            $scope.sequences = [{name:"sing after original", actions:[1, 2]},
                                {name:"sing with original", actions:[1, 3]},
                                {name:"listen original only", actions:[1]}];
            $scope.pitchShifts = [{name:"original pitch", value: 0},
                                {name:"1 seminote lower", value: 1},
                                {name:"2 seminote lower", value: 2},
                                {name:"3 seminote lower", value: 3},
                                {name:"4 seminote lower", value: 4}];
            $scope.sequence = $scope.sequences[0];
            $scope.pitchShift = $scope.pitchShifts[0];
            var display = new Display(setRange);

            var stretcher;

            var currRoot;

            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            var micStream;

            $scope.tempo = 1;
            var defaultBeatDurtion = 1000;
            var beatDuration = defaultBeatDurtion;
            var currActiveNote = 0;
            var singTime = Date.now();
            var songBuffer;
            var wholeBeat = 1;
            var totalBeats = 1;
            var stretchedBuffer;
            var rStart;
            var rEnd;
            var source;
            var rawTime, arrayPitch;
            var t0, t1, delayLyrics;
            var beats;
            var rawTime = [];
            var rawFreq = [];
            var recorderWorker = new Worker("/worker/pitchworker.js?v=1");
            // var stretchWorker = new Worker("/worker/timestretcher.js?v=1");
            var actionMessage = ["Listen Now", "Sing Now", "Listen & Sing"];
            var LOADING_MSG = "Wait... Loading Song's Audio";
            // var LOADING_MSG_BEATS = "Wait... Loading Song's Beats";
            // var LOADING_MSG_NOTES = "Wait... Loading Song's Notes";
            var SLOWER_MSG = "Wait... Reducing Song Tempo";
            var RECALCULATE_MSG = "Wait... Recalculating Audio";
            function setRange(t0, t1) {
                rStart = t0;
                rEnd = t1; 
                defaultBeatDurtion = (rEnd - rStart)*1000;
                beatDuration = parseInt(defaultBeatDurtion/$scope.tempo);
                if ($scope.tempo < 1 || $scope.pitchShift.value > 0) {
                    // calculateStretchedBuffer();
                    createAudio();
                } else {
                    stretchedBuffer = null;
                }
            }

            $scope.$watch('song', function() {
                if (!$scope.song) {
                    display.setFlash("Please Select a Song");
                    return;
                }
                display.setFlash(LOADING_MSG);
                loadBeats();
                PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.song.rootNote);
                PitchModel.rootUserFreq = MusicCalc.midiNumToFreq($scope.song.rootNote-$scope.pitchShift.value);
                // execute when all files are loaded
                $.when(loadPitch(), loadSound(), loadLyrics())
                .done(function() {
                    if ($scope.song.delay) {
                        delayLyrics = $scope.song.delay;
                    } else {
                        delayLyrics = 0;
                    }
                    loadExercise();
                    display.clearFlash();
                    initSeekbar(songBuffer.duration);
                    movetoLyrics(0);
                });
            });

            function initSeekbar(maxValue) {
                maxValue = Math.round(maxValue);
                var seekbar = document.querySelector('#seekbar');
                seekbar.value = 0;
                seekbar.max = maxValue;
                $("#duration-label").text(Math.floor(maxValue/60) + "." + maxValue%60);
            }

            function setSeekbarValue(value) {
                var seekbar = document.querySelector('#seekbar');
                seekbar.value = value;
            }

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
                            player.scheduleNote(880, startTime1, 25);
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
                            rootFreq: PitchModel.rootUserFreq,
                            sampleRate: audioContext.sampleRate,
                            time: (rEnd - rStart)/$scope.tempo
                          });
                    } else {
                        gameController.setIntervalHandler(function(data) {});
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
                                rootFreq: PitchModel.rootUserFreq,
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
                  globalArray = e.data.recordedArray;
                  computePitchGraph(e.data.pitchArray);
                  break;
              }
            };
            var blob;
            function loadSound() {
                var deferred = $.Deferred();
              var url = "er-shell/audio/"+$scope.song.path;
              var request = new XMLHttpRequest();
              request.open('GET', url, true);
              request.responseType = 'arraybuffer';
              // Decode asynchronously
              request.onload = function() {
                audioContext.decodeAudioData(request.response, function(buffer) {
                songBuffer = buffer;
                // display.clearFlash();
                deferred.resolve();
                }, function() {console.log("error on loading audio file.")});
              };

              request.onprogress = function(oEvent) {
                if (oEvent.lengthComputable) {
                    var percentComplete = 100*oEvent.loaded / oEvent.total;
                    $scope.progressBar = Math.floor(percentComplete);
                    $scope.$apply();
                    // ...
                  } else {
                    // Unable to compute progress information since the total size is unknown
                  }
              }
              request.send();
              return deferred.promise();
            }

            var url, sound;

            function sliceAudioBuffer(buffer, begin, end) {
                var rate = audioContext.sampleRate;
                var startOffset = Math.round(rate * begin);
                var endOffset = Math.round(rate * end);
                var frameCount = endOffset - startOffset;
                var newArrayBuffer = audioContext.createBuffer(1, endOffset - startOffset, rate);
                var anotherArray = new Float32Array(frameCount);
                var offset = 0;
                buffer.copyFromChannel(anotherArray, 0, startOffset);
                newArrayBuffer.copyToChannel(anotherArray, 0, offset);
                return newArrayBuffer;
            }

            function createAudio () {
                display.setFlash(RECALCULATE_MSG);
                buffer = sliceAudioBuffer(songBuffer, rStart, rEnd);
                var shift = $scope.pitchShift.value;
                if (shift > 0) {
                    var pitchShifter = new PitchShifter(buffer, shift, 0, buffer.duration);
                    buffer = pitchShifter.out();
                }
                var wav = audioBufferToWav(buffer);
                var blob = new window.Blob([ new DataView(wav) ], {
                  type: 'audio/wav'
                });
                if (url) {
                    window.URL.revokeObjectURL(url)
                }
                url = window.URL.createObjectURL(blob);
                if (sound) {
                    sound.src      = url;
                } else {
                    sound      = document.createElement('audio');
                    sound.id       = 'audio-player';
                    // sound.controls = 'controls';
                    sound.src      = url;
                    sound.type     = 'audio/wav';
                    document.getElementById('songpractice').appendChild(sound);
                }
                display.clearFlash();
            }

            function loadPitch() {
                var deferred = $.Deferred();
                var url = "er-shell/audio/"+$scope.song.path.split("\.")[0]+".csv";
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                // Decode asynchronously
                request.onload = function() {
                    deferred.resolve();
                    var text = request.responseText;
                    var lines = text.split('\n');
                    rawTime = [];
                    rawFreq = [];
                    for (var i=0; i<lines.length; i++) {
                        var line = lines[i].split(",");
                        rawTime.push(parseFloat(line[0]));
                        rawFreq.push(parseFloat(line[1]));
                    }
                    // loadExercise();
                    // display.clearFlash();
                }
                request.send();
                return deferred.promise();
            }

            function loadLyrics() {
                var url = "er-shell/audio/"+$scope.song.path.split("\.")[0]+".lrc";
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                // Decode asynchronously
              request.onload = function() {
                var text = request.responseText;
                lrc.load(text);
              }
              request.send();
            }

            function loadBeats() {
                var url = "er-shell/audio/"+$scope.song.path.split("\.")[0]+"-beats.csv";
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                // Decode asynchronously
              request.onload = function() {
                var text = request.responseText;
                var lines = text.split('\n');
                beats = [];
                for (var i=0; i<lines.length; i++) {
                    var line = lines[i].split(",");
                    beats.push(parseFloat(line[0]));
                }
                // display.clearFlash();
                display.setBeats(beats);
              }
              request.send();
            }

            function playSound(time) {
              if ($scope.tempo < 1 || $scope.pitchShift.value > 0) {
                // source.buffer = stretchedBuffer;
                // source.start(time);
                sound.playbackRate = $scope.tempo;
                sound.currentTime = 0;
                sound.play(time);
              } else {
                source = audioContext.createBufferSource(); // creates a sound source
                source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
                source.buffer = songBuffer;                    // tell the source which sound to play
                source.start(time, rStart, rEnd - rStart);                           // play the source now
              }
            }

            function computePitchGraph(floatarray) {
                var i0 = getIndex(rStart, rawTime);
                var i1 = getIndex(rEnd, rawTime);
                var subPSeries = arrayPitch.slice(i0, i1);
                var delay = crossCorrelation(subPSeries, floatarray);
                floatarray = correctPitches(subPSeries,floatarray);
                display.plotData(floatarray, $scope.tempo, delay);
            };

            function getIndex(t0, series) {
                var i = 0, j = series.length-1;
                var temp = 0;
                while (j-i > 1) {
                    temp = parseInt((i+j)/2);
                    if (series[temp] > t0) {
                        j = temp;
                    } else {
                        i = temp;
                    }
                    
                }
                return j;
            }


            function correctPitches(aReference,aUser) {
                stretchFactor = aUser.length/aReference.length;
                console.log(stretchFactor)
                for (var i=0;i<aUser.length;i++) {
                    refIndex = Math.round(i/stretchFactor);
                    if(aReference[refIndex] > 0)
                        refPitch = aReference[refIndex];
                    else {
                        var j =0;
                        while (aReference[refIndex-j] < 0)
                            j--;
                        refPitch = aReference[refIndex - j -1];
                    }
                    aUser[i] = closestCorrection(aUser[i],refPitch);
                }
                return aUser;
            }

            function closestCorrection(pUser,pReference) {
                retPitch = pUser;
                if(Math.abs(pUser-12 - pReference) < Math.abs(pUser - pReference)) {
                    retPitch = pUser-12;
                    if(Math.abs(pUser+12 - pReference) < Math.abs(pUser-12 - pReference))
                        retPitch = pUser + 12;
                }
                return retPitch;
            }

            function crossCorrelation(aReference, aUser) {
                var shifts = 20;
                var shiftNum = 10; // ~30ms
                var ratio = aReference.length/aUser.length;
                var sumArray = [];
                for (var i=0; i<shifts;i++) {
                    var sum = 0;
                    var ref = 0;
                    var index = 0;
                    for (var j=0;j<aReference.length;j++) {
                        index = Math.round(j/ratio) + i*shiftNum;
                        if (index > aUser.length-1) continue;
                        ref = aReference[j];
                        user = aUser[index];
                        if (ref < -5 || ref > 16) continue;
                        if (user < -5 || user > 16) continue;
                        sum = sum + (ref+6)*(user+6);
                    }
                    sumArray.push(sum);
                }
                var maxIndex = indexOfMax(sumArray);
                return maxIndex*(shiftNum/ratio);
            }

            function indexOfMax(arr) {
                if (arr.length === 0) {
                    return -1;
                }

                var max = arr[0];
                var maxIndex = 0;

                for (var i = 1; i < arr.length; i++) {
                    if (arr[i] > max) {
                        maxIndex = i;
                        max = arr[i];
                    }
                }

                return maxIndex;
            }

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
                    createAudio();
                } else {
                    stretchedBuffer = null;
                }
                
            });

             $("#seekbar").bind("change", function(){
                var seekbar = document.querySelector('#seekbar');
                display.seekbarEnd(seekbar.value);
             });

            $("#seekbar").bind("immediate-value-change", function(){
                var seekbar = document.querySelector('#seekbar');
                var value = seekbar.immediateValue;
                if (seekbar.dragging) {
                    display.seekbarMove(value, value - seekbar.value);
                }
                $("#time-label").text(Math.floor(value/60) + "." + Math.round(value%60));
             });

            $scope.$watch('pitchShift', function() {
                if (!$scope.song) {
                    return;
                }
                if ($scope.pitchShift.value > 0) {
                    createAudio();
                }
                PitchModel.rootUserFreq = MusicCalc.midiNumToFreq($scope.song.rootNote-$scope.pitchShift.value);
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
                // rawTime = $scope.song.timeSeries;
                // rawFreq = $scope.song.pitchSeries;
                var arrayTime = [];
                var arrayFreq = [];
                for (var i = 0; i < rawFreq.length; i++) {
                    // if (rawFreq[i] > 0) {
                        arrayTime.push(rawTime[i]);
                        arrayFreq.push(rawFreq[i]);
                    // }
                }
                arrayPitch = [];
                for (var i = 0; i < arrayFreq.length; i++) {
                    if (arrayFreq[i] > 0) {
                        var pitch = MusicCalc.getCents(PitchModel.rootFreq, arrayFreq[i]) / 100;
                        arrayPitch.push(pitch);
                    } else {
                        arrayPitch.push(-100);
                    }
                }
                display.init(arrayPitch, arrayTime, lrc, songBuffer.duration, $scope.song.scale);
                // if ($scope.tempo < 1) {
                //     calculateStretchedBuffer();
                // } else {
                //     stretchedBuffer = null;
                // }
            }

            // function calculateStretchedBuffer() {
            //     display.setFlash(SLOWER_MSG);
            //     var t0 = performance.now();
            //     var pitchShifter = new PitchShifter(songBuffer, (1 - $scope.tempo)*10, 0, songBuffer.duration);
            //     var t1 = performance.now();
            //     console.log((t1 - t0) + " milliseconds.");
            //     // pitchShifter.play();
            //     stretchedBuffer = pitchShifter.out;
            // }

            // function calculateStretchedBuffer2() {
            //     display.setFlash(SLOWER_MSG);
            //     // var channels = songBuffer.numberOfChannels;
            //     // calculate only one channel to speed up
            //     var channels = 1;
            //     var channelData = new Array(channels);
            //     for (var i=0; i< channels;i++) {
            //         channelData[i] = songBuffer.getChannelData(i);
            //     }
            //     stretchWorker.postMessage({
            //         command: 'calculate',
            //         sampleRate: songBuffer.sampleRate,
            //         channelData: channelData,
            //         tempo: $scope.tempo,
            //         start: rStart,
            //         end: rEnd
            //     });
            // }

            // stretchWorker.onmessage = function(e) {
            //   switch (e.data.command) {
            //     case 'done':
            //         var outBufferList = e.data.outBufferList;
            //         stretchedBuffer = audioContext.createBuffer(outBufferList.length, outBufferList[0].length, audioContext.sampleRate);
            //         for (var j=0; j<outBufferList.length;j++) {
            //             var o = stretchedBuffer.getChannelData(j);
            //             for (var i = 0; i < outBufferList[j].length; i++) {
            //                 o[i] = outBufferList[j][i];
            //             }
            //         }
            //         display.clearFlash();
            //       break;
            //   }
            // };
            // 1. get index
            // disable enable next & previous button
            // 2. get timestamp
            // 3. get shift
            // 4. set slider to shift
            // 5. set brush extent
            var lyricsIndex = 0;
            var lyricsBuffer = 0.2;
            var defaultBrushSpan = 5.8;

            function movetoLyrics(index) {
                lyricsIndex = index;
                var lrcLength = lrc.getLyrics().length;
                var tStart = lrc.getLyric(lyricsIndex).timestamp - lyricsBuffer - delayLyrics;
                setSeekbarValue(tStart);
                display.seekbarMove(tStart, tStart);
                display.seekbarEnd(tStart);
                var span;
                if (lyricsIndex < lrcLength -1) {
                    span = lrc.getLyric(lyricsIndex+1).timestamp - lrc.getLyric(lyricsIndex).timestamp;
                    if (span > defaultBrushSpan) {
                        span = defaultBrushSpan;
                    }
                } else {
                    span = lrc.getLyric(lyricsIndex).timestamp + defaultBrushSpan;
                }
                display.setMainBrushExtent(lyricsBuffer, lyricsBuffer + span);
                // button css
                if (lyricsIndex == 0) {
                    $("#previous-button").addClass("slick-disabled");
                } else {
                    $("#previous-button").removeClass("slick-disabled");
                }
                if (lyricsIndex == lrcLength - 1) {
                    $("#next-button").addClass("slick-disabled");
                } else {
                    $("#next-button").removeClass("slick-disabled");
                }
            };

            $( "#next-button" ).click(function() {
                var lrcLength = lrc.getLyrics().length;
                if (!lrc.getLyrics() || lrcLength == lyricsIndex -1) {
                    return;
                }
                movetoLyrics(++lyricsIndex);
            });

            $( "#previous-button" ).click(function() {
                var lrcLength = lrc.getLyrics().length;
                if (!lrc.getLyrics() || lyricsIndex == 0) {
                    return;
                }
                movetoLyrics(--lyricsIndex);
            });

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
                    if ($scope.tempo < 1 || $scope.pitchShift.value > 0) {
                        sound.pause();
                        sound.currentTime = 0;
                    } else {
                        source.stop();    
                    }
                    
                    gameController.setIntervalHandler(function(data) {});
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