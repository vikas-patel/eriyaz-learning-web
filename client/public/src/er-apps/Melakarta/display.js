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
			.attr("width", -2 + chartWidth / 13)
			.attr("fill", "lightgrey")
			.attr("fill-opacity", 0.5);


		var fixedData = [0, 7, 12];

		var movableData = [2, 4, 5, 9, 11];

		var dragBehavior = d3.behavior.drag()
			.on("drag", dragmove);

		function dragmove(d, i) {
			var m = d3.mouse(svg.node());
			var newVal = Math.floor(xScale.invert(m[0]));

			if (i === 0 && newVal >= 1 && newVal <= 3) {
				movableData[i] = newVal;
				if (movableData[i + 1] === newVal) {
					movableData[i + 1] = newVal + 1;
				}
			}

			if (i === 1 && newVal >= 2 && newVal <= 4) {
				movableData[i] = newVal;
				if (movableData[i - 1] === newVal) {
					movableData[i - 1] = newVal - 1;
				}
			}

			if (i === 2 && newVal >= 5 && newVal <= 6) {
				movableData[i] = newVal;
			}

			if (i === 3 && newVal >= 8 && newVal <= 10) {
				movableData[i] = newVal;
				if (movableData[i + 1] === newVal) {
					movableData[i + 1] = newVal + 1;
				}
			}

			if (i === 4 && newVal >= 9 && newVal <= 11) {
				movableData[i] = newVal;
				if (movableData[i - 1] === newVal) {
					movableData[i - 1] = newVal - 1;
				}
			}

			drawMovable();
		}

		drawFixed();
		drawMovable();

		function drawFixed() {
			svg.selectAll("rect.fixed").remove();

			svg.selectAll("rect.fixed")
				.data(fixedData)
				.enter().append("rect")
				.attr("x", function(d) {
					return xScale(d);
				})
				.attr("class", "fixed")
				.attr("y", 0)
				.attr("height", chartHeight)
				.attr("width", -2 + chartWidth / 13)
				.attr("fill", "green")
				.attr("fill-opacity", 0.5)
				.call(dragBehavior);
		}

		function drawMovable() {
			svg.selectAll("rect.movable").remove();

			svg.selectAll("rect.movable")
				.data(movableData)
				.enter().append("rect")
				.attr("x", function(d) {
					return xScale(d);
				})
				.attr("class", "movable")
				.attr("y", 0)
				.attr("height", chartHeight)
				.attr("width", -2 + chartWidth / 13)
				.attr("fill", function(d,i) {
					if(i===2) return "blue";
					else return"red";})
				.attr("fill-opacity", 0.5)
				.call(dragBehavior);
		}



		this.displayThat = function(thatData) {
			svg.selectAll("rect.note").remove();


			svg.selectAll("rect.note")
				.data(thatData)
				.enter().append("rect")
				.attr("class", "note")
				.attr("x", function(d) {
					return xScale(d);
				})
				.attr("y", -25)
				.attr("height", chartHeight/5)
				.attr("width", -2 + chartWidth / 13)
				.attr("fill", "lightblue")
				.attr("fill-opacity", 1);

			svg.selectAll("rect.fixed")
				.data(fixedData)
				.enter().append("rect")
				.attr("class", "fixed note")
				.attr("x", function(d) {
					return xScale(d);
				})
				.attr("y", 0)
				.attr("height", chartHeight)
				.attr("width", -2 + chartWidth / 13)
				.attr("fill", "blue")
				.attr("fill-opacity", 0.5);


		};

		this.reset = function() {
			drawFixed();
			drawMovable();
			svg.selectAll("rect.note").remove();
		};

		this.getThat = function() {
		   var that = [];
		   that = fixedData.concat(movableData).sort(function(a,b) {return a-b;});	
		   return that;
		};

	};

	return Display;
});