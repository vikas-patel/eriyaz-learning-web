define([], function() {

	var Chart = function() {
		var margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 30
		};

		// 	var parentEl = d3.select('#chartdiv')[0][0];
		// var size = parseInt(window.getComputedStyle(parentEl).width);
		// console.log(size);
		var width = 400; 
		var height = 400;

		var dragBehavior = d3.behavior.drag()
			.on("drag", dragmove);

		var x = d3.time.scale()
			.domain([1, 6])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([-1200, 1200])
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("top")
			.innerTickSize([height])
			.outerTickSize([height])
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(25)
			.tickFormat(customYFormat)
			.tickSize(-width)
			.tickSubdivide(true);

		function customYFormat(yValue) {
			var labels = ['Sa', '', 'Re', '', 'Ga', 'Ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa'];
			return labels[Math.abs(Math.round(yValue / 100))];
		}

		function dragmove(d) {
			var m = d3.mouse(svg.node());
			if (d !== points[0]) {
				d[1] = m[1];
				selected = dragged = d;
			}
			redraw();
		}


		var svg = d3.select("#chartdiv").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var line = d3.svg.line();

		var points = d3.range(1, 4).map(function(i) {
			return [x(i), y(0)];
		});

		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.on("mousedown", function() {
				selected = dragged = null;
				redraw();
			});

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		svg.node().focus();

		svg.append("path")
			.datum(points)
			.attr("class", "line")
			.attr("id", "guess")
			.call(redraw);

		function redraw() {
			svg.select("#guess").attr("d", line);

			var circle = svg.selectAll("circle")
				.data(points, function(d) {
					return d;
				});

			circle.enter().append("circle")
				.on("mousedown", function(d) {
					selected = dragged = d;
					redraw();
				})
				.attr("r", 26.5)
				.attr("class", "draggable")
				.call(dragBehavior);


			circle
				.classed("selected", function(d) {
					return d === selected;
				})
				.attr("cx", function(d) {
					return d[0];
				})
				.attr("cy", function(d) {
					return d[1];
				});

			circle.exit().remove();
		}

		var dragged = null,
			selected = null;


		redraw();

		this.getData = function() {
			var data = [];
			for (var i = 0; i < points.length; i++) {
				data[i] = y.invert(points[i][1]);
			}
			return data;
		};

		this.plotData = function(data) {
			var series = [];
			for (var i = 0; i < data.length; i++) {
				series.push([x(i + 1), y(data[i])]);
			}
			svg.select("#ans").remove();
			svg.append("path")
				.datum(series)
				.attr("class", "line")
				.attr("id", "ans")
				.attr("d", line);
		};

		this.reset = function(numNotes) {
			svg.select("#ans").remove();
			points.length = 0;
			for (var i = 0; i < numNotes; i++) {
				points.push([x(i + 1), y(0)]);
			}
			redraw();
		};
	};
	return Chart;

});