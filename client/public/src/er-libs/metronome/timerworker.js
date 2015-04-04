define([], function() {

	// Build a worker from an anonymous function body
	var blobURL = URL.createObjectURL(new Blob(['(',

			function() {
				var timerID = null;
				var interval = 100;

				self.onmessage = function(e) {
					if (e.data == "start") {
						console.log("starting");
						timerID = setInterval(function() {
							postMessage("tick");
						}, interval);
					} else if (e.data.interval) {
						console.log("setting interval");
						interval = e.data.interval;
						console.log("interval=" + interval);
						if (timerID) {
							clearInterval(timerID);
							timerID = setInterval(function() {
								postMessage("tick");
							}, interval);
						}
					} else if (e.data == "stop") {
						console.log("stopping");
						clearInterval(timerID);
						timerID = null;
					}
				};
			}.toString(),

			')()'
		], {
			type: 'application/javascript'
		})),

		timerWorker = new Worker(blobURL);

	// Won't be needing this anymore
	URL.revokeObjectURL(blobURL);

	return timerWorker;
});