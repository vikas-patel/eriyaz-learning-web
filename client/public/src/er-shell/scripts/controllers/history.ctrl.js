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
      $scope.secondsToTime = function(secs) {
        var hours = Math.floor(secs / (60 * 60));
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        if (hours > 0) return hours + "h, " + minutes + "m";
        if (minutes > 0) return minutes + "m ";
        return seconds + "s";
    };

    $scope.scoreText = function(score) {
      if (score.appName == 'flappybird' || score.appName == 'fruitninja' || score.appName == 'singinggame2' || score.appName == 'voicematch2') {
        return score.score
      } else {
        return Math.round(score.score*100) + '%';
      }

    };

      $scope.sum = function(times) {
        var sum = _.reduce(times, function(start, time){ return start + time.time; }, 0);
        return $scope.secondsToTime(sum);
      }
  }
  );});