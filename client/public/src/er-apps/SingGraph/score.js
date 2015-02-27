define(function() {
	var Score = function($scope) {
		this.$scope = $scope;
	};
	
	Score.prototype.updateScore = function(expVal, outcome) {
		var diff = Math.abs(expVal - outcome);
		var lastScore = 1/(1+diff);
		var totalScore = this.$scope.totalScore;
		var count = this.$scope.scoreCount;
		totalScore = (totalScore*count + lastScore)/(count + 1);
		this.$scope.scoreCount++;
		this.$scope.lastScore = lastScore;
		this.$scope.totalScore = totalScore;
		this.$scope.$apply();
	};
	
	Score.prototype.reset = function(){
		this.$scope.scoreCount = 0;
		this.$scope.lastScore = 0;
		this.$scope.totalScore = 0;
	}

	return {getScore: function ($scope){
		var score = new Score($scope);
		return score;
	}};
});