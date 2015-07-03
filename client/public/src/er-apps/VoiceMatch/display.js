define([], function() {

	var Chart = function(displayTimeRange) {
		var margin = {
			top: 10,
			right: 30,
			bottom: 10,
			left: 30
		};

		var width = 480;
		var height = 600;
		var labels = ['kali#3','safed#5', 'kali#4', 'safed#6', 'kali#5', 'safed#7', 'safed#1', 'kali#1', 'safed#2', 
				'kali#2', 'safed#3', 'safed#4', 'kali#3', 'safed#5', 'kali#4', 'safed#6', 'kali#5', 'safed#7', 'safed#1'];
		var refreshTime = 40;
	  	this.generateKeys = function() {
			var steps = ["C", "D", "E", "F", "G", "A", "B"];
			var octaves = [2, 3, 4];
			var invalidNotes = ["2C", "2C#", "2D", "2D#", "2E", "2E#"];
			var position = 0;
			var keys = [];
			var midi = 41;
			octaves.forEach(function(octave) {
				steps.forEach(function(step) {
		          var whiteKey = {octave:octave, position:position, step:step, note:octave+step, white:true, midi:midi};
		          if (invalidNotes.indexOf(whiteKey.note) > -1) {
		          		return true;
		          }
		          keys.push(whiteKey);
		          if (step != "E" && step != "B") {
		        		midi++;midi++;
		        	} else {
		        		midi++;
		        	}
		          position += 2;
		        });
		    });
		    position = 0.8;
		    midi = 42;
		    octaves.forEach(function(octave) {
		        steps.forEach(function(step) {
		        	var blackKey = {octave:octave, position:position, step:step, note:octave+step+'#', white:false, midi:midi};
	        		if (invalidNotes.indexOf(blackKey.note) > -1) {
			          	return true;
			          }
		        	if (step != "E" && step != "B") {
		        		keys.push(blackKey);
		        		midi++;midi++;
		        	} else {
		        		midi++;
		        	}
		          	position += 2;
		        });
		    });
	        return keys;
		};
		
		var x = d3.time.scale()
			.domain([0, displayTimeRange])
			.range([0, width]);
		var keys = this.generateKeys();
		var whiteKeys = _.filter(keys, function(key){ return key.white; });
		var keyWidth = width;
		var keyHeight = height/(whiteKeys.length + 3);
		var keyHeightRatio = 0.7;
	  	var keyWidthRatio = 0.6;
		var y = d3.scale.linear()
			//.domain([-500, 1300])
			.domain([0, 2 + d3.max(keys, function(key){return key.position})])
			.range([height - keyHeight, 0]);
		var noteScale = d3.scale.linear().domain([41, 47, 48, 49,  51, 52, 58, 59, 63, 64, 70])
										 .range([0, 6, 8, 9, 11, 13, 19, 21, 25, 27, 33]); 
		
		this.drawRectNotes = function() {
			this.svg.selectAll("rect")
					    .data(keys).enter()
					    .append("rect")
					    .attr("id", function(d) {return "midi-"+d.midi})
					    .attr("class", function(d) {
					     	return "key key--" + (d.white ?  "white" : "black");
					 	})
					    .attr("x", 0)
					    .attr("y", function(d) {
					    	return y(d.position) - keyHeight;
					    })
					    .attr("rx", 5)
					    .attr("ry", 5)
					    .attr("width", function(d) {
					    	return d.white ? keyWidth : keyWidth * keyWidthRatio;
					    })
					    .attr("height", function(d) {
					    	return d.white ? keyHeight : keyHeight * keyHeightRatio;
					    });
					    
			this.svg.selectAll("text")
					.data(keys).enter()
					.append("text")
				    .attr("x", -margin.left/4)
				    .attr("y", function(d) {return y(Math.round(d.position)) - keyHeight/2;})
				    .attr("font-size", "0.8em")
				    .style("text-anchor", "end")
				    .attr("dy", ".35em")
				    .text(function(d) { return d.note });
		};

		this.draw = function(noteOptions, rootNote) {
			if (this.svg) $('#chartdiv').html("");
			// this.noteOptions = noteOptions;
			// this.rootNote = rootNote;
			this.svg = this.createRootElement();
			this.drawRectNotes();
			var defs = this.svg.append("defs")
			defs.append("marker")
					.attr({
						"id":"arrow",
						"viewBox":"0 -5 10 10",
						"refX":5,
						"refY":0,
						"markerWidth":4,
						"markerHeight":4,
						"orient":"auto"
					})
					.append("path")
						.attr("d", "M0,-5L10,0L0,5")
						.attr("class","arrowHead");
			// this.drawArrowHead();
		}

		this.drawLevel = function(level, rootNote) {
			if (!this.svg) return;
			this.svg.selectAll("line.arrow").remove();
			this.svg.selectAll("text.level").remove();
			var max = rootNote + _.max(level.notes);
			var min = rootNote + _.min(level.notes);
			var maxNoteElm = d3.select("rect#midi-"+max);
			var minNoteElm = d3.select("rect#midi-"+min);
			var maxH = Number(maxNoteElm.attr("y"));
			var minH = Number(minNoteElm.attr("y")) + Number(minNoteElm.attr("height"));
			var midH = (maxH + minH)/2;
			this.svg.append('line')
				.attr({
					"class":"arrow",
					"marker-end":"url(#arrow)",
					"x1":width + margin.right/2,
					"y1":midH + 25,
					"x2":width + margin.right/2,
					"y2":minH
				});
			this.svg.append('line')
				.attr({
					"class":"arrow",
					"marker-end":"url(#arrow)",
					"x1":width + margin.right/2,
					"y1":midH - 35,
					"x2":width + margin.right/2,
					"y2":maxH
				});
			this.svg.append("text")
				.attr("x", width + margin.right/2)
				.attr("y", midH)
				.attr("class", "level")
				.attr("font-size", "1.1em")
				.style("text-anchor", "middle")
				.style("writing-mode", "tb")
				//.style("letter-spacing", 2)
				.text(level.name);

		}

		this.createRootElement = function() {
			return d3.select("#chartdiv").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		}
		var notesData = [-5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12];

		var currCents = 0;
		var isPendingValue = false;
		var pointGroup;
		var tickCount = 0;
		var points = [];
		this.tick = function() {
			tickCount++;
			if (tickCount * refreshTime > displayTimeRange) {

				pointGroup
					.transition()
					.duration(refreshTime)
					.ease("linear")
					.attr("transform", "translate(" + x(displayTimeRange - tickCount * refreshTime) + ",0)");
				if (isPendingValue && points.length > Math.round(displayTimeRange / refreshTime)) {
					var oldestPoint = points.shift();
					oldestPoint.remove();
				}
			}
			if (isPendingValue) {
				var newPoint = pointGroup.append("rect")
					.attr("x", x(tickCount * refreshTime))
					.attr("y", y(noteScale(currCents/100)) - keyHeight/2)
					//.attr("y", y(currCents) - height / 19 / 2)
					.attr("width", 5)
					.attr("height", 5);
				points.push(newPoint);
				isPendingValue = false;

			}
		};

		var tickId;

		this.start = function() {
			pointGroup = this.svg.append("g");
			var local = this;
			tickId = setInterval(function() {
				local.tick();
			}, refreshTime);
		};

		this.stop = function() {
			clearInterval(tickId);
			tickCount = 0;
		};

		this.notifyUnitStable = function(interval) {
			pointGroup.append("rect")
				.attr("x", x(tickCount * refreshTime))
				.attr("y", y(noteScale(interval)) - keyHeight)
				.attr("height", keyHeight)
				// .attr("y", y(interval * 100))
				.attr("width", 5)
				// .attr("height", 20)
				.attr("fill", "green")
				.attr("opacity", 0.5);
		};

		this.notifyAggStable = function(interval) {
			// svg.append("text")
			// 	.attr("x", width / 2)
			// 	.attr("y", height / 2)
			// 	.attr("font-size", 15)
			// 	.text("Stable Pitch Detected!");
		};
		this.notifyInterval = function(newValue) {
			currCents = newValue * 100;
			isPendingValue = true;
		};


		this.setFlash = function(message) {
			this.clearFlash();
			this.svg.append("text")
				.attr("id", "flash")
				.attr("font-size", 25)
				.attr("x", width / 2)
				.attr("y", height * .4)
				.attr("fill", "#F16236")
				.attr("text-anchor", "middle")
				.text(message);
		};

		this.clearFlash = function() {
			var flash = this.svg.select("#flash");
			if (flash)
				flash.remove();
		};

		// this.clearFlash();

		this.clear = function() {
			if (pointGroup)
				pointGroup.remove();
			this.clearFlash();
			this.svg.selectAll(".playRect").remove();
		};

		this.playAnimate = function(interval, duration) {
			var playRect = this.svg.append("rect")
				.attr("class", "playRect")
				.attr("x", 0)
				// .attr("y", y(interval) - height / 19)
				.attr("y", y(noteScale(interval)) - keyHeight)
				.attr("height", keyHeight)
				.attr("width", 0)
				.attr("opacity", 0.2);

			playRect
				.transition()
				.duration(duration)
				.attr("width", width);
		};

	};
	return Chart;

});