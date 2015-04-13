define(['./module', './intervalgen', './display'], function(app, intervalGen, Display) {
    var sequence;

    app.controller('SwarSpaceCtrl', function($scope) {
        $scope.attempts = 0;
        $scope.error = 0;
        $scope.avgError = 0;

        var display = new Display();
        var intV;
        $scope.newInterval = function() {
            display.reset();
            intV = intervalGen.getRandomInterval();
            intV.play();
        };

        $scope.repeatPlay = function() {
            intV.play();
        };

        $scope.checkAnswer = function() {
            $scope.attempts++;
            var answer = Math.abs(intV.getCents());
            var guess = display.getCents();

            display.showCents(answer);
            var offBy = Math.abs(guess - answer);
            $scope.error = Math.round(offBy*1000/answer)/10;
            $scope.avgError = Math.round(($scope.avgError * ($scope.attempts-1) + $scope.error)*10/$scope.attempts)/10;
        };

    });
});