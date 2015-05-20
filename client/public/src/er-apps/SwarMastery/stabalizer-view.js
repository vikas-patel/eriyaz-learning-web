define([], function() {

	var StabalizerView = function() {
		// var margin = {
		// 	top: 10,
		// 	right: 30,
		// 	bottom: 10,
		// 	left: 10
		// };

		var margin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};

		var width = 80;
		var height = 20;

		var refreshTime = 40;
		var displayTimeRange = 3000;


		var x = d3.time.scale()
			.domain([0, displayTimeRange])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([-100, 200])
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
			.ticks(3)
			.tickSize(-width)
			.tickSubdivide(true);


		var svg = d3.select("#stabalizer").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// var line = d3.svg.line();

		svg.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", height)
			.attr("fill", "white");

		svg.append("rect")
			.attr("x", 0)
			.attr("y", height / 3)
			.attr("width", width)
			.attr("height", height / 3)
			.attr("fill", "lightgreen");

		// svg.append("g")
		// 	.attr("class", "x axis")
		// 	.attr("transform", "translate(0," + y(0) + ")")
		// 	.call(xAxis);

		// var yAxisGroup = svg.append("g")
		// 	.attr("class", "y axis")
		// 	.attr("transform", "translate(" + width + ",0)")
		// 	.call(yAxis);



		var currCents = 0;
		var isPendingValue = false;
		var pointGroup;
		var tickCount = 0;
		var points = [];
		var latestStable = 0;
		this.tick = function() {
			tickCount++;
			if (tickCount * refreshTime > displayTimeRange) {

				// pointGroup
				// 	.transition()
				// 	.duration(refreshTime)
				// 	.ease("linear")
				// 	.attr("transform", "translate(" + x(displayTimeRange - tickCount * refreshTime) + ",0)");
				pointGroup
					.transition()
					.duration(refreshTime)
					.ease("linear")
					.attr("transform", "translate(" + x(displayTimeRange - tickCount * refreshTime) + "," + calcTranslate(latestStable) + ")");
				if (isPendingValue && points.length > Math.round(displayTimeRange / refreshTime)) {
					var oldestPoint = points.shift();
					oldestPoint.remove();
				}
			} else {
				pointGroup
					.transition()
					.duration(refreshTime)
					.ease("linear")
					.attr("transform", "translate(0," + calcTranslate(latestStable) + ")");
			}

			if (isPendingValue) {
				var newPoint = pointGroup.append("rect")
					.attr("x", x(tickCount * refreshTime))
					.attr("y", y(currCents) + 2)
					.attr("width", 2)
					.attr("height", 2);


				points.push(newPoint);
				isPendingValue = false;

			}
		};

		function calcTranslate(cents) {
			return -1 * y(cents - cents % 100 + 100);
		}

		var tickId;
		this.start = function() {
			pointGroup = svg.append("g");
			var local = this;
			tickId = setInterval(function() {
				local.tick();
			}, refreshTime);
		};

		this.stop = function() {
			clearInterval(tickId);
			tickCount = 0;
		};

		this.notifyUnitStable = function(interval) {
			pointGroup.append("rect")
				.attr("x", x(tickCount * refreshTime))
				.attr("y", y(interval * 100))
				.attr("height", height / 3)
				// .attr("y", y(interval * 100))
				.attr("width", 5)
				// .attr("height", 20)
				.attr("fill", "green")
				.attr("opacity", 0.5);
			latestStable = interval * 100;
		};
		this.notifyInterval = function(newValue) {
			currCents = newValue * 100;
			isPendingValue = true;
		};

		this.clear = function() {
			if (pointGroup)
				pointGroup.remove();
		};


	};
	return StabalizerView;

});