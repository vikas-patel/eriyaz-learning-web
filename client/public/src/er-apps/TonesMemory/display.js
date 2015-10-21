define(['d3'], function(d3) {
	var Display = function() {

		var margin = {
			top: 15,
			right: 10,
			bottom: 10,
			left: 15
		};

		var chartWidth = 300,
			chartHeight = 200;


		var refreshTime = 40;


		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];


		var yScale = d3.scale.linear()
			.domain([0, 13])
			.range([chartHeight, 0]);

		var xScale = d3.scale.linear()
			.domain([0, 8])
			.range([0, chartWidth]);

		var timeScale = d3.scale.linear()
			.domain([0, 1000])
			.range([0, chartWidth / 8]);

		var svg = d3.select("#display").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (chartWidth + margin.left + margin.right) + " " + (chartHeight + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.selectAll("rect.slot")
			.data(slotsData)
			.enter().append("rect")
			.attr("x", 0)
			.attr("class", "slot")
			.attr("y", function(d) {
				return yScale(d + 1);
			})
			.attr("height", chartHeight / 13)
			.attr("width", chartWidth)
			.attr("fill", function(d, i) {
				if (i === 0 || i === 7 || i === 12) {
					return "green";
				} else if (i === 5 || i == 6) {
					return "blue";
				} else {
					return "red";
				}
			})
			.attr("fill-opacity", 0.5);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top")
			.innerTickSize([chartHeight])
			.outerTickSize([chartHeight])
			.ticks(8)
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);



		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chartHeight + ")")
			.call(xAxis);



		var notesData = [];


		this.getNotes = function() {
			return notesData;
		};

		this.showNotes = function(ansData) {
			svg.selectAll("rect.ans").remove();

			svg.selectAll("rect.ans")
				.data(ansData)
				.enter().append("rect")
				.attr("x", function(d, i) {
					return xScale(i);
				})
				.attr("class", "ans")
				.attr("y", function(d) {
					return yScale(d + 1);
				})
				.attr("height", chartHeight / 13)
				.attr("width", chartWidth / 8)
				.attr("fill", "white")
				.attr("fill-opacity", 1);

		};

		this.reset = function() {
			// svg.selectAll("rect.ans").remove();
			this.clear();
			notesData = [];
		};


		var displayTimeRange = 1000;
		var currCents = 0;
		var isPendingValue = false;
		var pointGroup;
		var clip;
		var tickCount = 0;
		var points = [];
		var currActiveNote;
		var staticGroup = svg.append("g").attr("clip-path", "url(#clip)");
		clip = svg.append("defs").append("svg:clipPath")
				.attr("id", "clip")
				.append("svg:rect")
				.attr("id", "clip-rect")
				.attr("x", 0)
				.attr("y", "0")
				.attr("width", chartWidth / 8)
				.attr("height", chartHeight);

		this.tick = function() {
			tickCount++;
			if (tickCount * refreshTime > displayTimeRange) {

				pointGroup
					.transition()
					.duration(refreshTime)
					.ease("linear")
					.attr("transform", "translate(" + (timeScale(displayTimeRange - tickCount * refreshTime)) + ",0)");
				if (isPendingValue && points.length > Math.round(displayTimeRange / refreshTime)) {
					var oldestPoint = points.shift();
					oldestPoint.remove();
				}
			}
			if (isPendingValue) {
				console.log(currCents)
				var newPoint = pointGroup.append("rect")
					.attr("x", xScale(currActiveNote) + timeScale(tickCount * refreshTime))
					.attr("y", yScale(currCents / 100) - chartHeight / 26)
					//.attr("y", yScale(currCents) - height / 19 / 2)
					.attr("width", 2)
					.attr("height", 2);
				points.push(newPoint);
				isPendingValue = false;

			}
		};

		var tickId;

		this.start = function(numNote) {
			currActiveNote = numNote;
			
			pointGroup = staticGroup.append("g");
			clip.attr("transform", "translate(" + xScale(numNote)+",0)");

			
			var local = this;
			if (tickId) clearInterval(tickId);
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
				.attr("x", xScale(currActiveNote) + timeScale(tickCount * refreshTime))
				.attr("y", yScale(interval) - chartHeight / 13)
				.attr("height", chartHeight / 13)
				// .attr("y", yScale(interval * 100))
				.attr("width", 5)
				// .attr("height", 20)
				.attr("fill", "green")
				.attr("opacity", 0.5);
		};

		this.notifyAggStable = function(interval) {
			//do not delete this function.
		};

		this.notifyInterval = function(newValue) {
			currCents = newValue * 100;
			isPendingValue = true;
		};


		this.setFlash = function(message) {
			this.clearFlash();
			svg.append("text")
				.attr("id", "flash")
				.attr("font-size", 25)
				.attr("x", chartWidth / 2)
				.attr("y", 0)
				.attr("fill", "#F16236")
				.attr("text-anchor", "middle")
				.text(message);
		};

		this.clearFlash = function() {
			var flash = svg.select("#flash");
			if (flash)
				flash.remove();
		};

		// this.clearFlash();

		this.clear = function() {
			if (pointGroup)
				pointGroup.remove();
			this.clearFlash();
			svg.selectAll("rect.ans").remove();
			svg.selectAll(".playRect").remove();
		};

		this.clearPoints = function() {
			if (pointGroup)
				pointGroup.remove();
		};

		this.playAnimate = function(interval, duration, noteNum) {
			notesData.push(interval);
			var color = "#FFCCCC";

			var playRect = svg.append("rect")
				.attr("class", "playRect")
				.attr("x", xScale(noteNum))
				.attr("y", yScale(interval) - chartHeight / 13)
				.attr("height", chartHeight / 13 - 1)
				.attr("width", 0)
				.style("fill", color);
			//.attr("opacity", 0.5);

			playRect
				.transition()
				.duration(duration)
				.attr("width", chartWidth / 8);

		};


	};

	return Display;
});