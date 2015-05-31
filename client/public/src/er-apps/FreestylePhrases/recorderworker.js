define(['pitchdetector', 'music-calc'], function(PitchDetector, MusicCalc) {
	var a = 5;
	console.log(PitchDetector.toString());
	// Build a worker from an anonymous function body
	var blobURL = URL.createObjectURL(new Blob(['(',

		function() {
			// importScripts('http://localhost:3000/ext-libs/require.js', 'http://localhost:3000/require-config.js');

			// require(
			// 	// {
			// 	//      baseUrl: "localhost:3000"
			// 	//  },
			// 	["require", "pitchdetector", "music-calc"],
			// 	function(PitchDetector, MusicCalc) {
					// console.log('here');
					// console.log(a);
					// console.log(MusicCalc);
					// console.log(PitchDetector);

					// var pitchDetector = PitchDetector.getDetector('fft', audioContext.sampleRate);

					var buffArray = [];
					self.onmessage = function(e) {
						switch (e.data.command) {
							case 'record':
								record(e.data.floatarray);
								break;
							case 'concat':
								concatBuffers();
								break;
							case 'computepitch':
								computePitch(e.data.rootFreq);
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
						var concatenatedArray = new Float32Array(buffArray.length * 8192);
						var offset = 0;
						for (var j = 0; j < buffArray.length; j++) {
							(function(buffer) {
								concatenatedArray.set(buffer, offset);
								// console.log(buffer);
							})(buffArray[j]);
							offset += buffArray[j].length;
						}
						self.postMessage({
							command: 'concat',
							floatarray: concatenatedArray
						});
					}

					function computePitch(rootFreq) {
						var pitchArray = [];
						for (var j = 0; j < buffArray.length - 8; j++) {
							(function(idxj) {
								// console.log(idxj);
								var combBuffer = new Float32Array(2048);
								for (var i = 0; i < 8; i++) {
									(function(idxi) {
										combBuffer.set(buffArray[idxj + idxi], idxi * 256);
									})(i);
									// combBuffer.set(buffArray[j + i], i * 256);
								}
								// console.log(combBuffer);
								var pitch = pitchDetector.findPitch(combBuffer);
								if (pitch !== 0) {
									var currentInterval = MusicCalc.getCents(rootFreq, pitch) / 100;
								}
								pitchArray.push(currentInterval);
							})(j);
						}
						self.postMessage({
							command: 'computepitch',
							pitchData: pitchArray
						});
					}

					function clear() {
						buffArray = [];
					}
				// });

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