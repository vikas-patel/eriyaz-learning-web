define([],function() {
	return {
		score : 0,
		count : 0,
		statuses : {
			SPOT_ON : 0,
			NEAR_MISS : 1,
			FAR_OFF : 2
		},
		updateScore : function(latest) {
			this.score = (this.score * this.count + latest)/++this.count;
		},
		scorePoint : function(actual,reference) {
			var diff = Math.abs(actual-reference);
			
			if(diff === 0) {
				this.updateScore(1);
				return this.statuses.SPOT_ON;
			} else if(diff === 1) {
				this.updateScore(0.5);

				return this.statuses.NEAR_MISS;
			} else {
				this.updateScore(0);
				return this.statuses.FAR_OFF;
			}
		},
		getExerciseScore : function() {
			return this.score;
		},
		reset : function() {
			this.count = 0;
			this.score = 0;
		}
	};
});