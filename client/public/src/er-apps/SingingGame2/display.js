define(['d3', './scorer'], function(d3, scorer) {
	var Display = function() {

		var margin = {
			top: 15,
			right: 10,
			bottom: 10,
			left: 15
		};

		var chartWidth = 300,
			chartHeight = 300;


		var refreshTime = 40;


		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];

		var yMin = -5;
		var yMax = 18;
		var nYDivs = yMax - yMin;
		var yScale = d3.scale.linear()
			.domain([yMin, yMax])
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

			svg.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",chartWidth)
			.attr("height",chartHeight)
			.attr("fill","lightgrey");

		

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

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("right")
			.innerTickSize([chartWidth])
			.outerTickSize([chartWidth])
			.ticks(nYDivs)
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chartHeight + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			// .attr("transform", "translate(0," + chartWidth + ")")
			.call(yAxis);

		var notesData = [];



		this.loadExercise = function(excData, offset) {
			svg.selectAll("rect.exc").remove();

			svg.selectAll("rect.exc")
				.data(excData)
				.enter().append("rect")
				.attr("x", function(d, i) {
					return xScale(i) + timeScale(offset);
				})
				.attr("class", "exc")
				.attr("y", function(d) {
					return yScale(d + 1);
				})
				.attr("height", chartHeight / nYDivs)
				.attr("width", chartWidth / 8)
				.attr("fill", "white")
				.attr("fill-opacity", 1);

		};

		this.drawRange = function(interval, count, offset, isSing) {
			svg.selectAll("rect.range").remove();

			svg.append("rect")
				.attr("x", xScale(0) + timeScale(offset))
				.attr("class", "range")
				.attr("y", yScale(interval) - chartHeight/nYDivs)
				.attr('stroke', function(){if(isSing) return 'green'; else return '#777'})
			  	.attr('stroke-width',1)
				.attr("height", chartHeight*(interval + 1) / nYDivs)
				.attr("width", count*chartWidth / 8)
				.attr("fill", "none")
				.attr("fill-opacity", 1);

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

		this.markAnswer = function(interval, time, isCorrect, offset) {
			var type = "circle";
			var symbol;
			if (isCorrect) {
				symbol = "✔";
			} else {
				symbol = "✖";
			}
			var cy = yScale(interval) - chartHeight / (2 * nYDivs);
			var cx = timeScale(time) + timeScale(offset);
			svg.append("path")
		      .attr("class", "point")
		      .attr('fill',function(){ if (isCorrect) return "green"; else return "#c82736" })
		      .attr('stroke','#000')
			  .attr('stroke-width',0.5)
		      .attr("d", d3.svg.symbol().type(type).size(90))
		      .attr("transform", function() { return "translate(" + cx + "," + cy + ")"; });

	    	svg.append("text")
			.attr("text-anchor", "middle")
			.attr("class", "check")
			.attr("x", cx)
			.attr("y", yScale(interval))
			.attr("fill", "white")
			.attr("font-size", 12)
			.text(symbol);
		};

		this.markPitchFeedback = function(interval, time, status) {
			pointGroup.append("rect")
				.attr("x", timeScale(time))
				.attr("y", yScale(interval) - chartHeight / nYDivs)
				.attr("height", chartHeight / nYDivs)
				// .attr("y", yScale(interval * 100))
				.attr("width", 5)
				// .attr("height", 20)
				.attr("fill", function() {
					if (status === scorer.statuses.SPOT_ON)
						return "green";
					else if (status === scorer.statuses.NEAR_MISS)
						return "yellow";
					else return "red";
				})
				.attr("opacity", 0.5);
		};

		this.clearPitchMarkers = function() {
			pointGroup.remove();
			pointGroup = svg.append("g");
		};

		this.clearPlayMarkers = function() {
			svg.selectAll("rect.playRect").remove();
		};

		this.clearAnswerMarkers = function() {
			svg.selectAll("path.point").remove();
			svg.selectAll("text.check").remove();
		};

		this.clearExercise = function() {
			svg.selectAll("rect.exc").remove();
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

		this.clear = function() {
			if (pointGroup)
				pointGroup.remove();
			this.clearFlash();
			svg.selectAll("rect.ans").remove();
			svg.selectAll(".playRect").remove();
			svg.selectAll("path.point").remove();
			svg.selectAll("text.check").remove();
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
				.attr("y", yScale(interval) - chartHeight / nYDivs)
				.attr("height", chartHeight / nYDivs - 1)
				.attr("width", 0)
				.style("fill", color);
			//.attr("opacity", 0.5);

			playRect
				.transition()
				.duration(duration)
				.attr("width", chartWidth / 8);

		};

		this.traversePosition = function(interval, duration, noteNum, offset) {
			var color = "#FFCCCC";

			var playRect = svg.append("rect")
				.attr("class", "playRect")
				.attr("x", xScale(noteNum) + timeScale(offset))
				.attr("y", yScale(interval) - chartHeight/nYDivs)
				.attr("height", chartHeight*(interval+1) / nYDivs - 1)
				.attr("width", 3)
				.style("fill", color);
			//.attr("opacity", 0.5);

			playRect
				.transition()
				.ease("linear")
				.duration(duration)
				.attr("x", xScale(noteNum+1) + timeScale(offset));

		};


	};

	return Display;
});