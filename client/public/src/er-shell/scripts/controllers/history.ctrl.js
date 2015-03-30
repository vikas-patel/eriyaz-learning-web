  define(['./module','underscore'], function(app,_) {
  	app.controller("HistoryCtrl", function($scope, $window, Score) {
  		$scope.dailyScore = Score.query({
  			id: $window.sessionStorage.userId
  		});
  	});
  });