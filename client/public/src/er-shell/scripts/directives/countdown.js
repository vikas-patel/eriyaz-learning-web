define(['angular', './module'], function(angular, app) {
    app.directive('countdown', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                duration: '='
            },
            template: '<div id="countdown" align="center" class="center"></div>',
          controller: function($scope, $element, $interval) {
            var count;
            function updateCounter() {
              if (count == "SING") {
                count = "";
              } else if (count == 1) {
                count = "SING";
              } else {
                count--;
              }
              $element.text(count);
            }
            
            $scope.$on('start-timer', function() {
              var interval = $scope.duration/3;
              count = 4;
              updateCounter();
              $interval(function() {
                updateCounter();
              }, interval, 4);
            });
          }
        }
    });
});