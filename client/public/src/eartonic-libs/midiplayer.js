define(['midi-config'], function(Midi) {
	var MidiPlayer = function() {
		this.playNote = function(note) {
			Midi.noteOn(0, note.midiNumber, 127, 0);
			setTimeout(function() {
				Midi.noteOff(0, note.midiNumber, 0);
			}, note.duration);
		};

		this.playMelody = function(melody) {
			var delay = 0;
			for (var i = 0; i < melody.notes.length; i++) {
				(function(index) {
					setTimeout(function() {
						Midi.noteOn(0,melody.notes[index].midiNumber,127,0);
					}, delay);
					setTimeout(function() {
						Midi.noteOff(0,melody.notes[index].midiNumber,0);
					}, delay + melody.notes[index].duration);
				})(i);
				delay += melody.notes[i].duration;
			}
		};
	};

	MidiPlayer.loadPlayer = function(soundfontUrl1,instrument1,callback1) {
		Midi.loadPlugin({
			soundfontUrl: soundfontUrl1,
			instrument: instrument1,
			callback: function() {
				callback1(new MidiPlayer());
			}
		});

	};

	return MidiPlayer;
});