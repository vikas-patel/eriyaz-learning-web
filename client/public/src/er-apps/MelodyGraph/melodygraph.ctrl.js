define(['./module', './notesequence', 'd3', './chart', './frequencyutil', './levels'], function(app, NoteSequence, d3, Chart, FrequencyUtil, levels) {
    var sequence;

    app.controller('MelodyGraphCtrl', function($scope, ScoreService) {
        $scope.levels = levels;
        $scope.selectedLevelIdx = 0;
        $scope.attempts = 0;
        $scope.total = 10;
        $scope.currAccuracy = 0;
        $scope.avgAccuracy = 0;

        $scope.showOverlay = false;
        $scope.repeatDisabled = false;
        $scope.playMyDisabled = false;
        $scope.checkDisabled = false;
        $scope.newDisabled = false;

        var chart = new Chart();
        var selectedLevel = levels[$scope.selectedLevelIdx];
        $scope.$watch('selectedLevelIdx', function() {
            selectedLevel = levels[$scope.selectedLevelIdx];
            initSelectedLevel();
        });

        $scope.nextLevel = function() {
            $scope.selectedLevelIdx++;
        };

        $scope.replay = function() {
            initSelectedLevel();
        };

        $scope.closeOverlay = function() {
          $scope.showOverlay = false;  
        };
       

        $scope.newSequence = function() {
            sequence = NoteSequence.getRandomSequence(selectedLevel.numNotes);
            sequence.play();
            $scope.checkDisabled = false;
            chart.reset(selectedLevel.numNotes);
            $scope.repeatDisabled = !selectedLevel.isRepeat;
            $scope.playMyDisabled = !selectedLevel.isPlayMy;
        };

        $scope.repeat = function() {
            sequence.play();
        };

        $scope.playMyGraph = function() {
            var mySeq = new NoteSequence(FrequencyUtil.getFreqsArray(sequence.freqs[0], chart.getData()));
            mySeq.play();
        };

        $scope.check = function() {
            var ansCentsArray = FrequencyUtil.getCentsArray(sequence.freqs[0], sequence.freqs);
            chart.plotData(ansCentsArray);
            $scope.currAccuracy = calcScore(chart.getData(), ansCentsArray);
            $scope.avgAccuracy = ($scope.avgAccuracy * $scope.attempts + $scope.currAccuracy) / ($scope.attempts + 1);
            $scope.attempts++;
            chart.setFeedback('Accuracy:' + Math.round($scope.currAccuracy * 100) + '%');
            $scope.repeatDisabled = $scope.playMyDisabled = false;
            $scope.checkDisabled = true;
            if ($scope.attempts === $scope.total) {
                exerciseComplete();
            }
        };

        function initSelectedLevel () {
            $scope.showOverlay = false;
            chart.reset(selectedLevel.numNotes);
            $scope.repeatDisabled = !selectedLevel.isRepeat;
            $scope.playMyDisabled = !selectedLevel.isPlayMy;
            $scope.checkDisabled = true;
            $scope.newDisabled = false;
            resetScore();
        }

        function exerciseComplete() {
            ScoreService.save("MelodyGraph", "Level " + $scope.selectedLevelIdx + 1, $scope.avgAccuracy);
            $scope.newDisabled = true;
                $scope.showOverlay=true;
        }

        function calcScore(guessCentsArray, ansCentsArray) {
            var accSum = 0;
            for (var i = 1; i < ansCentsArray.length; i++) {
                var accuracy = 0;
                if (guessCentsArray[i] * ansCentsArray[i] > 0) {
                    var offBy = Math.abs(guessCentsArray[i] - ansCentsArray[i]);
                    var base = Math.abs(ansCentsArray[i]) > Math.abs(guessCentsArray[i]) ? Math.abs(ansCentsArray[i]) : Math.abs(guessCentsArray[i]);
                    accuracy = 1 - offBy / base;
                    if (Math.abs(ansCentsArray[i]) < 100 && Math.abs(guessCentsArray[i]) < 100) {
                        accuracy = 1;
                    }
                } else {
                    if (Math.abs(ansCentsArray[i]) < 50 && Math.abs(guessCentsArray[i]) < 50) {
                        accuracy = 1;
                    }
                }
                accSum = accSum + accuracy;
            }
            return accSum / (ansCentsArray.length - 1);
        }

        function resetScore() {
            $scope.attempts = 0;
            $scope.avgAccuracy = 0;
            $scope.currAccuracy = 0;
        }
    });
});