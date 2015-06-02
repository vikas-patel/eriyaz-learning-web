define([], function() {

	var Display = function() {
		var margin = {
			top: 10,
			right: 30,
			bottom: 10,
			left: 10
		};

		var width = 400;
		var height = 200;


		var timeRange = 2500;



		var xScale = d3.time.scale()
			.domain([0, timeRange])
			.range([0, width]);

		var yScale = d3.scale.linear()
			.domain([-12, 12])
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top")
			// .innerTickSize([height])
			// .outerTickSize([height])
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("right")
			.ticks(25)
			.tickFormat(customYFormat)
			.tickSize(-width)
			.tickSubdivide(true);



		function customYFormat(yValue) {
			var labels = ['Sa', '', 'Re', '', 'Ga', 'Ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa'];
			return labels[(12 + Math.round(yValue)) % 12];
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
			.attr("transform", "translate(0," + yScale(0) + ")")
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


		var pointGroup;
		this.plotData = function(data) {
			pointGroup = svg.append("g");
			pointGroup.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return xScale(i * 64 / 48);
				}).attr("y", function(d) {
					return yScale(d);
				}).attr("width", 2)
				.attr("height", 2);
			// console.log(data);
			// console.log(data.length);
		};

		var remainingTime;
		var count;
		this.playAnimate = function(audioTime) {
			count = 0;
			remainingTime = audioTime;
			pointGroup.attr("transform", "translate(0,0)");
			playPage(remainingTime);
		};

		function playPage() {
			if (remainingTime > 0) {
				if (count > 0) {
					console.log('ncount');
					pointGroup.attr("transform", "translate(" + -1 * xScale(timeRange * count) + ",0)");
				}
				if (remainingTime > timeRange) {
					playCursor(timeRange);
				} else playCursor(remainingTime);
				remainingTime = remainingTime - timeRange;
			}
			count++;
		}


		function playCursor(cursorTime) {
			svg.select('#cursor').remove();
			var cursor = svg.append("svg:line");
			cursor
				.attr("id", "cursor")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", height);
			cursor.transition().duration(cursorTime)
				.ease("linear")
				// .attr("transform","translate(" + xScale(cursorTime) + ",0)")
				.attr("x1", xScale(cursorTime))
				.attr("x2", xScale(cursorTime))
				.each("end", function() {
					playPage();
				});
		}
		this.clear = function() {
			if (pointGroup)
				pointGroup.remove();
			svg.selectAll("circle").remove();
			svg.select('#cursor').remove();
		};


	};
	return Display;

});