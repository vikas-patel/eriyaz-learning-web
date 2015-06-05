define(['./module', './notesequence', 'd3', './chart', './frequencyutil'], function(app, NoteSequence, d3, Chart, FrequencyUtil) {
    var sequence;

    app.controller('MelodyGraphCtrl', function($scope) {
        $scope.numNotesOpts = [3, 4, 5, 6];
        $scope.numNotes = 3;

        var chart = new Chart();

        $scope.newSequence = function() {
            sequence = NoteSequence.getRandomSequence($scope.numNotes);
            sequence.play();
            chart.reset($scope.numNotes);
        };

        $scope.repeat = function() {
            sequence.play();
        };

        $scope.playMyGraph = function() {
            var mySeq = new NoteSequence(FrequencyUtil.getFreqsArray(sequence.freqs[0], chart.getData()));
            mySeq.play();
        };

        $scope.showAnswer = function() {
            var ansCentsArray = FrequencyUtil.getCentsArray(sequence.freqs[0], sequence.freqs);
            chart.plotData(ansCentsArray);
            $scope.avgAccuracy = calcScore(chart.getData(), ansCentsArray);

        };

        function calcScore(guessCentsArray, ansCentsArray) {
            var accSum = 0;
            for (var i = 1; i < ansCentsArray.length; i++) {
                var offBy = Math.abs(guessCentsArray[i] - ansCentsArray[i]);
                var base = Math.abs(ansCentsArray[i] > guessCentsArray[i] ? ansCentsArray[i] : guessCentsArray[i]);
                var accuracy = 1 - offBy / base;
                console.log(accuracy);
                accSum = accSum + accuracy;
            }
            return accSum/(ansCentsArray.length-1);
        }
    });
});