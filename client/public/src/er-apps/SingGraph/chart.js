define([], function() {

	var Chart = function() {
		var margin = {
			top: 10,
			right: 30,
			bottom: 10,
			left: 10
		};

		var width = 400;
		var height = 200;

		var refreshTime = 40;
		var displayTimeRange = 5000;
		var totalTimeRange = 30000;

		var n = 40,
			random = d3.random.normal(0, 0.2),
			data = d3.range(50).map(function() {
				return random() * 1200;
			});
		data = [];
		dataCache = [];

		var x = d3.time.scale()
			.domain([0, displayTimeRange])
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
			.orient("right")
			.ticks(25)
			.tickFormat(customYFormat)
			.tickSize(-width)
			.tickSubdivide(true);

		var line = d3.svg.line()
			.x(function(d, i) {
				return x(i * refreshTime);
			})
			.y(function(d, i) {
				return y(d);
			}).interpolate("step-before");

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

		var yAxisGroup = svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)")
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
			// .attr("clip-path", "url(#clip)")
			.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);

		var oldX;
		var dragB = d3.behavior.drag()
			// .origin(function(d) { return d; })
			.on("dragstart", function() {
				console.log(d3.mouse(this));
				oldX = d3.mouse(this)[0];
			})
			.on("drag", plotDrag);

		var offset = 0;

		function plotDrag() {
			offset += d3.event.x - oldX;
			var panIndex = Math.round(offset * displayTimeRange / (refreshTime * width));
			var displayIndex = Math.round(displayTimeRange / refreshTime);
			// console.log(panIndex);
			var lineData = dataCache.slice(dataCache.length - panIndex - 1, dataCache.length - panIndex - 1 + displayIndex);
			path.attr("d", line(lineData));
		}

		var zoomB = d3.behavior.zoom()
			// .origin(Object)
			.on("zoom", plotZoom);

		function plotZoom() {
			console.log('zoomed');
			var panIndex = Math.round(d3.event.translate[0] * displayTimeRange / (refreshTime * width));
			var displayIndex = Math.round(displayTimeRange / refreshTime);
			// console.log(panIndex);
			var lineData = dataCache.slice(dataCache.length - panIndex - 1, dataCache.length - panIndex - 1 + displayIndex);
			path.attr("d", line(lineData));
			// .attr("transform", "scale(" + d3.event.scale + ")");
		}

		var eventsRect = svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "#fff")
			.attr("opacity", 0)
			.attr("pointer-events", "all")
			.call(dragB)
			.call(zoomB);



		function zoomed() {

			var indexDelta = -d3.event.translate[0] / width * 100;
			panOffset = indexDelta;
			refreshData();

			if (Math.abs(oldScale - d3.event.scale) > 1e-5) {
				oldScale = d3.event.scale;
				svg.select(".y.axis").call(yAxis);
			}

			//panMeasure = d3.event.translate[0];
			//console.log(panMeasure);
		}

		var intervalValue = 0;
		var play = true;


		function tick() {
			if (!play)
				console.log(play);
			if (play) {
				data.push(intervalValue * 100);
				dataCache.push(intervalValue * 100);
				var maxValue = d3.max(data, function(d) {
					return Math.abs(d);
				});

				y.domain([-maxValue,maxValue]);
				yAxisGroup.transition().call(yAxis); // Update Y-Axis

				if (data.length < Math.round(displayTimeRange * 0.95 / refreshTime)) {
					path
						.attr("d", line)
						.attr("transform", null)
						.transition()
						.duration(refreshTime)
						.ease("linear")
						.each("end", tick);
				} else {
					path
						.attr("d", line)
						.attr("transform", null)
						.transition()
						.duration(refreshTime)
						.ease("linear")
						.attr("transform", "translate(" + x(-refreshTime) + ",0)")
						.each("end", tick);
					data.shift();
				}

				svg.select("circle").remove();
				svg.append("circle")
					.attr("r", 3)
					.attr("cx", x(refreshTime * (data.length - 1)))
					.attr("cy", y(data[data.length - 1]));
			}

		}

		this.start = function() {
			play = true;
			tick(); //need to start only once
		};

		this.pause = function() {
			play = false;
		};

		this.notify = function(newValue) {
			intervalValue = newValue;
		};



	};
	return Chart;

});