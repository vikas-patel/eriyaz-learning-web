define(['./module', './display', './problem','./levels', 'melody', 'note', 'webaudioplayer', 'currentaudiocontext'],
    function(app, Display, Problem, levels,Melody, Note, Player, CurrentAudioContext) {
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);
        var sequence;
        var playTime = 1000;
        var currLoopId = -1;
        var scale = [0, 2, 4, 5, 7, 9, 11, 12];

        app.controller('SwarPositionCtrl', function($scope, ScoreService) {
            $scope.count = 0;
            $scope.right = 0;
            $scope.levels = levels;
            $scope.level = levels[0];

            $scope.$watch('level', function() {
                display.showLevel($scope.level);
                resetScore();
                display.reset();
            });

            $scope.$watch('count', function() {
                if ($scope.count == $scope.level.total) {
                    // Display score & save
                    $scope.score = $scope.right / $scope.count;
                    $scope.showOverlay = true;
                    ScoreService.save("SwarPosition", $scope.level.name, $scope.score);
                }
            });
            
            $scope.isLooping = function() {
                return currLoopId >= 0;
            };

            $scope.checkAnswer = function() {
                cancelCurrentLoop();
                playSequence(function() {
                    display.setFeedback(display.getSelected() === problem.getDegree());
                    $scope.count++;
                    if(display.getSelected() === problem.getDegree())
                        $scope.right++;
                    $scope.$apply();
                });
            };


            var display = new Display(scale, $scope.checkAnswer);
            var problem;
            var tracker = 0;
            $scope.newInterval = function() {
                cancelCurrentLoop();
                display.reset();
                problem = Problem.getNewProblem(scale,$scope.level);
                playInterval();
            };

            $scope.repeatPlay = function() {
                cancelCurrentLoop();
                playInterval();
            };

            function playInterval() {
                var playTime = 1000;
                var melody = new Melody();
                melody.addNote(Note.createFromFreq(problem.getBaseFreq(), playTime));
                melody.addNote(Note.createFromFreq(problem.getNoteFreq(), playTime));
                player.playMelody(melody);
            }

            function playSequence(callback) {
                var playTime = 1000;
                var intervalSequence = problem.getAnswerSeqDegs();
                var freqsSequence = problem.getAnswerSeqFreqs();
                currLoopId = setInterval(function() {
                    display.markNote(intervalSequence[tracker]);
                    player.playNote(freqsSequence[tracker], playTime);
                    tracker++;
                    if (tracker > intervalSequence.length-1) {
                        cancelCurrentLoop();
                        callback();
                    }
                }, playTime);
            }

            function cancelCurrentLoop() {
                tracker = 0;
                clearInterval(currLoopId);
                currLoopId = -1;
            }

            function resetScore() {
                $scope.count = 0;
                $scope.right = 0;
            }

            $scope.closeOverlay = function() {
                $scope.showOverlay = false;
                resetScore();
            };

            $scope.restart = function() {
                $scope.showOverlay = false;
                resetScore();
                $scope.newInterval();
            };
        });
    });