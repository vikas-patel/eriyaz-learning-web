define([], function() {

	var Chart = function() {
		var margin = {
			top: 10,
			right: 20,
			bottom: 10,
			left: 40
		};

		var width = 400;
		var height = 600;

		var refreshTime = 40;
		var displayTimeRange = 3000;


		var x = d3.time.scale()
			.domain([0, displayTimeRange])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([-800, 1300])
			.range([height, 0]);


		var svg = d3.select("#chartdiv").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var notesData = [-8, -7, -5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12];
		var labels = ['Ga', 'ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa', '', 'Re', '', 'Ga', 'ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa\''];

		svg.selectAll("rect.note")
			.data(notesData)
			.enter().append("rect")
			.attr("class", "note")
			.attr("y", function(d) {
				return y(d * 100) - height / 22;
			})
			.attr("x", 0)
			.attr("height", height / 22 - 1)
			.attr("width", width)
			.attr("fill", "#fff3ef")
			.attr("fill-opacity", 1)
			.filter(function(d) {
				return (d === 0 || d === 12);
			})
			.attr("fill", "#fcdcd4");

		svg.selectAll("text")
			.data(notesData)
			.enter()
			.append("text")
			.attr("class", "label")
			.attr("y", function(d) {
				return y(d * 100) - 10; // - chartHeight / 13 + chartHeight / 100;
			})
			.attr("x", -25)
			.text(function(d) {
				return labels[d + 8];
			});


		var currCents = 0;
		var isPendingValue = false;
		var pointGroup;
		var tickCount = 0;
		var points = [];
		this.tick = function() {
			tickCount++;
			if (tickCount * refreshTime > displayTimeRange) {

				pointGroup
					.transition()
					.duration(refreshTime)
					.ease("linear")
					.attr("transform", "translate(" + x(displayTimeRange - tickCount * refreshTime) + ",0)");
				if (isPendingValue && points.length > Math.round(displayTimeRange / refreshTime)) {
					var oldestPoint = points.shift();
					oldestPoint.remove();
				}
			}

			if (isPendingValue) {
				var newPoint = pointGroup.append("rect")
					.attr("x", x(tickCount * refreshTime))
					.attr("y", y(currCents) - height / 22 / 2)
					.attr("width", 5)
					.attr("height", 5);
				points.push(newPoint);
				isPendingValue = false;

			}
		};

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
				.attr("y", y(interval * 100) - height / 22 + 1)
				.attr("height", height / 22 - 1)
				// .attr("y", y(interval * 100))
				.attr("width", 5)
				// .attr("height", 20)
				.attr("fill", "green")
				.attr("opacity", 0.5);
		};

		this.notifyAggStable = function(interval) {
			// svg.append("text")
			// 	.attr("x", width / 2)
			// 	.attr("y", height / 2)
			// 	.attr("font-size", 15)
			// 	.text("Stable Pitch Detected!");
		};
		this.notifyInterval = function(newValue) {
			currCents = newValue * 100;
			isPendingValue = true;
		};


		this.setFlash = function(message) {
			this.clearFlash();
			svg.append("text")
				.attr("id", "flash")
				.attr("font-size", 25)
				.attr("x", width / 2)
				.attr("y", height / 2)
				.attr("text-anchor", "middle")
				.text(message);
		};

		this.clearFlash = function() {
			var flash = svg.select("#flash");
			if (flash)
				flash.remove();
		};

		this.clearFlash();

		this.clear = function() {
			if (pointGroup)
				pointGroup.remove();
			this.clearFlash();
			svg.selectAll(".playRect").remove();
		};

		this.playAnimate = function(interval, duration) {
			var playRect = svg.append("rect")
				.attr("class", "playRect")
				.attr("x", 0)
				.attr("y", y(interval * 100) - height / 22)
				.attr("height", height / 22 - 1)
				.attr("width", 0)
				.attr("opacity", 0.2);

			playRect
				.transition()
				.duration(duration)
				.attr("width", width);
		};

	};
	return Chart;

});