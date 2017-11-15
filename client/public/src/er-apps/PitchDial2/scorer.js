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
		},
		getActualNotes : function() {
			var actNotes = [];
			for (var i=0; i<this.pointsByNote.length;i++) {
				var mode = this.mode(this.pointsByNote[i]);
				if (mode == 12) mode = 0;
				console.log(mode);
				actNotes.push(mode);
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