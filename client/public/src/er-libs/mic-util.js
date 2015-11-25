define([], function() {
	return {
		getMicAudioStream: function(callback) {
			var dictionary = {
				audio:true	
			};
			var error = function(err) {
				 alert('Problem with mic input. Try reloading.');
				 console.log(err);
			};
			try {
				navigator.getUserMedia =
					navigator.getUserMedia ||
					navigator.webkitGetUserMedia ||
					navigator.mozGetUserMedia;
				navigator.getUserMedia(dictionary, callback, error);
			} catch (e) {
				alert('getUserMedia threw exception :' + e);
			}
		}
	};
});