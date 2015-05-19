define(['./module', './intervalgen', './display'], function(app, intervalGen, Display) {
    var sequence;
    var levels = [{
            name:"level 1",
            isBaseFixed: true,
            isUp: true,
            total: 10
        }, {
            name:"level 2",
            isBaseFixed: true,
            isUp: false,
            total: 10
        }, {
            name:"level 3",
            isBaseFixed: false,
            isUp: true,
            total: 10
        }, {
            name:"level 4",
            isBaseFixed: false,
            isUp: false,
            total: 10
        }];
    app.controller('SwarSpaceCtrl', function($scope) {
        $scope.attempts = 0;
        $scope.accuracy = 0;
        $scope.avgAccuracy = 0;
        $scope.level = levels[0];
        $scope.levels = levels;

        var display = new Display($scope.level.isUp);
        var intV;
        $scope.newInterval = function() {
            display.reset($scope.level.isUp);
            intV = intervalGen.getRandomInterval($scope.level.isBaseFixed, $scope.level.isUp);
            intV.play();
        };

        $scope.repeatPlay = function() {
            intV.play();
        };

        $scope.resetScore = function() {
            $scope.attempts = 0;
            $scope.accuracy = 0;
            $scope.avgAccuracy = 0;
        };

        $scope.$watch('level', function() {
            $scope.resetScore();
            display.reset($scope.level.isUp);
        });

        $scope.checkAnswer = function() {
            $scope.attempts++;
            var answer = Math.abs(intV.getCents());
            var guess = display.getCents();

            display.showCents(answer);
            var offBy = Math.abs(guess - answer);
            var base = answer > guess ? answer : guess;
            $scope.accuracy = 1 - offBy/base;
            $scope.avgAccuracy = ($scope.avgAccuracy * ($scope.attempts-1) + $scope.accuracy)/$scope.attempts;
        };

    });
});