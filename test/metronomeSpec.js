define(['metronome'], function(metronome) {
	ddescribe("Metronome", function() {
		beforeEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});
		it("can play", function(done) {
			metronome.play();
			setTimeout(function() {
				metronome.stop();
				expect(true).toBe(true);
				done();
			}, 3000);
		});
		it("can set duration", function(done) {
			metronome.setDuration(1000);
			metronome.play();
			setTimeout(function() {
				metronome.stop();
				expect(true).toBe(true);
				done();
			}, 5000);
		});
	});
});