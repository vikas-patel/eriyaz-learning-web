define(['d3'], function(d3) {
	var Display = function(noteDuration) {

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
		var nYDivs = 13;

		var xScale = d3.scale.linear()
			.domain([0, 8])
			.range([0, chartWidth]);

		//var noteDuration = 500;
		var timeScale = d3.scale.linear()
			.domain([0, noteDuration])
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
			svg.selectAll("text.noteLabel").remove();

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

			svg.selectAll("text.noteLabel")
				.data(ansData)
				.enter().append("text")
				.attr("x", function(d, i) {
					return xScale(i);
				})
				.attr("class", "noteLabel")
				.attr("y", function(d) {
					return yScale(d + 1);
				})
				.attr("height", chartHeight / 13)
				.attr("width", chartWidth / 8)
				.text(function(d) {
					return labelsData[d];
				});

		};

		this.reset = function() {
			// svg.selectAll("rect.ans").remove();
			this.clear();
			notesData = [];
		};



		var pointGroup = svg.append("g");
		this.markPitch = function(interval, time) {
			pointGroup.append("rect")
				.attr("x", timeScale(time))
				.attr("y", yScale(interval) - chartHeight / (2 * nYDivs))
				//.attr("y", yScale(currCents) - height / 19 / 2)
				.attr("width", 2)
				.attr("height", 2);
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
			this.clearPoints();
			this.clearFlash();
			svg.selectAll("rect.ans").remove();
			svg.selectAll("text.noteLabel").remove();
			svg.selectAll(".playRect").remove();
		};

		this.clearPoints = function() {
			if (pointGroup)
				pointGroup.remove();
			pointGroup = svg.append("g");

			if (pointGroup2)
				pointGroup2.remove();
			pointGroup2 = svg.append("g");

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

		var testVar = 34;
		this.setNoteDuration = function(noteDuration) {
			timeScale = d3.scale.linear()
				.domain([0, noteDuration])
				.range([0, chartWidth / 8]);
		};


		var pointGroup2;
		this.plotData = function(data) {
			pointGroup2 = svg.append("g");
			pointGroup2.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return timeScale(i * 128 / 48);
				}).attr("y", function(d) {
					return yScale(d);
				}).attr("width", 1)
				.attr("height", 1);
			// console.log(data);
			// console.log(data.length);
		};

	};

	return Display;
});