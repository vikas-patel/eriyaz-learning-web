define(['d3', './scorer', './songs', 'currentaudiocontext'], function(d3, scorer, songs, CurrentAudioContext) {
	var Display = function(dragCallback) {
		var audioContext = CurrentAudioContext.getInstance();
		var incr = 128;
		var margin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 10
		};

		var chartWidth = 600, chartHeight = 206;
		var miniWidth = chartWidth, miniHeight = 0;

		var refreshTime = 40;

		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];
		var scale = [0, 2, 4, 5, 7, 9, 11];

		var yMin = -5;
		var yMax = 18;
		var nYDivs = yMax - yMin;
		var xDivs = 6;
		var duration, brushW = miniWidth/4;
		var pitchSeries = [], timeSeries = [];
		var t0, t1, tShift = 0;
		var beats;
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
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var tickValues = [0, 2, 4, 5, 7, 9, 11];
		var beatValues = [];

		var xAxis = d3.svg.axis() 
			.scale(xScale)
			.orient("top")
			.innerTickSize([chartHeight])
			.outerTickSize([chartHeight])
			.tickValues(beatValues)
			// .ticks(xDivs)
			// .outerTickSize([10])
			// .outerTickSize([20])
			.tickFormat('')
			.tickSubdivide(true);

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.innerTickSize([chartWidth])
			.outerTickSize([chartWidth])
			// .ticks(nYDivs)
			.tickValues(tickValues)
			.tickFormat(customYFormat)
			// .outerTickSize([10])
			// .outerTickSize([20])
			//.tickFormat('')
			.tickSubdivide(true);

		this.setBeats = function (aBeats) {
			beats = aBeats;
			this.createBeatAxis();
		}

		this.createBeatAxis = function () {
			beatValues = beats.filter(function (value) {
				return value > tShift && value < tShift + xDivs;
			});
			xAxis.tickValues(beatValues);
			xScale.domain([tShift, tShift+xDivs]);
			xAxis.scale(xScale);
			xAxisGroup.call(xAxis);
		}

		this.createNoteAxis = function () {
			tickValues = [];
			tickValues.push(yMin);
			for (var i = yMin+1; i < yMax; i++) {
				var note =  ((i+12)%12);
				if (scale.indexOf(note) > -1) {
					tickValues.push(i);
				}
			}
			tickValues.push(yMax);
			yAxis.tickValues(tickValues);
			yAxisGroup.call(yAxis);

			yAxisGroup.selectAll("text")
						  .filter(function(d, i) {return d == 0 || d==12 || d==7})
						  .attr("fill", "#16a8f0");
			yAxisGroup.selectAll("line")
						  .filter(function(d, i) {return d == 0 || d==12 || d==7})
						  .attr("class", "highlight");
		}

		var xAxisGroup = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chartHeight + ")")
			.call(xAxis);

		var yAxisGroup = svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + chartWidth + ",0)")
			.call(yAxis);
		var velocity = svg.append("g");

        var mainBrushGroup = svg.append("g")
            .attr("class","mainBrushGroup");
        var gMainBrush = d3.select(".mainBrushGroup").append("g")
			      .attr("class", "brush");

        var mainBrush;
	    this.drawMainBrush = function() {
	    	mainBrush = d3.svg.brush()
		        .x(timeScale)
		        .extent([0, 1])
		        .on("brushend", mainBrushEnd);
			gMainBrush.call(mainBrush);
			gMainBrush.selectAll(".resize")
			      .append("line")
			      .attr("y2", chartHeight);

		    gMainBrush.selectAll(".resize")
		      .append("path")
		      .attr("d", d3.svg.symbol().type("triangle-up").size(20))
		      .attr("transform", function(d,i) { 
		        return i ? "translate(" + -4 + "," + (chartHeight/2) + ") rotate(-90)" : "translate(" + 4 + "," + (chartHeight/2) + ") rotate(90)"; 
		      });
	    	gMainBrush.selectAll("rect")
      			.attr("height", chartHeight);
	    }

      	display = this;

		this.setDuration = function(d) {
			duration = d;
			t0 = 0;
			t1 = 1;
			tShift = 0;
			dragCallback(t0 + tShift, t1 + tShift);
		}

		this.init = function(arrayPitch, arrayTime, lrc, aDuration, aScale) {
			pitchSeries = arrayPitch;
			timeSeries = arrayTime;
			this.lrc = lrc;
			this.setDuration(aDuration);
			scale = aScale;
			this.createNoteAxis();
			this.drawMainBrush();
			this.plotExerciseData(tShift);
		}

		var pointGroup = velocity.append("g");

		this.clearIndicator = function() {
			svg.selectAll("line.indicator").remove();
		};

		this.stopIndicator = function() {
			svg.selectAll("line.indicator").transition();
		};

		this.clear = function() {
			pointGroup.selectAll("rect").remove();
			svg.selectAll("line.indicator").remove();
		};

		this.clearPoints = function() {
			svg.selectAll("rect.play").remove();
			svg.selectAll("rect.sing").remove();
		};

		this.clearUserPoints = function() {
			svg.selectAll("rect.sing").remove();
			svg.selectAll("line.indicator").remove();
		};

		this.drawIndicator = function(beatDuration) {
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
				.attr("x2", timeScale(t1))
				.each("end", function(){singIndicator.remove();});;
		};

		this.plotData = function(data, factor, delay) {
			pointGroup.selectAll("rect.sing")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "sing")
			.attr("x", function(d, i) {
				return timeScale((i-delay) * incr / audioContext.sampleRate)*factor + timeScale(t0);
			}).attr("y", function(d) {
				return yScale(d);
			}).attr("width", 1)
			.attr("height", 1);
		};

		// this.plotMiniCurve = function() {
		// 	mini_xScale.domain([0, duration]);
		// 	miniGroup.selectAll("rect.play")
		// 		.data(timeSeries)
		// 		.enter()
		// 		.append("rect")
		// 		.filter(function(d, i) {return i%50==0 })
		// 		.attr("class", "play")
		// 		.attr("x", function(d, i) {
		// 			return mini_xScale(timeSeries[i*50]);// + offset
		// 		}).attr("y", function(d, i) {
		// 			return mini_yScale(pitchSeries[i*50]);
		// 		}).attr("width", 1)
		// 		.attr("height", 1)
		// 		.style("fill", "grey");
		// }

		this.plotExerciseData = function(shift) {
			pointGroup.selectAll("rect").remove();
			var ts = shift;
			var te = shift + xDivs;
			
			this.printLyrics(ts, te);
			
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
				.attr("height", 1);
		}

		this.printLyrics = function(ts, te) {
			svg.selectAll("text.lyrics").remove();
			if (!this.lrc.getLyrics()) {
				return;
			}
			var i = this.lrc.select(ts/2 + te/2);
			if (i < 0) return;
			var text = this.lrc.getLyric(i).text;
			this.setLyricsText(text);
		};

		var flash = svg.append("text")
				.attr("id", "flash")
				.attr("font-size", 15)
				.attr("x", chartWidth / 2)
				.attr("y", "1em")
				.attr("fill", "#F16236")
				.attr("text-anchor", "middle");
		this.setFlash = function(message) {
			flash.text(message);
		};

		this.clearFlash = function() {
			flash.text("");
		};

		this.setLyricsText = function(lyrics) {
				svg.append("text")
				.attr("class", "lyrics")
				.attr("x", chartWidth / 2)
				.attr("y", chartHeight - 5)
				// .attr("dy", function(){return (-lyrics.length+i+1) + "em";})
				.text(lyrics);
		};

    	this.seekbarMove = function(value, delta) {
    		tShift = value;
    		mainBrush.extent([t0 - delta, t1 - delta]);
    		gMainBrush.call(mainBrush);
    		display.plotExerciseData(value);
    	};

    	this.seekbarEnd= function(value) {
    		if (value != tShift) {
    			this.seekbarMove(value, value-tShift);
    		}
    		// tShift = value;
    		var extent = mainBrush.extent();
			t0 = extent[0];
			t1 = extent[1];
			display.createBeatAxis();
    	};

    	this.setMainBrushExtent = function(start, end) {
    		t0 = start;
    		t1 = end;
    		mainBrush.extent([t0, t1]);
    		gMainBrush.call(mainBrush);
    		dragCallback(t0 + tShift, t1 + tShift);
    	};

		function mainBrushEnd() {
			var extent = mainBrush.extent();
			t0 = extent[0];
			t1 = extent[1];
			dragCallback(t0 + tShift, t1 + tShift);
		}

		function customYFormat(yValue) {
			// var labels = ['Sa', '', 'Re', '', 'Ga', 'Ma', '', 'Pa', '', 'Dha', '', 'Ni', 'Sa'];
			if (yValue == yMin || yValue == yMax) return "";
			return labelsData[(12 + Math.round(yValue)) % 12];
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