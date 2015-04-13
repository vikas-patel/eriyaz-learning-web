define(['d3'], function(d3) {
	var Display = function() {

		var margin = {
			top: 10,
			right: 30,
			bottom: 10,
			left: 30
		};

		var chartWidth = 400,
			chartHeight = 400;

		var barPreset = chartHeight/2;

		var barWidth = chartWidth,
			barHeight = chartHeight,
			dragAreaH = 200;

		var arrowsize = 10;

		var dragtop = d3.behavior.drag()
			.origin(Object)
			.on("drag", tdragresize);

		var yScale = d3.scale.linear()
			.domain([0, 1200])
			.range([0, chartHeight]);


		var svg = d3.select("#display").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (chartWidth + margin.left + margin.right) + " " + (chartHeight + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		function customYFormat(yValue) {
			var labels = ['Sa', '', 'Re', '', 'Ga', 'Ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa'];
			return labels[Math.abs(12 - Math.round(yValue / 100))];
		}

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.ticks(13)
			.tickFormat(customYFormat)
			.tickSize(-chartWidth)
			.tickSubdivide(true);


		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		svg.append("svg:line")
			.attr("x1",chartWidth)
			.attr("y1",0)
			.attr("x2",chartWidth)
			.attr("y2",chartHeight);

		var barData = {
			x: 0,
			y: barPreset
		};

		var newg = svg.append("g")
			.data([barData]);

		var dragrect = newg.append("rect")
			.attr("id", "guessBar")
			.attr("x", function(d) {
				return d.x;
			})
			.attr("y", function(d) {
				return d.y;
			})
			.attr("height", function(d) {
				barHeight = chartHeight - d.y;
				return barHeight;
			})
			.attr("width", barWidth)
			// .attr("fill", "blue")
			.attr("fill-opacity", 0.5);


		var dragArea = newg.append("rect")
			.attr("x", 0)
			.attr("y", function(d) {
				return d.y - (dragAreaH / 2);
			})
			.attr("height", dragAreaH)
			.attr("id", "dragArea")
			.attr("width", chartWidth)
			// .attr("fill", "blue")
			.attr("fill-opacity", 0)
			.attr("cursor", "ns-resize")
			.call(dragtop);

		var arrow = newg.append("rect")
			.attr("id", "arrow")
			.attr("transform", function(d) {
				return "translate(" + (barWidth / 2 - arrowsize) + "," + (d.y) + ") rotate(-45)";
			})
			.attr("height", arrowsize)
			.attr("width", arrowsize)
			// .attr("fill", "darkgrey")
			.attr("cursor", "ns-resize")
			.call(dragtop);



		function tdragresize(d) {
			d.y = Math.max(0,Math.min(d3.event.y, chartHeight));
			redrawBar();
		}

		function redrawBar() {
			dragrect
				.attr("y", function(d) {
					return d.y;
				})
				.attr("height", function(d) {
					barHeight = chartHeight - d.y;
					return barHeight;
				});
			arrow
				.attr("transform", function(d) {
					return "translate(" + (barWidth / 2 - arrowsize) + "," + (d.y) + ") rotate(-45)";
				});
			dragArea.attr("y", function(d) {
				return d.y - (dragAreaH / 2);
			});
		}

		this.reset = function() {
			svg.select("#ansBar").remove();
			barData.y = barPreset;
			redrawBar();
		};

		this.getCents = function() {
			return yScale.invert(chartHeight - barData.y);
		};

		this.showCents = function(answer) {
			svg.select("#ansBar").remove();
			var ansRect = svg.append("rect")
				.attr("id", "ansBar")
				.attr("x", 0)
				.attr("y", chartHeight)
				.attr("width", chartWidth)
				.attr("opacity", 0.3)
				// .attr("fill", "green")
				.attr("height", 0);
			ansRect
				.transition()
				.duration(1000) // this is 1s
				.delay(100)
				.ease("elastic")
				.attr("y", chartHeight - yScale(Math.abs(answer)))
				.attr("height", yScale(Math.abs(answer)));
		};
	};

	return Display;
});