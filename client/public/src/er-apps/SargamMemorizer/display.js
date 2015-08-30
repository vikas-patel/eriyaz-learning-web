define(['d3'], function(d3) {
	var Display = function(notesData, checkAnswer1, checkAnswer2) {
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



		function selectedNote(d) {
			selected = d;
			svg.select("#selector").remove();
			createMarkedGroup("reset")
				.attr("id","selector")
				.attr("transform", "translate(0," + (yScale(d) - chartHeight / 13) + ")");
			checkAnswer1();
		}

		this.markNote = function(degree) {
			svg.select("#marker").remove();
			svg.append("rect")
				.attr("x", 0)
				.attr("id", "marker")
				.attr("y", 0)
				.attr("height", chartHeight / 13 - 1)
				.attr("width", chartWidth)
				.attr("fill", "grey")
				.attr("opacity", 0);
			svg.select("#marker")
				.attr("opacity", 0.5)
				.attr("y", yScale(degree) - chartHeight / 13);
		};

		this.getSelected = function() {
			return selected;
		};

		this.removeMark = function() {
			svg.select("#marker").remove();
		}

		this.reset = function() {
			svg.select("#marker").remove();
			// .attr("opacity", 0);
			selected = -1;
			svg.select("rect.selector").remove();
			svg.select("g.reset").remove();
			svg.select("#feedback").remove();
		};

		this.setFeedback = function(isRight) {
			svg.select('#feedback').remove();
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

		this.setMessage = function(message) {
			svg.select('#feedback').remove();
			svg.append("text")
				.attr("id", "feedback")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight / 2)
				.attr("fill", "green")
				.text(message);
		};

		this.showLevel = function(level) {

			svg.selectAll("rect.note").remove();
			svg.selectAll("circle").remove();
			svg.selectAll("text.qMark").remove();


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
				.filter(function(d) {
					return level.notes.indexOf(d) >= 0;
				})
				.attr("class", "selectable")
				.on("click", selectedNote);

			svg.selectAll("circle.qNote")
				.data(level.notes)
				.enter()
				.append("circle")
				.attr("r", 10)
				.attr("cx", chartWidth / 2)
				.attr("cy", function(d) {
					return yScale(d) - chartHeight / 26;
				})
				.attr("fill", "white")
				.attr("fill-opacity", 0.5);

			svg.selectAll("text.qMark")
				.data(level.notes)
				.enter()
				.append("text")
				.attr("class", "qMark")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("y", function(d) {
					return yScale(d) - 10;
				})
				.text("?");


			createMarkedGroup()
				.attr("transform", "translate(0," + (yScale(level.direction === "asc" ? 0 : 12) - chartHeight / 13) + ")");

			// rootGroup.append("rect")
			// 	.attr("y", 0)
			// 	.attr("x", 0)
			// 	.attr("height", chartHeight / 13 - 1)
			// 	.attr("width", chartWidth)
			// 	.attr("fill", "grey")
			// 	.attr("fill-opacity", 1);
			// rootGroup.append("circle")
			// 	.attr("r", 10)
			// 	.attr("cx", chartWidth / 2)
			// 	.attr("cy", chartHeight / 26)
			// 	.attr("fill", "white")
			// 	.attr("fill-opacity", 0.5);
			// rootGroup.append("text")
			// 	.attr("text-anchor", "middle")
			// 	.attr("x", chartWidth / 2)
			// 	.attr("y", chartHeight / 26 + 4)
			// 	.attr("font-size",10)
			// 	.text("✓");

		};

		function createMarkedGroup(css) {
			var group = svg.append("g")
				.attr("class", "marked" + " " + css);

			group.append("rect")
				.attr("y", 0)
				.attr("x", 0)
				.attr("height", chartHeight / 13 - 1)
				.attr("width", chartWidth)
				.attr("fill", "grey")
				.attr("fill-opacity", 1);
			group.append("circle")
				.attr("r", 10)
				.attr("cx", chartWidth / 2)
				.attr("cy", chartHeight / 26)
				.attr("fill", "white")
				.attr("fill-opacity", 0.5);
			group.append("text")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight / 26 + 4)
				.attr("font-size", 10)
				.text("✓");

			return group;
		}

		this.createUpOrDownGroup = function() {
			svg.select("#selector").remove();
			var group = svg.append("g")
				.attr("class", "marked" + " " + "reset");
			var gap = chartHeight / 13 - 1;
			var height = gap*8/10;
			var rectUp = group.append("rect");

			rectUp.attr("y", 0)
				.attr("x", 0)
				.attr("height", height)
				.attr("width", chartWidth)
				.attr("class", "upOrDown")
				.on("click", function() {
					checkAnswer2(true);
					svg.select("#upText").text("✓");
					rectUp.attr("class", "selected");
				})
				.attr("fill-opacity", 1);
			group.append("circle")
				.attr("r", 10)
				.attr("cx", chartWidth / 2)
				.attr("cy", height/2)
				.attr("fill", "white")
				.attr("fill-opacity", 0.5);
			group.append("text")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("id", "upText")
				.attr("y", height/2 + 4)
				.attr("font-size", 10)
				.text("↑");

			var rectDown = group.append("rect");
			rectDown.attr("y", gap)
				.attr("x", 0)
				.attr("height", height)
				.attr("width", chartWidth)
				.attr("class", "upOrDown")
				.on("click", function() {
					checkAnswer2(false);
					svg.select("#downText").text("✓");
					rectDown.attr("class", "selected");
				})
				.attr("fill-opacity", 1);
			group.append("circle")
				.attr("r", 10)
				.attr("cx", chartWidth / 2)
				.attr("cy", height/2 + gap)
				.attr("fill", "white")
				.attr("fill-opacity", 0.5);
			group.append("text")
				.attr("text-anchor", "middle")
				.attr("x", chartWidth / 2)
				.attr("y", height/2 + 4 + gap)
				.attr("font-size", 10)
				.attr("id", "downText")
				.text("↓");
			group.attr("transform", "translate(0," + (yScale(this.getSelected()) -chartHeight / 13- chartHeight / 26) + ")");
			return group;
		}
	};

	return Display;
});