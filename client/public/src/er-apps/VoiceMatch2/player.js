define([], function() {
	var Player = function(refNote, notes, type) {
		// midi audio map
		this.audioMap = {};
		var audioPath;
		var audioExn;
		if (type == 'female') {
			audioPath = "er-shell/audio/female/";
			audioExn = ".m4a";
		} else {
			audioPath = "er-shell/audio/male/"; 
			audioExn = ".mp3";
		}

		for (var i = 0; i< notes.length; i++) {
			var midi = refNote + notes[i];
			this.audioMap[notes[i]] = new Audio(audioPath + midi + audioExn);
		}
	};

	Player.prototype.play = function(note, callbackFn, duration) {
		var currentAudio = this.audioMap[note];
		if (duration) currentAudio.currentTime = 1.0;
		currentAudio.play();
		currentAudio.onended = callbackFn;
		if (duration) {
			setTimeout(function(){currentAudio.pause(); currentAudio.currentTime = 0; callbackFn();}, duration);
		}
	};

	return Player;
});