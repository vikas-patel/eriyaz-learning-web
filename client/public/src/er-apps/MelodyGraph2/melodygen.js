define(['melody','note'],function(Melody,Note) {
	var baseDuration = 1000;
	var subdivisions = [0.25,0.5,1];
	var middleC = 60;
	var scale = [-5,-3,-1,0,2,4,5,7,9,11,12];
	var MelodyGen = function() {
		this.getNewMelody = function(numNotes,rootNote) {
			var melody = new Melody();
			// var baseNote = middleC - Math.floor(Math.random() *12);
			var baseNote = rootNote;
			melody.addNote(Note.createFromMidiNum(baseNote,getRandomDuration()));

			var prevIndex = 3;
			for(var i=1;i<numNotes;i++) {
				var nextIndex = getNextIndex(prevIndex);
				melody.addNote(Note.createFromMidiNum(baseNote + scale[nextIndex],getRandomDuration()));
			}
			return melody;
		};

		function getNextIndex(prevIndex) {
			// var sign = Math.random() < 0.5 ? 1:-1;
			// var nextIndex = prevIndex + sign;
			// if(nextIndex < 0 || nextIndex >= scale.length) {
			// 	nextIndex = getNextIndex(prevIndex);
			// }
			var nextIndex = Math.floor(Math.random() * scale.length);
			return nextIndex;
		}

		function getRandomDuration() {
			return baseDuration * subdivisions[Math.floor(Math.random() * subdivisions.length)];
		}

	};

	return new MelodyGen();
});