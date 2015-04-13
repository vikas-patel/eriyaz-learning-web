define(['./module', './notesequence'], function(app, NoteSequence) {
    var getIntegerArray = function(start, end) {
        var arr = [];
        var j = start;
        while (j <= end) {
            arr.push(j);
            j++;
        }
        return arr;
    };

    var sequence;

    app.controller('UpOrDownCtrl', function($scope) {
        var maxNotes = 6;
        $scope.numNotesOpts = getIntegerArray(2, maxNotes);
        $scope.numNotes = 2;
        $scope.firstNote = 1;
        $scope.secondNote = 2;
        $scope.firstNotesOpts = getIntegerArray(1, $scope.numNotes - 1);
        $scope.secondNoteOpts = getIntegerArray($scope.firstNote + 1, $scope.numNotes);

        $scope.right = 0;
        $scope.total = 0;

        $scope.$watchGroup(['numNotes', 'firstNote'], function() {
            $scope.firstNotesOpts = getIntegerArray(1, $scope.numNotes - 1);
            $scope.secondNoteOpts = getIntegerArray($scope.firstNote + 1, $scope.numNotes);
            $scope.secondNote = $scope.firstNote + 1;
        });

        $scope.$watch('total', function() {
            $scope.accuracy = $scope.right * 100 / $scope.total;

        });

        $scope.newSequence = function() {
            sequence = NoteSequence.getRandomSequence($scope.numNotes);
            sequence.play();
        };

        $scope.repeat = function() {
            sequence.play();
        };

        $scope.isUp = function() {
            $scope.total++;
            if (sequence.isUp($scope.firstNote - 1, $scope.secondNote - 1)) {
                $scope.right++;
            }
        };

        $scope.isDown = function() {
            $scope.total++;
            if (sequence.isDown($scope.firstNote - 1, $scope.secondNote - 1)) {
                $scope.right++;
            }
        };

        $scope.isSame = function() {
            $scope.total++;
            if (sequence.isSame($scope.firstNote - 1, $scope.secondNote - 1)) {
                $scope.right++;
            }
        };
    });
});