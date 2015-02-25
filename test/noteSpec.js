define(['note'], function(Note) {
	describe("Note", function() {
		beforeEach(function() {
			console.log = jasmine.createSpy("log");
		});

		it("should update freq if created with midi number", function() {
			var note1 = Note.createFromMidiNum(60);
			expect(Math.floor(note1.freq)).toEqual(261);
		});


		it("should update midi number if created using freq", function() {
			var note2 = Note.createFromFreq(261.6);
			expect(note2.midiNumber).toEqual(60);
		});

		it("should have midi num undefined if freq doesn't fall into any midi bin", function() {
			var note2 = Note.createFromFreq(270);
			expect(note2.midiNumber).toBeUndefined();
		});

		it("can be played with a midi player", function() {
			var mockMidiPlayer = {
				playNote: function(note) {
					console.log("playing note " + note.midiNumber);
				}
			};
			new Note(60).play(mockMidiPlayer);
			expect(console.log).toHaveBeenCalledWith("playing note 60");
		});

		it("can be played with a freq player", function() {
			var mockFreqPlayer = {
				playNote: function(note) {
					console.log("playing freq " + Math.floor(note.freq));
				}
			};
			new Note(60).play(mockFreqPlayer);
			expect(console.log).toHaveBeenCalledWith("playing freq 261");
		});
	});

});