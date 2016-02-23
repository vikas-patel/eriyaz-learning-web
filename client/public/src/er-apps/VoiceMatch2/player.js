define([], function() {
	var Player = function(refNote, notes, type) {
		// midi audio map
		this.audioMap = {};
		var audioPath;
		var imgExn;
		if (type == 'female') {
			audioPath = "er-shell/audio/female/";
			imgExn = ".m4a";
		} else {
			audioPath = "er-shell/audio/male/"; 
			imgExn = ".mp3";
		}

		for (var i = 0; i< notes.length; i++) {
			var midi = refNote + notes[i];
			this.audioMap[notes[i]] = new Audio(audioPath + midi + imgExn);
		}
	};

	Player.prototype.play = function(note, callbackFn, duration) {
		var currentAudio = this.audioMap[note];
		if (duration) currentAudio.currentTime = 1.0;
		currentAudio.play();
		currentAudio.onended = callbackFn;
		if (duration) {
			setTimeout(function(){console.log(currentAudio.currentTime); currentAudio.pause(); currentAudio.currentTime = 0; callbackFn();}, duration);
		}
	};

	return Player;
});