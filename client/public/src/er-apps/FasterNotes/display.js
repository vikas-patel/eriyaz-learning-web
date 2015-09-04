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


		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];


		var yScale = d3.scale.linear()
			.domain([0, 13])
			.range([chartHeight, 0]);

		var xScale = d3.scale.linear()
			.domain([0, 4])
			.range([0, chartWidth]);

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
			.ticks(4)
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);



		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chartHeight + ")")
			.call(xAxis);


		var clickBox = svg.append("rect")
			.attr("x", 0)
			.attr("id", "clickbox")
			.attr("y", 0)
			.attr("height", chartHeight)
			.attr("width", chartWidth)
			.attr("fill", "lightgrey")
			.attr("opacity", 0);



		var notesData = [0, 2, 4, 5];

		function drawNotes() {
			svg.selectAll("rect.note").remove();

			svg.selectAll("rect.note")
				.data(notesData)
				.enter().append("rect")
				.attr("x", function(d, i) {
					return xScale(i);
				})
				.attr("class", "note")
				.attr("y", function(d) {
					return yScale(d + 1);
				})
				.attr("height", chartHeight / 13)
				.attr("width", chartWidth / 4)
				.attr("fill", "lightblue")
				.attr("fill-opacity", 1);


		}

		drawNotes();

		clickBox.on("click", function() {
			var m = d3.mouse(this);
			console.log(m);
			notesData[Math.floor(xScale.invert(m[0]))] = Math.floor(yScale.invert(m[1]));
			drawNotes();
		});

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
				.attr("width", chartWidth / 4)
				.attr("fill", "white")
				.attr("fill-opacity", 1);

		};

		this.reset = function() {
			svg.selectAll("rect.ans").remove();
		  	notesData = [0,2,4,5];
		  	drawNotes();
		};
	};

	return Display;
});