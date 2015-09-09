define(['underscore'], function(_) {
	var SequenceGen = function() {
		var reGaOpts = [1,2,3,4];
		var dhaNiOpts = [8,9,10,11];
		this.getRandomSequence = getRandomSequence;

		function getRandomSequence() {
			var reGa = _.shuffle(reGaOpts);
			var dhaNi = _.shuffle(dhaNiOpts);
			var ma = Math.random()>0.5 ? 5 : 6;
			var that = [];
			that.push(0);
			that.push(reGa[0]);
			that.push(reGa[1]);
			that.push(ma);
			that.push(7);
			that.push(dhaNi[0]);
			that.push(dhaNi[1]);
			that.push(12);
			
			var numNotes = Math.floor(Math.random() * 5) + 3;
			var selectedNotes = _.shuffle(that).slice(0,numNotes);

			var sequence = [];
			sequence = sequence.concat(selectedNotes);

			while(sequence.length < 8) {
				sequence.push(selectedNotes[Math.floor(Math.random() * selectedNotes.length)]);
			}

			return _.shuffle(sequence);
		}
	};

	return new SequenceGen();
});