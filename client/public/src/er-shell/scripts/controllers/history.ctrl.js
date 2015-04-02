  define(['./module'], function(app) {
  	app.controller("HistoryCtrl", function($scope, $window, Score, $stateParams, $state) {
  		$scope.$watch(function() {
  			return $stateParams.s_id;
  		}, function() {
  			var usrId = $state.current.name === 's_history' ? $stateParams.s_id : $window.localStorage.userId;
  			$scope.dailyScore = Score.query({
  				id: usrId
  			});
  		});
  	});
  });