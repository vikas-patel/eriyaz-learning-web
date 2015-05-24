define([], function() {

	var Chart = function() {
		var margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 30
		};


		var width = 400;
		var height = 400;

		var dragBehavior = d3.behavior.drag()
			.on("drag", dragmove);

		var x = d3.scale.linear()
			.domain([0, 6000])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([-5, 12])
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("top")
			.innerTickSize([height])
			.outerTickSize([height])
			.ticks(6)
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
			return labels[(12 + Math.round(yValue)) % 12];
		}

		function dragmove(d) {
			var m = d3.mouse(svg.node());
			// if (d !== points[0]) {
			selected = dragged = d;
			updatePoint(selected, m);
			// }
			redraw();
		}

		function updatePoint(point, m) {
			var index = points.indexOf(point);
			var next = points[index + 1];
			var prev = points[index - 1];

			var oldX = point[0];
			//update y
			if (index > 1) {

				point[1] = y(Math.round(y.invert(m[1])));
				if (index % 2 === 1) {
					prev[1] = point[1];

				} else {
					if (next)
						next[1] = point[1];
				}
			}

			//update x
			if (index > 0) {
				var next2 = points[index + 2];
				var prev2 = points[index - 2];
				if (index % 2 === 1) {
					// point[0] = Math.max(prev[0] + x(250), Math.min(next2 ? next2[0] - x(250) : x(6000), x(roundAt250(x.invert(m[0])))));
					point[0] = Math.max(prev[0] + x(250), x(roundAt250(x.invert(m[0]))));
					if (next)
						next[0] = point[0];
				} else {
					point[0] = Math.max(prev2[0] + x(250), Math.min(next ? next[0] - x(250) : x(6000), x(roundAt250(x.invert(m[0])))));
					prev[0] = point[0];

				}

			}
			var newX = point[0];
			var shift = newX - oldX;
			if (points[points.length - 1][0] + shift <= width) {
				for (var i = index + 2; i < points.length; i++) {
					points[i][0] = points[i][0] + shift;
				}
			}

		}

		function roundAt250(number) {
			return number - number % 250;
		}

		var svg = d3.select("#chartdiv").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var line = d3.svg.line();
		line.interpolate("linear");

		var notes = d3.range(1, 4).map(function(i) {
			return {
				duration: 1000,
				degree: 0
			};
		});

		var points = [];
		updatePointsFromNotes(notes, points);

		function updatePointsFromNotes(notes, points) {
			points.length = 0;
			points.push([x(0), y(notes[0].degree)]);
			points.push([x(notes[0].duration), y(notes[0].degree)]);
			var sumDuration = notes[0].duration;
			for (var i = 1; i < notes.length; i++) {
				points.push([x(sumDuration), y(notes[i].degree)]);
				points.push([x(sumDuration + notes[i].duration), y(notes[i].degree)]);
				sumDuration += notes[i].duration;
			}
		}

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

		svg.append("svg:line")
			.attr("id", "center-line")
			.attr("x1", 0)
			.attr("y1", y(0))
			.attr("x2", width)
			.attr("y2", y(0));

		svg.node().focus();

		svg.append("path")
			.datum(points)
			.attr("class", "line")
			.attr("id", "guess")
			.call(redraw);

		function redraw() {
			svg.select("#guess").attr("d", line);
			svg.select("#segment").remove();

			svg.selectAll("#segment")
				.data(points.filter(function(d) {
					return d === selected;
				}))
				.enter()
				.append("svg:line")
				.attr("id", "segment")
				.attr("x1", function(d) {
					return points[points.indexOf(d) - 1][0];
				})
				.attr("y1", function(d, i) {
					return points[points.indexOf(d) - 1][1];
				})
				.attr("x2", function(d) {
					return d[0];
				})
				.attr("y2", function(d) {
					return d[1];
				})
				.attr("stroke", "red")
				.attr("stroke-width", 2);

			svg.selectAll("circle.guess.big")
				.data(points)
				.enter()

			.append("circle")
				.on("mousedown", function(d) {
					selected = dragged = d;
					redraw();
				})
				.attr("r", 26.5)
				.attr("class", "guess big")
				.call(dragBehavior)
				.filter(function(d, i) {
					return i % 2 === 0;
				})
				.attr("display", "none");

			svg.selectAll("circle.guess.small")
				.data(points)
				.enter()
				.append("circle")
				.on("mousedown", function(d) {
					selected = dragged = d;
					redraw();
				})
				.attr("r", 5)
				.attr("class", "guess small")
				.call(dragBehavior)
				.filter(function(d, i) {
					return i % 2 === 0;
				})
				.attr("display", "none");


			svg.selectAll("circle.guess")
				.classed("selected", function(d) {
					return d === selected;
				})
				.attr("cx", function(d) {
					return d[0];
				})
				.attr("cy", function(d) {
					return d[1];
				});

			svg.selectAll("circle.big")
				.data(points)
				.exit()
				.remove();

			svg.selectAll("circle.small")
				.data(points)
				.exit()
				.remove();
		}


		var dragged = null,
			selected = null;

		redraw();

		this.getData = function() {
			var data = [];
			for (var i = 1; i < points.length; i++) {
				if(i%2==1)
				data.push({
					duration: Math.round(x.invert(points[i][0]-points[i-1][0])),
					degree: Math.round(y.invert(points[i][1]))
				});
			}
			return data;
		};

		this.plotData = function(notes) {
			var series = [];
			updatePointsFromNotes(notes,series);
			// for (var i = 0; i < data.length; i++) {
			// 	series.push([x(i + 1), y(data[i])]);
			// }
			svg.select("#ans").remove();
			svg.selectAll("circle.ans").remove();

			svg.append("path")
				.datum(series)
				.attr("class", "line")
				.attr("id", "ans")
				.attr("d", line);

			svg.selectAll("circle.ans")
				.data(series.filter(function(d,i){
					return i%2===1;
				}))
				.enter()
				.append("circle")
				.attr("class", "ans")
				.attr("r", 5)
				.attr("cx", function(d) {
					return d[0];
				})
				.attr("cy", function(d) {
					return d[1];
				});
		};

		this.reset = function(numNotes) {
			svg.select("#ans").remove();
			svg.selectAll("circle.ans").remove();
			svg.selectAll(".segment").remove();
			var notes = d3.range(0, numNotes).map(function(i) {
				return {
					duration: 1000,
					degree: 0
				};
			});
			updatePointsFromNotes(notes, points);
			redraw();
		};
	};
	return Chart;

});