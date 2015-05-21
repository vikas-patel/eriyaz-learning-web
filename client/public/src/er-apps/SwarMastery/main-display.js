define([], function() {

	var MainDisplay = function() {
		var margin = {
			top: 15,
			right: 15,
			bottom: 15,
			left: 30
		};

		var chartWidth = 300,
			chartHeight = 400;

		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];

		var yScale = d3.scale.linear()
			.domain([13, 0])
			.range([0, chartHeight]);

		var svg = d3.select("#main-display").append("svg")
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
			.attr("height", chartHeight / 13 -1)
			.attr("width", chartWidth)
			.attr("fill", "lightgrey")
			.attr("fill-opacity", 1);

		svg.selectAll("text")
			.data(slotsData)
			.enter()
			.append("text")
			.attr("class", "label")
			.attr("y", function(d) {
				return yScale(d) - 10; // - chartHeight / 13 + chartHeight / 100;
			})
			.attr("x", -15)
			.text(function(d) {
				return labelsData[d];
			});
		
		this.changeSettings = function(selectedNotes) {
			svg.selectAll("rect.note").remove();
			svg.selectAll("rect.note")
				.data(selectedNotes)
				.enter().append("rect")
				.attr("class", "note")
				.attr("y", function(d) {
					return yScale(d) - chartHeight / 13;
				})
				.attr("x", 0)
				.attr("height", chartHeight / 13 - 1)
				.attr("width", chartWidth)
				.attr("fill", "#aaa")
				.attr("fill-opacity", 1);
		};

		this.setFlash = function(message) {
			this.clearFlash();
			svg.append("text")
				.attr("id", "flash")
				.attr("font-size", 25)
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight / 2)
				.attr("text-anchor", "middle")
				.text(message);
		};

		this.clearFlash = function() {
			var flash = svg.select("#flash");
			if (flash)
				flash.remove();
		};

		this.clear = function() {
			this.clearFlash();
			svg.selectAll(".playRect").remove();
			svg.select("#marker").remove();
			svg.select("#question").remove();
		};

		this.markQuestion = function(interval) {
			var group1 = svg.append("g")
				.attr("id", "marker");

			group1.append("circle")
				.attr("r", 10)
				.attr("cx", chartWidth / 2)
				.attr("cy", chartHeight / 26)
				.attr("fill", "white")
				.attr("fill-opacity", 0.5);
			group1.append("text")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight / 26 + 4)
				.attr("font-size", 10)
				.text("?");

				group1.attr("transform", "translate(0," + (yScale(interval) - chartHeight / 13) + ")");


				var group2 = svg.append("g")
				.attr("id", "question");

			group2.append("circle")
				.attr("r", 40)
				.attr("cx", chartWidth / 2)
				.attr("cy", chartHeight / 26)
				.attr("fill", "white")
				.attr("fill-opacity",1);
			group2.append("text")
				.attr("text-anchor", "middle")
				.attr("alignment-baseline","middle")
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight / 26)
				.attr("font-size", 40)
				.text(labelsData[interval]);

				group2.attr("transform", "translate(0," + (chartHeight/2 - chartHeight / 13) + ")");
		};

		

		this.playAnimate = function(interval, duration) {
			var playRect = svg.append("rect")
				.attr("class", "playRect")
				.attr("x", 0)
				.attr("y", yScale(interval) - chartHeight / 13)
				.attr("height", chartHeight / 13 - 1)
				.attr("width", 0)
				.attr("opacity", 0.2);

			playRect
				.transition()
				.duration(duration)
				.attr("width", chartWidth);
		};
	};

	return MainDisplay;

});