define([],function() {
	var Melody = function(notes) {
		this.notes = [];

		if(notes) {
			this.notes = this.notes.concat(notes);
		}
		
		this.addNote = function(note) {
			this.notes.push(note);
		};

		this.play = function(player) {
			player.playMelody(this);
		};
	};

	return Melody;
});