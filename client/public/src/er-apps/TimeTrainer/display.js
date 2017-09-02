define([], function() {

	var Chart = function(displayTimeRange) {
		var margin = {
			top: 10,
			right: 20,
			bottom: 10,
			left: 15
		};

		var width = 600;
		var height = 300;




		var xScale = d3.time.scale()
			.domain([0, 4])
			.range([0, width]);

		var yScale = d3.scale.linear()
			.domain([-500, 1300])
			.range([height, 0]);


		var svg = d3.select("#chartdiv").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var note = true;
		var rest = false;
		var bar = [note,1,rest,1, note,1/4,note,2/4,note,2/4, note,3/4, note, 1];
		for(var i=0;i<9;i++) {
			svg.append("svg:line")
			.attr("class", "tick")
			.attr("x1", xScale(i))
			.attr("y1", 0)
			.attr("x2", xScale(i))
			.attr("y2", height);
		}

		var curX = 0;
		for(var j=0;j<bar.length-1;j=j+2) {
			if(bar[j]) {
				svg.append("rect")
				.attr("x",curX+1)
				.attr("y",height/4)
				.attr("width", xScale(bar[j+1])-2)
				.attr("height",height/2)
				.attr("fill","lightgrey");
			} 
			curX += xScale(bar[j+1]);
		}

		this.plotPulses = function(pulseTimes,startTime,beat) {
			svg.selectAll(".pulse").remove();
			for(var i=0;i<pulseTimes.length-1;i=i+2) {
				console.log((pulseTimes[i]-startTime-beat*0.002)*1000/beat);
				svg.append("rect")
				.attr("class","pulse")
				.attr("x",xScale((pulseTimes[i]-startTime-beat*0.002)*1000/beat))
				.attr("y",height*2/5)
				.attr("width", xScale((pulseTimes[i+1]-pulseTimes[i])*1000/beat))
				.attr("height",height/5)
				.attr("fill","grey");
			}
		};
	};
	
	return Chart;

});