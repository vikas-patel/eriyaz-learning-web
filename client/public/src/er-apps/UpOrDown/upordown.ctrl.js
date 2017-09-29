define(['./module', './problem-gen', './display', 'webaudioplayer', 'currentaudiocontext', './levels-data'],
    function(app, ProblemGen, Display, Player, CurrentAudioContext, levels) {
        var getIntegerArray = function(start, end) {
            var arr = [];
            var j = start;
            while (j <= end) {
                arr.push(j);
                j++;
            }
            return arr;
        };

        var problem;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);

        var marker = 0;
        var playTime = 1000;
        var currLoopId;

        app.controller('UpOrDownCtrl', function($scope, ScoreService) {
            $scope.levels = levels;
            $scope.level = levels[0];
            $scope.testNotes = [1,2];
            var display = new Display($scope);

            $scope.right = 0;
            $scope.count = 0;

            $scope.$watch('level', function() {
                display.showLevel($scope.level);
                $scope.testNotes = $scope.level.testNotes;
                resetScore();
            });

            $scope.$watch('count', function() {
                if ($scope.count == $scope.level.total) {
                    // Display score & save
                    $scope.score = $scope.right / $scope.count;
                    $scope.showOverlay = true;
                    ScoreService.save("UpOrDown", $scope.level.name, $scope.score);
                    //resetScore();
                }
            });

            $scope.newProblem = function() {
                display.setFeedback("");
                problem = ProblemGen.getNewProblem($scope.level);
                playProblem();
                $scope.repeatBtn=true;
                $scope.repBtn=true;
            };

            $scope.repeat = function() {
                playProblem();
            };

            // $scope.isUp = function() {
            //     $scope.count++;
            //     display.setFeedback("Wrong :(");
            //     if (problem.isUp()) {
            //         display.setFeedback("Right!");
            //         $scope.right++;
            //     }
            //     $scope.repBtn=false;

            // };

            // $scope.isDown = function() {
            //     $scope.count++;
            //     display.setFeedback("Wrong :(");
            //     if (problem.isDown()) {
            //         display.setFeedback("Right!");
            //         $scope.right++;
            //     }
            //     $scope.repBtn=false;

            // };

            $scope.answer = function(ans) {
                $scope.count++;
                var actual;
                if (problem.isUp()) {
                    actual = $scope.testNotes[1];
                } else {
                    actual = $scope.testNotes[0];
                }
                if (ans == actual) {
                    display.setFeedback("Correct!");
                    $scope.right++;
                } else {
                    display.setFeedback("Sorry :(");
                }
                $scope.repBtn=false;
                $scope.$apply();
            };

            $scope.closeOverlay = function() {
                $scope.showOverlay = false;
                resetScore();
            };

            $scope.restart = function() {
                $scope.showOverlay = false;
                resetScore();
                $scope.newProblem();
            };

            function resetScore() {
                $scope.count = 0;
                $scope.right = 0;
            }

            function playProblem() {
                cancelCurrentLoop();
                var startTime = audioContext.currentTime + playTime / 1000;
                currLoopId = setInterval(function() {
                    noteStartTime = startTime + playTime * marker / 1000;
                    display.markNote(marker);
                    player.scheduleNote(problem.freqs[marker], noteStartTime, playTime);
                    marker++;
                    if (marker >= problem.freqs.length) {
                        cancelCurrentLoop();
                    }
                }, playTime);
            }

            function cancelCurrentLoop() {
                marker = 0;
                clearInterval(currLoopId);
                setTimeout(function() {
                    display.markNone();
                }, playTime);
            }
        });
    });