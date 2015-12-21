define(['./module', 'webaudioplayer', 'currentaudiocontext', 'melody', 'note', 'music-calc', './problem-gen'],
    function(app, Player, CurrentAudioContext, Melody, Note, MusicCalc, problemGen) {


        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        var currProblem;

        var stopBeep;
        var timerHandle;

        var marker = 0;
        var playTime = 100;
        var currLoopId;

        app.controller('PhraseShapeCtrl', function($scope, ScoreService, $interval) {
            $scope.timeout = true;

            $scope.total = 0;
            $scope.correct = 0;
            $scope.remainingTime = "10:00";
            $scope.shapes = ['/', '\\', '/\\', '\\/', '/\\/', '\\/\\'];
            $scope.correctAns = '';

            var timeout = true;

            $scope.start = function() {
                timeout = false;
                startTimer(600);
                newProblem();
            };

            $scope.checkAns = function(index) {
                var problem = problemGen.getNewProblem();
                $scope.total++;
                $scope.correctAns = $scope.shapes[currProblem.getShape()];
                if (index === currProblem.getShape()) {
                    $scope.correct++;
                }
            };

            $scope.newProblem = function() {
                playTime = 100;
                newProblem();
            };

            $scope.repeat = function() {
                playTime = 100;
                
                playMelody();
            };

            $scope.repeatSlow = function() {
                playTime = 400;
                playMelody();
            };

            function startTimer(duration) {
                var timer = duration,
                    minutes, seconds;
                timerHandle = $interval(function() {
                    minutes = parseInt(timer / 60, 10);
                    seconds = parseInt(timer % 60, 10);

                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    $scope.remainingTime = minutes + ":" + seconds;

                    if (--timer < 0) {
                        $scope.showOverlay = true;
                        $interval.cancel(timerHandle);
                        timeout = true;
                    }
                }, 1000);
            }


            var newProblem = function() {
                if (stopBeep) stopBeep.stop();
                if (!timeout) {
                    currProblem = problemGen.getNewProblem();
                    playMelody();
                }
                // $scope.correctAns = '';
            };



            function resetScore() {
                $scope.correct = 0;
                $scope.total = 0;
            }

            function playMelody() {
                cancelCurrentLoop();
                var startTime = audioContext.currentTime + playTime / 1000;
                currLoopId = setInterval(function() {
                    noteStartTime = startTime + playTime * marker / 1000;
                    var noteFreq = MusicCalc.midiNumToFreq(currProblem.notes[marker]);
                    player.scheduleNote(noteFreq, noteStartTime, playTime);
                    marker++;
                    if (marker >= currProblem.notes.length) {
                        cancelCurrentLoop();
                    }
                }, playTime);
            }

            function cancelCurrentLoop() {
                marker = 0;
                clearInterval(currLoopId);
            }

            $scope.closeOverlay = function() {
                $scope.showOverlay = false;
                if (stopBeep) stopBeep.stop();
                resetScore();
            };

            $scope.restart = function() {
                $scope.showOverlay = false;
                resetScore();
                $interval.cancel(timerHandle);
                $scope.start();
            };

        });
    });