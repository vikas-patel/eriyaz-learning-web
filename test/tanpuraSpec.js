define(['tanpura'], function(Tanpura) {
	describe("Tanpura", function() {
		var tanpura;
		beforeEach(function() {
			tanpura = new Tanpura(48,7);
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});
		it("can be played", function(done) {
			tanpura.play();
			setTimeout(function() {
				tanpura.stop();
				expect(true).toBe(true);
				done();
			}, 5000);
		});
		it("can be tuned", function(done) {
			tanpura.setTuning(50,7);
			tanpura.play();
			setTimeout(function() {
				tanpura.stop();
				expect(true).toBe(true);
				done();
			}, 5000);
		});
	});
});