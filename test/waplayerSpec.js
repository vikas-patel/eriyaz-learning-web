define(['note', 'melody', 'webaudioplayer', 'midiplayer', 'midi-config', 'public/lib/MIDI/soundfont/acoustic_grand_piano-ogg'], function(Note, Melody, WebAudioPlayer, MidiPlayer) {

	describe("players", function() {
		var note1, note2, note3, note4, melody;

		beforeEach(function() {
			note1 = Note.createFromMidiNum(60, 1000);
			note2 = Note.createFromMidiNum(62, 250);
			note3 = Note.createFromMidiNum(64, 500);
			note4 = Note.createFromMidiNum(62, 250);

			melody = new Melody([note1, note2, note3, note4]);

			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		describe("WebAudioPlayer", function() {
			var player;
			beforeEach(function() {
				var WebAudioContext = window.AudioContext || window.webkitAudioContext;
				var audioContext = new WebAudioContext();
				player = new WebAudioPlayer(audioContext);
			});
			it("can play a note", function(done) {

				player.playNote(note1);
				// note1.play(player);
				setTimeout(function() {
					expect(true).toBe(true);
					done();
				}, 1100);
			});

			it("can play a melody", function(done) {

				player.playMelody(melody);
				setTimeout(function() {
					expect(true).toBe(true);
					done();
				}, 2100);
			});
		});

		ddescribe("MidiPlayer", function() {
			var soundfontUrl,instrument;
			beforeEach(function() {
				console.log = jasmine.createSpy("log");

				soundfontUrl = "../base/public/lib/MIDI/soundfont/";
				instrument = "acoustic_grand_piano";
			});

			it("should callback and return player on load", function(done) {
				var player;
				MidiPlayer.loadPlayer(soundfontUrl,instrument,function(player1) {
					player = player1;
				});
				setTimeout(function() {
					expect(player).toBeDefined();
					done();
				}, 3000);
			});
			it("can play a note", function(done) {
				var player;
				MidiPlayer.loadPlayer(soundfontUrl,instrument,function(player1) {
					player = player1;
				});

				// note1.play(player);
				setTimeout(function() {
					player.playNote(note1);
					setTimeout(function() {
						expect(true).toBe(true);
						done();
					}, 2000);
				}, 2000);
			});

			it("can play a melody", function(done) {
				var player;
				MidiPlayer.loadPlayer(soundfontUrl,instrument,function(player1) {
					player = player1;
				});

				setTimeout(function() {
					player.playMelody(melody);
					setTimeout(function() {
						expect(true).toBe(true);
						done();
					}, 2000);
				}, 2000);
			});
		});
	});

});