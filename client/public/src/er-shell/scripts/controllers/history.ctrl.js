  define(['./module'], function(app) {
  	app.controller("HistoryCtrl", function($scope, $window, Score,$stateParams,$state) {
  		var usrId = $state.current.name==='s_history'? $stateParams.s_id : $window.localStorage.userId;
  		$scope.sid = $stateParams.s_id;
  		$scope.dailyScore = Score.query({
  			id: usrId
  		});

  	});
  });