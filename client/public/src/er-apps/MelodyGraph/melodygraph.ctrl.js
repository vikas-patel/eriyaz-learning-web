define(['./module', './notesequence', 'd3','./chart','./frequencyutil'], function(app, NoteSequence, d3, Chart,FrequencyUtil) {
    var sequence;

    app.controller('MelodyGraphCtrl', function($scope) {
        $scope.numNotesOpts = [2, 3, 4, 5, 6];
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
            var mySeq = new NoteSequence(FrequencyUtil.getFreqsArray(sequence.freqs[0],chart.getData()));
            mySeq.play();
        };

        $scope.showAnswer = function() {
            chart.plotData(FrequencyUtil.getCentsArray(sequence.freqs[0],sequence.freqs));
        };
    });
});