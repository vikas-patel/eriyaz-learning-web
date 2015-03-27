var context = new webkitAudioContext();

var SoundBank = function() {
	this.samples = [];
	this.init = function() {
		this.loadSample('c2sharp.mp3', 37);
		this.loadSample('g2sharp.mp3', 44);
		this.loadSample('c3sharp.mp3', 49);
		this.loadSample('g3sharp.mp3', 56);
	};

	this.loadSample = function(url, noteNum) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		var local = this;
		request.onload = function() {
			// createBuffer(request.response);
			context.decodeAudioData(request.response, function(buffer) {
				local.samples.push({
					noteNum: noteNum,
					buffer: buffer
				});
				if (local.samples.length == 4) {
					local.oninit();
				}
			}, function() {
				console.log('could not load audio');
			});
		};

		console.log('reading url');
		request.send();
	};

	this.getNearestSample = function(noteNum) {
		var diffs = this.samples.map(function(obj) {
			return Math.abs(noteNum-obj.noteNum);
		});
		var minIndex = diffs.indexOf(Math.min.apply(Math,diffs));
		return this.samples[minIndex];
	};

	this.init();
};


var StringChannel = function(noteNum, soundbank) {
	var buffer;

	this.st = new SoundTouch();

	var nearestSample = soundbank.getNearestSample(noteNum);
	buffer = nearestSample.buffer;
	this.st.pitch = Math.pow(2,(noteNum-nearestSample.noteNum)/12);
	var BUFFER_SIZE = 16384;


	var samples = new Float32Array(BUFFER_SIZE * 2);



	// this.filter = new SimpleFilter(this.source, st);



	// this.connect = function(node) {
	// 	this.node.connect(node);
	// };

	this.disconnect = function() {
		this.node.disconnect();
	};
	this.node = context.createScriptProcessor(BUFFER_SIZE, 2, 2);
	this.source = {
		extract: function(target, numFrames, position) {
			var l = buffer.getChannelData(0);
			// var r = buffer.getChannelData(1);
			for (var i = 0; i < numFrames; i++) {
				target[i * 2] = l[i + position];
				target[i * 2 + 1] = l[i + position];
			}
			return Math.min(numFrames, l.length - position);
		}
	};

	this.pluck = function(node) {
		var filter = new SimpleFilter(this.source, this.st);

		this.node.onaudioprocess = function(e) {
			var l = e.outputBuffer.getChannelData(0);
			var r = e.outputBuffer.getChannelData(1);
			var framesExtracted = filter.extract(samples, BUFFER_SIZE);
			if (framesExtracted === 0) {
				// pause();
			}
			for (var i = 0; i < framesExtracted; i++) {
				l[i] = samples[i * 2];
				r[i] = samples[i * 2 + 1];
			}
		};
		this.node.connect(node);
	};
};

var Tanpura = function(key,tuning) {
	this.key = key;
	this.tuning = tuning;

	this.samples = [];
	this.loadSamples = function() {

	};

	this.mixerNode = context.createGain();
	this.interval = null;
	this.play = function() {


		var j = 0;
		this.interval = setInterval(function() {
			local.strings[j % 4].pluck(local.mixerNode);
			j++;
		}, 1000);
		this.mixerNode.connect(context.destination);
		// for(var i=0;i<local.strings.length;i++) {
		// 	local.strings[i].connect(local.mixerNode);
		// }
	};

	this.pause = function() {
		// this.mixerNode.disconnect();

		clearInterval(this.interval);

		// for(var i=0;i<local.strings.length;i++) {
		// 	this.strings[i].disconnect();
		// }
	};



	this.soundbank = new SoundBank();
	var local = this;
	this.strings = [];
	this.soundbank.oninit = function() {
		local.strings[0] = new StringChannel(local.key-12+local.tuning, local.soundbank);
		local.strings[1] = new StringChannel(local.key, local.soundbank);
		local.strings[2] = new StringChannel(local.key, local.soundbank);
		local.strings[3] = new StringChannel(local.key-12, local.soundbank);
	};
};