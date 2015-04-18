define(['d3'], function(d3) {
	var Display = function(notesData) {

		var margin = {
			top: 15,
			right: 15,
			bottom: 15,
			left: 30
		};

		var chartWidth = 400,
			chartHeight = 400;

		var selected = -1;

		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		// var notesData = [0, 2, 4, 5, 7, 9, 11, 12];
		var rootNotes = [0, 12];
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

		// svg.selectAll("rect.slot")
		// 	.data(slotsData)
		// 	.enter().append("rect")
		// 	.attr("y", function(d) {
		// 		return yScale(d) - chartHeight / 13;
		// 	})
		// 	.attr("class", "slot")
		// 	.attr("x", 0)
		// 	.attr("height", chartHeight / 13 -1)
		// 	.attr("width", chartWidth)
		// 	.attr("fill", "lightgrey")
		// 	.attr("fill-opacity", 1);

		svg.append("rect")
			.attr("class", "slot")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", chartHeight)
			.attr("width", chartWidth)
			.attr("fill", "red")
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

		svg.selectAll("rect.note")
			.data(notesData)
			.enter().append("rect")
			.attr("class", "note")
			.attr("y", function(d) {
				return yScale(d) - chartHeight / 13;
			})
			.attr("x", 0)
			.attr("height", chartHeight / 13 - 1)
			.attr("width", chartWidth)
			.attr("fill", "lightblue")
			.attr("fill-opacity", 1)
			// .on("mouseover", function(d) {
			// 	d3.select(this).attr("fill", "lightgreen");
			// })
			// .on("mouseout", function(d) {
			// 	d3.select(this).attr("fill", "lightblue");
			// })
			.on("click", selectedNote);

		svg.selectAll("rect.root")
			.data(rootNotes)
			.enter().append("rect")
			.attr("class", "root")
			.attr("y", function(d) {
				return yScale(d) - chartHeight / 13;
			})
			.attr("x", 0)
			.attr("height", chartHeight / 13 - 1)
			.attr("width", chartWidth)
			.attr("fill", "grey")
			.attr("fill-opacity", 1);

		function selectedNote(d) {
			selected = d;
			svg.select("rect.selector").remove();
			svg.append("rect")
				.attr("class", "selector")
				.attr("y", yScale(d) - chartHeight / 13)
				.attr("x", 0)
				.attr("height", chartHeight / 13 - 1)
				.attr("width", chartWidth)
				.attr("fill", "green")
				.attr("fill-opacity", 1);
		}

		this.markNote = function(degree) {
			svg.select("#marker").remove();
			svg.append("rect")
				.attr("x", 0)
				.attr("id", "marker")
				.attr("y", 0)
				.attr("height", chartHeight / 13 - 1)
				.attr("width", chartWidth)
				.attr("fill", "black")
				.attr("opacity", 0);
			svg.select("#marker")
				.attr("opacity", 1)
				.attr("y", yScale(degree) - chartHeight / 13);
		};

		this.getSelected = function() {
			return selected;
		};

		this.reset = function() {
			svg.select("#marker").remove();
			// .attr("opacity", 0);
			selected = -1;
			svg.select("rect.selector").remove();
			svg.select("#feedback").remove();
		};

		this.setFeedback = function(isRight) {
			svg.append("text")
				.attr("id", "feedback")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight / 2)
				.attr("fill", function() {
					if (isRight)
						return "green";
					else return "red";
				})
				.text(function() {
					if (isRight)
						return "right!";
					else return "wrong :(";
				});
		};
	};

	return Display;
});