/* Chunk stream data into a buffered frame and process these frames.*/
define([], function() {
	var instance;
 
    function createInstance() {
        audioContext = window.AudioContext || window.webkitAudioContext;
		contextObj = new audioContext();
        return contextObj;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
});