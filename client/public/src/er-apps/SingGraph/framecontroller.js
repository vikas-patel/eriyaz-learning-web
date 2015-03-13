define([], function() {

	var Controller = function() {
	};

	Controller.prototype.getExercisePart = function (exercise, partNumber, maxNotes) {
		var sequences = exercise.notes;
		var subSequences = [];
		for (i = partNumber*maxNotes; i < (partNumber+1)*maxNotes && i < sequences.length; i++) {
			subSequences.push(sequences[i]);
		}
		return subSequences;
	};

	return {
        getController: function() {
			return new Controller();
        }
    };
});