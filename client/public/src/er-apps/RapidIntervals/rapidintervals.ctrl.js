define(['./module', 'webaudioplayer', 'currentaudiocontext', 'melody', 'note'],
    function(app, Player, CurrentAudioContext, Melody, Note) {


        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);

        var playTime = 500;

        var MIDDLE_C = 60;
        var currBase;
        var currInterval;

        app.controller('RapidIntervalsCtrl', function($scope, ScoreService, $interval) {
            $scope.timeout = true;
            $scope.leftInterval = 0;
            $scope.rightInterval = 0;
            $scope.intervals = ["Sa-Sa", "Sa-re", "Sa-Re", "Sa-ga", "Sa-Ga", "Sa-ma", "Sa-Ma", "Sa-Pa", "Sa-dha", "Sa-Dha", "Sa-ni", "Sa-Ni", "Sa-Sa'"];

            $scope.correct = 0;
            $scope.remainingTime = "01:00";
            var timeout = true;

            $scope.leftClick = function() {
                checkAnswer(parseInt($scope.leftInterval));
            };

            $scope.rightClick = function() {
                checkAnswer(parseInt($scope.rightInterval));
            };

            $scope.start = function() {
                timeout = false;
                startTimer(60);
                newProblem();
            };

            function checkAnswer(guess) {
                if (!timeout) {
                    if (guess === currInterval) {
                        $scope.correct++;
                    }
                    newProblem();
                }
            }

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
                currBase = MIDDLE_C - Math.floor(Math.random() * 24);
                currInterval = Math.random() < 0.5 ? parseInt($scope.leftInterval) : parseInt($scope.rightInterval);
                playCurrent();
            };

            var playCurrent = function() {
                var melody = new Melody();
                melody.addNote(Note.createFromMidiNum(currBase, playTime));
                melody.addNote(Note.createFromMidiNum(currBase + currInterval, playTime));
                player.playMelody(melody);
            };

            $scope.repeat = function() {
                playCurrent();
            };

            function resetScore() {
                $scope.correct = 0;
            }

            $scope.closeOverlay = function() {
                $scope.showOverlay = false;
                resetScore();
            };

            $scope.restart = function() {
                $scope.showOverlay = false;
                resetScore();
                $scope.start();
            };

        });
    });