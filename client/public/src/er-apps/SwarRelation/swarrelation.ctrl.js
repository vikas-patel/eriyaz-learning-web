define(['./module', './display', './problem','./levels', 'melody', 'note', 'webaudioplayer', 'currentaudiocontext'],
    function(app, Display, Problem, levels,Melody, Note, Player, CurrentAudioContext) {
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);
        var sequence;
        var playTime = 1000;
        var currLoopId = -1;
        var scale = [0, 2, 4, 5, 7, 9, 11, 12];

        app.controller('SwarRelationCtrl', function($scope) {
            $scope.total = 0;
            $scope.correct = 0;
            $scope.levels = levels;
            $scope.selectedLevelIdx = 0;

            $scope.$watch('selectedLevelIdx', function() {
                display.showLevel(levels[$scope.selectedLevelIdx]);
                resetScore();
                display.reset();
            });
            
            $scope.isLooping = function() {
                return currLoopId >= 0;
            };


            var display = new Display(scale);
            var problem;
            var tracker = 0;
            $scope.newInterval = function() {
                cancelCurrentLoop();
                display.reset();
                problem = Problem.getNewProblem(scale,levels[$scope.selectedLevelIdx]);
                playInterval();
            };

            $scope.repeatPlay = function() {
                cancelCurrentLoop();
                playInterval();
            };

            $scope.checkAnswer = function() {
                cancelCurrentLoop();
                playSequence(function() {
                    display.setFeedback(display.getSelected() === problem.getDegree());
                    $scope.total++;
                    if(display.getSelected() === problem.getDegree())
                        $scope.correct++;
                    $scope.$apply();
                });
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
                $scope.total = 0;
                $scope.right = 0;
            }
        });
    });