define(['underscore'], function(_) {
	var SequenceGen = function() {
		var reGaOpts = [1,2,3,4];
		var dhaNiOpts = [8,9,10,11];

		var poorvangas = [
			[0,2,4,5],
			[0,2,3,5],
			[0,1,3,5],
			[0,1,4,5]
		];
		this.getRandomSequence = getRandomSequence;
		this.getPoorvanga = getPoorvanga;
		this.getPoorvangaShuffled = getPoorvangaShuffled;
		this.getPoorvangaReversed = getPoorvangaReversed;

		function getRandomSequence(numNotes) {
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
			
			return  _.shuffle(that).slice(0,numNotes);

		}

		function getPoorvanga() {
			return poorvangas[Math.floor(Math.random()*poorvangas.length)];
		}

		function getPoorvangaShuffled() {
			return _.shuffle(this.getPoorvanga());
		}

		function getPoorvangaReversed() {
			var sequence = this.getPoorvanga();
			return sequence.reverse();
		}
	};

	return new SequenceGen();
});