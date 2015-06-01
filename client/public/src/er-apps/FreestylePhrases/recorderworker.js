define(['pitchdetector', 'music-calc'], function(PitchDetector, MusicCalc) {
	// Build a worker from an anonymous function body
	var blobURL = URL.createObjectURL(new Blob(['(',

		function() {

					var buffArray = [];
					self.onmessage = function(e) {
						switch (e.data.command) {
							case 'record':
								record(e.data.floatarray);
								break;
							case 'concat':
								concatBuffers();
								break;
							case 'clear':
								clear();
								break;
						}
					};


					function record(floatarray) {
						buffArray.push(floatarray);
					}

					function concatBuffers() {
						var concatenatedArray = new Float32Array(buffArray.length * buffArray[0].length);
						var offset = 0;
						for (var j = 0; j < buffArray.length; j++) {
							(function(buffer) {
								concatenatedArray.set(buffer, offset);
							})(buffArray[j]);
							offset += buffArray[j].length;
						}
						self.postMessage({
							command: 'concat',
							floatarray: concatenatedArray
						});
					}

					
					function clear() {
						buffArray = [];
					}

		}.toString(),

		')()'
	], {
		type: 'application/javascript'
	}));

	var recorderWorker = new Worker(blobURL);

	// Won't be needing this anymore
	URL.revokeObjectURL(blobURL);

	return recorderWorker;
});