define(['d3', './scorer', './songs'], function(d3, scorer, songs) {
	var Display = function(dragCallback) {

		var margin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};

		var chartWidth = 600, chartHeight = 190;
		var miniWidth = 600, miniHeight = 40;

		var refreshTime = 40;

		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];

		var yMin = -5;
		var yMax = 18;
		var nYDivs = yMax - yMin;
		var xDivs = 6;
		var duration, brushW = miniWidth/4;
		var pitchSeries = [], timeSeries = [];
		var t0, t1, tShift = 0;
		var yScale = d3.scale.linear()
			.domain([yMin, yMax])
			.range([chartHeight, 0]);

		var xScale = d3.scale.linear()
			.domain([0, xDivs])
			.range([0, chartWidth]);

		var timeScale = d3.scale.linear()
			.domain([0, xDivs])
			.range([0, chartWidth]);

		var svg = d3.select("#display").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (chartWidth + margin.left + margin.right) + " " + (chartHeight + miniHeight + margin.top + margin.bottom))
			//.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var velocity = svg.append("g");
		
		var rect = svg.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",chartWidth)
			.attr("height",chartHeight)
			.attr("fill","none");// lightergrey F4F4F4

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top")
			.innerTickSize([chartHeight])
			.outerTickSize([chartHeight])
			.ticks(xDivs)
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("right")
			.innerTickSize([chartWidth])
			.outerTickSize([chartWidth])
			.ticks(nYDivs)
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chartHeight + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			// .attr("transform", "translate(0," + chartWidth + ")")
			.call(yAxis);
		var miniGroup = svg.append("g")
            .attr("class","miniGroup")
            .attr("transform","translate(" + 0 + "," + chartHeight + ")");

        var mainBrushGroup = svg.append("g")
            .attr("class","mainBrushGroup");
        var mainBrush = d3.svg.brush()
	        .x(timeScale)
	        .extent([0, 1])
	        .on("brushend", mainBrushEnd);
	    gMainBrush = d3.select(".mainBrushGroup").append("g")
	      .attr("class", "brush")
	      .call(mainBrush);
	      //.call(brush.move, [0, miniWidth/2]);

	    gMainBrush.selectAll("rect")
      		.attr("height", chartHeight);

    	var brushGroup = svg.append("g")
            .attr("class","brushGroup")
            .attr("transform","translate(" + 0 + "," + chartHeight + ")");

        var mini_xScale = d3.scale.linear().range([0, miniWidth]);
        mini_xScale.domain([0, miniWidth]);
	    var brush = d3.svg.brush()
	        .x(mini_xScale)
	        .extent([0, miniWidth/4])
	        .on("brush", brushmove)
	        .on("brushend", brushend);

	    //Set up the visual part of the brush
	    gBrush = d3.select(".brushGroup").append("g")
	      .attr("class", "brush")
	      .call(brush);
	      //.call(brush.move, [0, miniWidth/2]);

	    gBrush.selectAll("rect")
      		.attr("height", miniHeight);

      	// gBrush.call(brush.move, [10, 50]);
      	display = this;

      	function brushmove() {
    		var extent = brush.extent();
    		tShift = (duration - xDivs)*(extent[1] - brushW)/(miniWidth - brushW);
    		var d = timeScale(tShift);
    		display.plotExerciseData();
    		// velocity.attr("transform", "translate(-"+ (d) +",0)");
    	}

    	function brushend() {
    		dragCallback(t0 + tShift, t1 + tShift);
    	}

		function mainBrushEnd() {
			var extent = mainBrush.extent();
			t0 = extent[0];
			t1 = extent[1];
			dragCallback(t0 + tShift, t1 + tShift);
		}

		this.setDuration = function(d) {
			duration = d;
			t0 = 0;
			t1 = 1;
			dragCallback(t0 + tShift, t1 + tShift);
		}

		this.init = function(arrayPitch, arrayTime, d) {
			pitchSeries = arrayPitch;
			timeSeries = arrayTime;
			this.setDuration(d);
			this.plotExerciseData();
		}

		var pointGroup = velocity.append("g");
		this.markPitch = function(interval, time) {
			pointGroup.append("rect")
				.attr("x", timeScale(time))
				.attr("y", yScale(interval) - chartHeight / (2 * nYDivs))
				//.attr("y", yScale(currCents) - height / 19 / 2)
				.attr("width", 2)
				.attr("height", 2);
		};

		this.clearIndicator = function() {
			svg.selectAll("line.indicator").remove();
		};

		this.clear = function() {
			pointGroup.selectAll("rect").remove();
			svg.selectAll("line.indicator").remove();
		};

		this.clearPoints = function() {
			svg.selectAll("rect.play").remove();
			svg.selectAll("rect.sing1").remove();
			svg.selectAll("rect.sing2").remove();
		};

		this.clearUserPoints = function() {
			svg.selectAll("rect.sing1").remove();
			svg.selectAll("rect.sing2").remove();
		};

		this.drawIndicator = function(noteNum, beatDuration, beats, maxNote, minNote, totalBeats) {
			svg.selectAll("line.indicator").remove();
			var singIndicator = svg.append("line")
								 .attr("x1", timeScale(t0))
								 .attr("y1", yScale(yMax))
								 .attr("x2", timeScale(t0))
								 .attr("y2", yScale(yMin))
								 .attr("stroke-width", 1)
								 .attr("stroke", 'green')
								 .attr("class", "indicator");

			singIndicator
				.transition()
				.duration(beatDuration)
				.ease("linear")
				.attr("x1", timeScale(t1))
				.attr("x2", timeScale(t1));
		};

		this.plotData = function(data, offset, factor, withMusic) {
			if (withMusic) {
				pointGroup.selectAll("rect.sing1")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "sing1")
				.attr("x", function(d, i) {
					return xScale(i * 256 / 48000) + timeScale(t0);
				}).attr("y", function(d) {
					return yScale(d);
				}).attr("width", 1)
				.attr("height", 1)
				.style("fill", "green");
			} else {
				pointGroup.selectAll("rect.sing2")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "sing2")
				.attr("x", function(d, i) {
					return xScale(i * 256 / 48000) + timeScale(t0);
				}).attr("y", function(d) {
					return yScale(d);
				}).attr("width", 1)
				.attr("height", 1)
				.style("fill", "blue");
			}
			
			
		};

		this.plotExerciseData = function() {
			pointGroup.selectAll("rect").remove();
			var ts = tShift;
			var te = tShift + xDivs;
			var i0 = getIndex(ts, timeSeries);
			var i1 = getIndex(te, timeSeries);

			var subTSeries = timeSeries.slice(i0-1, i1-1);
            var subPSeries = pitchSeries.slice(i0-1, i1-1);

			pointGroup.selectAll("rect")
				.data(subTSeries)
				.enter()
				.append("rect")
				.attr("class", "play")
				.attr("x", function(d, i) {
					return timeScale((d-ts));// + offset
				}).attr("y", function(d, i) {
					return yScale(subPSeries[i]);
				}).attr("width", 1)
				.attr("height", 1)
				.style("fill", "grey");
		}

		function getIndex(t0, series) {
                var i = 0, j = series.length-1;
                var temp = 0;
                while (j-i > 1) {
                    temp = parseInt((i+j)/2);
                    if (series[temp] > t0) {
                        j = temp;
                    } else {
                        i = temp;
                    }
                    
                }
                return j;
            }
	};

	return Display;
});