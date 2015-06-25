define(['angular', './module'], function(angular, app) {
    app.directive('overlay', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                restart: "&",
                right: '=',
                total: '=',
                level: '='
            },
            template: '<div><div id="overlay" ng-show="showOverlay"></div>' +
            '<div id="overlay-content" ng-show="showOverlay">' +
                '<div class="padding5"><h1>Exercise Ends</h1></div>' +
                '<div class="padding5"><h2>Your Score: <span id="overlay-score">{{right*100/total  | number:0}}%</span></h2></div>' +
                '<div class="padding5">' +
                    '<button ng-click="restartProxy()" id="play-again">Restart</button>' +
                    '<button ng-click="closeOverlay()" id="close-overlay">Close</button>' +
                '</div>' +
            '<div></div>',
          controller: function($scope) {
            $scope.restartProxy= function() {
              $scope.restart();
            };

            $scope.closeOverlay = function() {
                $scope.showOverlay = false;
            };

            $scope.$watch('total', function() {
                  if ($scope.total == $scope.level.total) {
                      $scope.showOverlay = true;
                      $scope.$parent.$broadcast('exercise-complete');
                  }
              });
          }
        }
    });
});