define([], function() {

	var Chart = function() {
		var margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 30
		};

		var width = 400;
		var height = 200;
 
		var n = 40,
			random = d3.random.normal(0, 0.2),
			data = d3.range(n).map(function() {
				return random() * 1200;
			});

		var x = d3.time.scale()
			.domain([0, n - 1])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([-1200, 1200])
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("top")
			// .innerTickSize([height])
			// .outerTickSize([height])
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

		var line = d3.svg.line()
			.x(function(d, i) {
				return x(i);
			})
			.y(function(d, i) {
				return y(d);
			});

		function customYFormat(yValue) {
			var labels = ['Sa', '', 'Re', '', 'Ga', 'Ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa'];
			return labels[(12 + Math.round(yValue / 100)) % 12];
		}



		var svg = d3.select("#chartdiv").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// var line = d3.svg.line();



		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + y(0) + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		svg.append("svg:line")
			.attr("id", "center-line")
			.attr("x1", 0)
			.attr("y1", height / 2)
			.attr("x2", width)
			.attr("y2", height / 2);

		svg.append("defs")
			.append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);



		var path = svg.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);


		tick();

		function tick() {

			// push a new data point onto the back
			data.push(random() * 1200);

			// redraw the line, and slide it to the left
			path
				.attr("d", line)
				.attr("transform", null)
				.transition()
				.duration(500)
				.ease("linear")
				.attr("transform", "translate(" + x(-1) + ",0)")
				.each("end", tick);

			// pop the old data point off the front
			data.shift();

		}

	};
	return Chart;

});