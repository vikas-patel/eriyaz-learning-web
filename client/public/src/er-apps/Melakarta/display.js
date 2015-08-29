define(['d3'], function(d3) {
	var Display = function() {

		var margin = {
			top: 15,
			right: 10,
			bottom: 10,
			left: 15
		};

		var chartWidth = 400,
			chartHeight = 100;


		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];

		var xScale = d3.scale.linear()
			.domain([0, 13])
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
			.attr("x", function(d) {
				return xScale(d);
			})
			.attr("class", "slot")
			.attr("y", 0)
			.attr("height", chartHeight)
			.attr("width", -2+chartWidth / 13)
			.attr("fill", "lightgrey")
			.attr("fill-opacity", 0.5);


		var fixedData = [0, 7, 12];

var dragBehavior = d3.behavior.drag()
			.on("drag", dragmove);

			function dragmove(d) {
			var m = d3.mouse(svg.node());
			d= Math.floor(xScale.invert(m[0]));
			console.log(d);
			moveRect(d);
		}

		var movableData = [3];
		drawMovable();
		function drawMovable() {
			console.log(movableData);
		svg.selectAll("rect.movable")
			.data(movableData)
			.enter().append("rect")
			.attr("x", function(d) {
				return xScale(d);
			})
			.attr("class", "movable")
			.attr("y", 0)
			.attr("height", chartHeight)
			.attr("width", -2+chartWidth / 13)
			.attr("fill", "red")
			.attr("fill-opacity", 0.5)
			.call(dragBehavior);
		}

        function moveRect(pos) {
        	console.log('here')
        	svg.selectAll("rect.movable")
			.attr("x", xScale(pos));
			
        }

		this.displayThat = function(thatData) {
			svg.selectAll("rect.note").remove();
			svg.selectAll("text.label").remove();

			svg.select("#marker").remove();
			svg.select("#curtain").remove();

			svg.selectAll("text")
				.data(thatData)
				.enter()
				.append("text")
				.attr("class", "label")
				.attr("x", function(d) {
					return xScale(d) + chartWidth / 52;
				})
				.attr("y", 0)
				.text(function(d) {
					return labelsData[d];
				});

			svg.selectAll("rect.note")
				.data(thatData)
				.enter().append("rect")
				.attr("class", "note")
				.attr("x", function(d) {
					return xScale(d);
				})
				.attr("y", 0)
				.attr("height", chartHeight)
				.attr("width", -2+chartWidth / 13)
				.attr("fill", "lightblue")
				.attr("fill-opacity", 0.5);

			svg.selectAll("rect.fixed")
				.data(fixedData)
				.enter().append("rect")
				.attr("class", "fixed note")
				.attr("x", function(d) {
					return xScale(d);
				})
				.attr("y", 0)
				.attr("height", chartHeight)
				.attr("width", -2+chartWidth / 13)
				.attr("fill", "blue")
				.attr("fill-opacity", 0.5);

			svg.append("rect")
				.attr("x", 0)
				.attr("id", "marker")
				.attr("y", 0)
				.attr("height", chartHeight)
				.attr("width", -2+chartWidth / 13)
				.attr("fill", "black")
				.attr("fill-opacity", 1);


			appendCurtain();
		};

	
		this.markNote = function(interval) {
			svg.select("#marker")
				.attr("opacity", 1)
				.attr("x", xScale(interval));
		};

		this.markNone = function() {
			svg.select("#marker")
				.attr("opacity", 0);
		};

	};

	return Display;
});