define(['tanpura'], function(Tanpura) {
	describe("Tanpura", function() {
		var tanpura;
		beforeEach(function() {
			tanpura = Tanpura.getInstance(48, 7); //root:48,firstString:7(Pa)
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
			tanpura.setTuning(50, 7);
			tanpura.play();
			setTimeout(function() {
				tanpura.stop();
				expect(true).toBe(true);
				done();
			}, 5000);
		});
		it("can handle multiple play calls", function(done) {
			tanpura.play();
			setInterval(function() {
				tanpura.play();
			}, 1000);
			setTimeout(function() {
				tanpura.stop();
				expect(true).toBe(true);
				done();
			}, 7000);
		});
		it("can handle tuning in middle of playing", function(done) {
			tanpura.play();
			setTimeout(function() {
				tanpura.setTuning(50, 7);
			}, 1000);
			setTimeout(function() {
				tanpura.stop();
				expect(true).toBe(true);
				done();
			}, 7000);
		});
	});
});