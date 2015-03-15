var context = new webkitAudioContext();

var SoundBank = function() {
	this.samples = [];
	this.init = function() {
		this.loadSample('c2sharp.wav', 69.296, 37);
		this.loadSample('g2sharp.wav', 103.83, 44);
		this.loadSample('c3sharp.wav', 138.59, 49);
		this.loadSample('g3sharp.wav', 207.65, 56);
	};

	this.loadSample = function(url, freq) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		var local = this;
		request.onload = function() {
			// createBuffer(request.response);
			context.decodeAudioData(request.response, function(buffer) {
				local.samples.push({
					freq: freq,
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

	this.getNearestSample = function(freq) {
		return this.samples[0];
	};

	this.init();
};


var StringChannel = function(freq, soundbank) {
	var buffer;

	this.st = new SoundTouch();

	var nearestSample = soundbank.getNearestSample();
	buffer = nearestSample.buffer;
	this.st.pitch = freq / nearestSample.freq;
	var BUFFER_SIZE = 1024;


	var samples = new Float32Array(BUFFER_SIZE * 2);



	// this.filter = new SimpleFilter(this.source, st);



	// this.connect = function(node) {
	// 	this.node.connect(node);
	// };

	// this.disconnect = function() {
	// 	this.node.disconnect();
	// };
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
		// delete this.node;


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

var Tanpura = function() {
	this.key = 1;
	this.tuning = 7;

	this.samples = [];
	this.loadSamples = function() {

	};

	this.mixerNode = context.createGain();

	this.play = function() {
		this.mixerNode.connect(context.destination);
	};

	this.pause = function() {
		this.mixerNode.disconnect();
	};



	this.soundbank = new SoundBank();
	var local = this;
	this.strings = [];
	this.soundbank.oninit = function() {
		local.strings[0] = new StringChannel(120, local.soundbank);
		local.strings[1] = new StringChannel(180, local.soundbank);
		local.strings[2] = new StringChannel(180, local.soundbank);
		local.strings[3] = new StringChannel(90, local.soundbank);



		var j = 0;
		setInterval(function() {
			local.strings[j % 4].pluck(local.mixerNode);
			j++;
		}, 1000);

		// for(var i=0;i<local.strings.length;i++) {
		// 	local.strings[i].connect(local.mixerNode);
		// }

	};
};

var tanpura = new Tanpura();
tanpura.play();