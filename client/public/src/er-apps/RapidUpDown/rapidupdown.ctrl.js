define(['./module', 'webaudioplayer', 'currentaudiocontext', 'melody', 'note', 'music-calc'],
    function(app, Player, CurrentAudioContext, Melody, Note, MusicCalc) {


        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);

        var MIDDLE_C = 60;

        var maxNote = 84;
        var minNote = 36;

        var currBase = MIDDLE_C;
        var currNote = currBase;

        var intsArray = [-2, -1, 1, 2];

        var stopBeep;

        app.controller('RapidUpDownCtrl', function($scope, ScoreService, $interval) {
            $scope.timeout = true;

            $scope.correct = 0;
            $scope.wrong = 0;
            $scope.remainingTime = "01:00";
            var timeout = true;

            $scope.isUp = function() {
                if (currNote > currBase)
                    $scope.correct++;
                else $scope.wrong++;
                newProblem();

            };

            $scope.isDown = function() {
                if (currNote < currBase)
                    $scope.correct++;
                else $scope.wrong++;
                newProblem();

            };

            $scope.isSame = function() {
                if (currNote === currBase)
                    $scope.correct++;
                else $scope.wrong++;
                newProblem();
            };

            $scope.start = function() {
                timeout = false;
                startTimer(60);
                newProblem();
            };


            function startTimer(duration) {
                var timer = duration,
                    minutes, seconds;
                var timerHandle = $interval(function() {
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
                    currBase = currNote;
                    currNote = currBase + intsArray[Math.floor(Math.random() * intsArray.length)];
                    stopBeep = player.playInfinite(MusicCalc.midiNumToFreq(currNote));
                }
            };



            function resetScore() {
                $scope.correct = 0;
                $scope.wrong = 0;
            }

            $scope.closeOverlay = function() {
                $scope.showOverlay = false;
                if (stopBeep) stopBeep.stop();
                resetScore();
            };

            $scope.restart = function() {
                $scope.showOverlay = false;
                currBase = MIDDLE_C;
                currNote = MIDDLE_C;
                resetScore();
                $scope.start();
            };

        });
    });