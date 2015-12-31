define([],function() {
	return {
		score : 0,
		count : 0,
		statuses : {
			SPOT_ON : 0,
			NEAR_MISS : 1,
			FAR_OFF : 2
		},
		scorePoint : function(actual,reference) {
			var diff = Math.abs(actual-reference);
			score = (this.score * this.count + 1/(1+diff))/this.count+1;
			this.count ++;
			if(diff === 0) {
				return this.statuses.SPOT_ON;
			} else if(diff === 1) {
				return this.statuses.NEAR_MISS;
			} else return this.statuses.FAR_OFF;
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