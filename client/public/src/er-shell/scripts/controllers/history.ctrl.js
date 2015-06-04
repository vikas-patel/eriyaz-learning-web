  define(['./module'], function(app) {
  	app.controller("HistoryCtrl", function($scope, $window, Score, $stateParams, $state, ScoreService) {
  		$scope.$watch(function() {
  			return $stateParams.s_id;
  		}, function() {
  			var userId = $state.current.name === 's_history' ? $stateParams.s_id : $window.localStorage.userId;
        if ($scope.uiModel.userType == 'admin') {
            ScoreService.findAllScores(userId).success(function(data) {$scope.dailyScore = data;});
        } else {
            ScoreService.findTopScores(userId).success(function(data) {$scope.dailyScore = data;});
        }
  	});
  });
  });