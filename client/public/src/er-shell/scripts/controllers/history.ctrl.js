  define(['./module'], function(app) {
  	app.controller("HistoryCtrl", function($scope, $window, Score,$stateParams,$state) {
  		// $state.reload();
  		 console.log($stateParams);
  		console.log($state.current.name==='s_history');
  		console.log($state.current.name);
  		var usrId = $state.current.name==='s_history'? $stateParams.s_id : $window.localStorage.userId;
  		$scope.sid = $stateParams.s_id;
  		$scope.dailyScore = Score.query({
  			id: usrId
  		});

  	});
  });