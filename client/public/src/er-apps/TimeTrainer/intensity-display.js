define([], function() {

	var IntensityDisplay = function() {
		var margin = {
			top: 10,
			right: 20,
			bottom: 10,
			left: 15
		};

		var width = 600;
		var height = 100;




		var xScale = d3.time.scale()
			.domain([0, 0.3])
			.range([0, width]);

		// var yScale = d3.scale.linear()
		// 	.domain([-500, 1300])
		// 	.range([height, 0]);
		var svg = d3.select("#intensityDiv").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		this.showIntensity = function(intensity) {
			svg.selectAll("rect").remove();
			svg.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",xScale(intensity))
			.attr("height",height)
			.attr("fill","grey");	
		};
	};
	
	return IntensityDisplay;

});