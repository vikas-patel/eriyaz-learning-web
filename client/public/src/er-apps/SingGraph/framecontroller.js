define([], function() {

	var Controller = function(exerciseChart, $scope) {
		this.currentNoteIndex = 0;
		this.maxNotes = 5;
		this.chart = exerciseChart;
		this.$scope = $scope;
	};

	Controller.prototype.setExercise = function(exercise) {
		this.exercise = exercise;
		this.currentNoteIndex = 0;
		this.partNumber = 0;
		this.drawExercise();
	};

	Controller.prototype.drawExercise = function() {
		var sequences = this.getExercisePart(this.partNumber++, this.maxNotes);
		var control = this;
		this.chart.setExercise(sequences);
		this.$scope.$on('chartOver',function() {
			if (control.partNumber*control.maxNotes < control.exercise.sequence.length) {
				control.chart.setExercise(control.getExercisePart(control.partNumber++, control.maxNotes));
			} else {
				control.$scope.$broadcast('exerciseOver');
			}
      	});
	};

	Controller.prototype.reset = function() {
		this.currentNoteIndex = 0;
		// Stop: Delete html view still triggers transition onEnd event.
		this.chart.pauseIndicatorLine();
		this.drawExercise();
	}

	Controller.prototype.getExercisePart = function (partNumber, maxNotes) {
		var sequences = this.exercise.sequence;
		var subSequences = [];
		for (i = partNumber*maxNotes; i < (partNumber+1)*maxNotes && i < sequences.length; i++) {
			subSequences.push(sequences[i]);
		}
		return subSequences;
	};

	return {
        getController: function(exerciseChart, $scope) {
			return new Controller(exerciseChart, $scope);
        }
    };
});