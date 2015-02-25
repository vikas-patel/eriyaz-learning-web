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
	
	// Score.prototype.formatScore = function (value){
	// 	value = value*100;
	// 	value = value.toFixed(1);
	// 	return value + "%";
	// };
	
	Score.prototype.reset = function(){
		this.$scope.scoreCount = 0;
		this.$scope.lastScore = 0;
		this.$scope.totalScore = 0;
		//$('#'+this.lastScoreId).text(this.lastScore);
		//$('#'+this.totalScoreId).text(this.totalScore);
	}

	return {getScore: function ($scope){
		var score = new Score($scope);
		return score;
	}};
});