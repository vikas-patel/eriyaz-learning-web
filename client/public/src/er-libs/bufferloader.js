define([],function() {
	function BufferLoader(context, urlMap, callback) {
		this.context = context;
	    this.urlMap = urlMap;
	    this.onload = callback;
	    this.bufferMap = new Map();
	    this.loadCount = 0;
	}

	BufferLoader.prototype.loadBuffer = function(url, key) {
	    var request = new XMLHttpRequest();
	    request.open("GET", url, true);
	    request.responseType = "arraybuffer";

	    var loader = this;

	    request.onload = function() {

	        loader.context.decodeAudioData(
	            request.response,
	            function(buffer) {
	                if (!buffer) {
	                    alert('error decoding file data: ' + url);
	                    return;
	                }
	                loader.bufferMap.set(key, buffer);
	                if (++loader.loadCount == loader.urlMap.size)
	                    loader.onload(loader.bufferMap);
	            }    
	        );
	    }

	    request.onerror = function() {
	        alert('BufferLoader: XHR error');        
	    }

	    request.send();
	}

	BufferLoader.prototype.load = function() {
		var loader = this;
		this.urlMap.forEach(function(value, key) {loader.loadBuffer(value, key);});
	}

	return BufferLoader;
});