define(['d3'], function(d3) {
	var Display = function() {
		var getIntegerArray = function(start, end) {
			var arr = [];
			var j = start;
			while (j <= end) {
				arr.push(j);
				j++;
			}
			return arr;
		};

		var margin = {
			top: 10,
			right: 5,
			bottom: 10,
			left: 5
		};

		var chartWidth = 100,
			chartHeight = 50;

		var gutter = 5;

		var svg = d3.select("#display").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (chartWidth + margin.left + margin.right) + " " + (chartHeight + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		svg.append("rect")
			.attr("id", "backdrop")
			.attr("x", -margin.left)
			.attr("y", -margin.top)
			.attr("height", "100%")
			.attr("width", "100%")
			.attr("fill", "black");

		this.showLevel = function(level) {
			numNotes = level.numNotes;
			svg.selectAll("rect.slot").remove();
			svg.selectAll("circle.button").remove();
			svg.selectAll("text.qmark").remove();
			svg.selectAll("text.label").remove();
			svg.select("#feedback").remove();

			var xScale = d3.scale.linear()
				.domain([0, numNotes])
				.range([0, chartWidth]);
			var slotsData = getIntegerArray(0, numNotes - 1);

			var slotWidth = (chartWidth - (numNotes + 1) * gutter) / numNotes;
			svg.selectAll("rect.slot")
				.data(slotsData)
				.enter().append("rect")
				.attr("x", function(d) {
					return xScale(d) + gutter;
				})
				.attr("class", "slot")
				.attr("y", 0)
				.attr("height", chartHeight)
				.attr("width", slotWidth)
				.attr("fill", level.color)
				.attr("fill-opacity", 0.6);

			svg.selectAll("circle.button")
				.data(level.testNotes)
				.enter().append("circle")
				.attr("class", "button")
				.attr("stroke-width", 0)
				.attr("cy", chartHeight / 2)
				.attr("cx", function(d) {
					return xScale(d - 1) + slotWidth / 2 + gutter;
				})
				.attr("r", 5)
				.attr("fill", "white")
				.attr("fill-opacity", 0.6);



			svg.selectAll("text.qmark")
				.data(level.testNotes)
				.enter().append("text")
				.attr("class", "qmark")
				.attr("text-anchor", "start")
				.attr("alignment-baseline", "middle")
				// .attr("stroke-width",0)
				.attr("y", chartHeight / 2 + 1)
				.attr("x", function(d) {
					return xScale(d - 1) + slotWidth / 2 + gutter - 3;
				})
				.attr("font-size", 8)
				.attr("fill", "black")
				.text("✓");

			svg.selectAll("text.label")
				.data(slotsData)
				.enter().append("text")
				.attr("class", "label")
				// .attr("stroke-width",0)
				.attr("text-anchor", "start")
				.attr("alignment-baseline", "hanging")
				.attr("y", 1)
				.attr("x", function(d) {
					return xScale(d) + gutter +1;
				})
				.attr("font-size", 5)
				.attr("fill", "black")
				.text(function(d) {
					return d + 1;
				});

		};


		this.markNote = function(noteNum) {
			svg.selectAll(".slot")
				.attr("fill-opacity", 0.6)
				.filter(function(d) {
					return d === noteNum;
				}).attr("fill-opacity", 1);

			svg.selectAll(".button")
				.attr("fill-opacity", 0.6)
				.filter(function(d) {
					return d === noteNum + 1;
				}).attr("fill-opacity", 1);
		};

		this.markNone = function(playTime) {
			svg.selectAll(".slot,.button")
				.attr("fill-opacity", 0.6);
		};

		this.setFeedback = function(feedback) {
			svg.select("#feedback").remove();
			svg.append("text")
				.attr("id", "feedback")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight / 2)
				.attr("fill", "white")
				.text(feedback);
		};

	};

	return Display;
});