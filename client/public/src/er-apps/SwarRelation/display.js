define(['d3'], function(d3) {
	var Display = function() {

		var margin = {
			top: 15,
			right: 15,
			bottom: 15,
			left: 15
		};

		var chartWidth = 400,
			chartHeight = 400;


		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var notesData = [0, 2, 4, 5, 7, 9, 11, 12];
		var labelsData = ["S", "", "R", "", "G", "m", "", "P", "", "D", "", "N", "S'"];

		var yScale = d3.scale.linear()
			.domain([13, 0])
			.range([0, chartHeight]);

		var svg = d3.select("#display").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (chartWidth + margin.left + margin.right) + " " + (chartHeight + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.selectAll("rect.slot")
			.data(slotsData)
			.enter().append("rect")
			.attr("y", function(d) {
				return yScale(d) - chartHeight / 13;
			})
			.attr("class", "slot")
			.attr("x", 0)
			.attr("height", chartHeight / 13 - 2)
			.attr("width", chartWidth)
			.attr("fill", "lightgrey")
			.attr("fill-opacity", 0.5);



		svg.selectAll("text")
			.data(slotsData)
			.enter()
			.append("text")
			.attr("class", "label")
			.attr("y", function(d) {
				return yScale(d) - chartHeight / 13 + chartHeight / 100;
			})
			.attr("x", 0)
			.text(function(d) {
				return labelsData[d];
			});

		svg.selectAll("rect.note")
			.data(notesData)
			.enter().append("rect")
			.attr("class", "note")
			.attr("y", function(d) {
				return yScale(d) - chartHeight / 13;
			})
			.attr("x", 0)
			.attr("height", chartHeight / 13 - 2)
			.attr("width", chartWidth)
			.attr("fill", "lightblue")
			.attr("fill-opacity", 0.5);



		svg.append("rect")
			.attr("x", 0)
			.attr("id", "marker")
			.attr("y", 0)
			.attr("height", chartHeight / 13 - 2)
			.attr("width", chartWidth)
			.attr("fill", "black")
			.attr("fill-opacity", 0.2);



		this.markNote = function(interval) {
			svg.select("#marker")
				.attr("opacity", 1)
				.attr("x", yScale(interval));
		};

		this.markNone = function(playTime) {
			svg.select("#marker")
				.transition()
				.duration(playTime)
				.attr("opacity", 0);
		};

	};

	return Display;
});