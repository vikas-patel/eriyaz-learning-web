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

        app.controller('UpOrDownCtrl', function($scope) {


            $scope.levels = levels;
            $scope.selectedLevelIdx = 0;
            $scope.testNotes = [1,2];
            var display = new Display();


            $scope.right = 0;
            $scope.count = 0;

            $scope.$watch('selectedLevelIdx', function() {
                display.showLevel(levels[$scope.selectedLevelIdx]);
                $scope.testNotes = levels[$scope.selectedLevelIdx].testNotes;
                resetScore();
            });

            $scope.$watch('count', function() {
                if ($scope.count == $scope.levels[$scope.selectedLevelIdx].total) {
                    // Display score & save
                    console.log("save score");
                    $scope.score = $scope.right * 100 / $scope.count;
                    resetScore();
                }

            });

            $scope.newProblem = function() {
                display.setFeedback("");
                problem = ProblemGen.getNewProblem(levels[$scope.selectedLevelIdx]);
                playProblem();
            };

            $scope.repeat = function() {
                playProblem();
            };

            $scope.isUp = function() {
                $scope.count++;
                display.setFeedback("Wrong :(");
                if (problem.isUp()) {
                    display.setFeedback("Right!");
                    $scope.right++;
                }
            };

            $scope.isDown = function() {
                $scope.count++;
                display.setFeedback("Wrong :(");
                if (problem.isDown()) {
                    display.setFeedback("Right!");
                    $scope.right++;
                }
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