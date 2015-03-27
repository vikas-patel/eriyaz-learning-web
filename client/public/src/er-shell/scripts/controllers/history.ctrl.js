  define(['./module'], function(app) {
    app.controller("HistoryCtrl", function($scope,$window,Score) {
      $scope.scores = Score.query({id:$window.sessionStorage.userId});
    });
  });