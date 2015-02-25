define(['note','melody'], function(Note,Melody) {
	describe("Melody", function() {
		beforeEach(function() {
			console.log = jasmine.createSpy("log");
		});

		it("can play notes in sequence", function() {
			var note1 = Note.createFromMidiNum(60);
			var note2 = Note.createFromMidiNum(62);
			var note3 = Note.createFromMidiNum(64);
			var melody = new Melody([note1,note2,note3]);
			var mockMidiPlayer = {
				playMelody: function(melody) {
					console.log(melody.notes.map(function(n){return n.midiNumber;}).join());
				}
			};
			melody.play(mockMidiPlayer);
			expect(console.log).toHaveBeenCalledWith("60,62,64");
		});
		
	});

});