define([],function() {
	return {
		score : 0,
		count : 0,
		statuses : {
			SPOT_ON : 0,
			NEAR_MISS : 1,
			FAR_OFF : 2
		},
		points : [],
		pointsByNote:[],
		updateScore : function(latest) {
			this.score = (this.score * this.count + latest)/++this.count;
		},
		scorePoint : function(actual,noteIndex) {

			if (this.pointsByNote.length < noteIndex+1) {
				this.pointsByNote.push(new Array());
			}
			
			this.pointsByNote[noteIndex].push(actual);
			// this.points.push(actual);
			// var diff = Math.abs(actual-reference);
			
			// if(diff === 0) {
			// 	this.updateScore(1);
			// 	return this.statuses.SPOT_ON;
			// } else if(diff === 1) {
			// 	this.updateScore(0.5);

			// 	return this.statuses.NEAR_MISS;
			// } else {
			// 	this.updateScore(0);
			// 	return this.statuses.FAR_OFF;
			// }
		},
		getExerciseScore : function() {
			return this.score;
		},
		reset : function() {
			this.count = 0;
			this.score = 0;
			this.points = [];
			this.pointsByNote = [];
		},
		getConsecutiveCorrect : function(answers) {
			var consecutives = 0;
			var j = answers.length-1;
			while (j >= 0 &&  answers[j]) {
				consecutives++;
				j--;
			}
			return consecutives;
		},
		getScore : function(actNotes) {
			var diff = 0;
			var count = 0;
			for (var i = 0; i < actNotes.length; i++) {
				var round = actNotes[i];
				for (var j = 0; j < this.pointsByNote[i].length; j++) {
					var point = this.pointsByNote[i][j];
					if (round == Math.round(point)) {
						diff += Math.abs(round - point);
						count++;
					}
				}
			}
			var avg = diff/count; // always less than 0.5
			var score = 20 * (0.5 - avg);
			return Math.ceil(score);
			// var consecutives = this.getConsecutiveCorrect(answers);
			// if (consecutives == 0) return 0;
			// var consecutives2 = 0;
			// var maxConsecutive = 0;
			// for (var i = 0; i < answers.length - consecutives; i++) {
			// 	if (answers[i]) {
			// 		consecutives2++;
			// 		maxConsecutive = Math.max(consecutives2, maxConsecutive);
			// 	} else {
			// 		consecutives2 = 0;
			// 	}
			// }
			// if (maxConsecutive >= consecutives) return 0;
			// if (consecutives == 1) return 2;
			// if (consecutives == 2) return 4;
			// if (consecutives >= 3) return 8;
		},
		getActualNotes : function() {
			var actNotes = [];
			for (var i=0; i<this.pointsByNote.length;i++) {
				actNotes.push(this.mode(this.pointsByNote[i]));
			}
			return actNotes;
		},
		getAnswer : function(expNotes, actNotes) {
			
			if (expNotes.length != actNotes.length) {
				console.log("expNotes length", expNotes.length, " is not same as actual notes size", actNotes.length);
				return;
			}
			
			var answers = [];
			for (var i=0; i<expNotes.length; i++) {
				answers.push((expNotes[i]-expNotes[0]) - (actNotes[i]-actNotes[0]));
			}
			return answers;
			// if (this.getExerciseScore() > 0.55) {
			// 	return expValue;
			// } else {
			// 	return this.mode();
			// }
		},
		mode : function(points) {
			return _.chain(points).map(function(point){return Math.round(point)}).countBy().pairs().max(_.last).head().value();
		},
		matchRatio : function(match) {
			if (this.points.length == 0) return 0;
			var matchList = _.filter(this.points, function(num){ return num == match; });
			var result = matchList.length/this.points.length;
			return result;
		}
	};
});