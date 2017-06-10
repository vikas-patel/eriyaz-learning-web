define(['d3', './scorer', './songs'], function(d3, scorer, songs) {
	var Display = function(dragCallback) {

		var margin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};

		var chartWidth = 600,
			chartHeight = 200;


		var refreshTime = 40;


		var slotsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var labelsData = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N", "S'"];

		var yMin = -5;
		var yMax = 18;
		var nYDivs = yMax - yMin;
		var xDivs = 6;
		var t0, t1;
		var yScale = d3.scale.linear()
			.domain([yMin, yMax])
			.range([chartHeight, 0]);

		var xScale = d3.scale.linear()
			.domain([0, xDivs])
			.range([0, chartWidth]);

		var timeScale = d3.scale.linear()
			.domain([0, 1])
			.range([0, chartWidth / xDivs]);

		var svg = d3.select("#display").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 " + (chartWidth + margin.left + margin.right) + " " + (chartHeight + margin.top + margin.bottom))
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

		// var zoomListener = d3.behavior.zoom()
		//   .scaleExtent([1, 1])
		//   .on("zoom", zoomHandler);
		// svg.call(zoomListener);
		// // function for handling zoom event
		// function zoomHandler() {
		// 	console.log(d3.event);
		//   	velocity.attr("transform", "translate(" + d3.event.translate[0] + ",0)");
		// };

		function dragStart() {
		    var p = d3.mouse(this);
		    selectionRect.init(p[0], p[1]);
			selectionRect.removePrevious();
		}

		function dragMove() {
			var p = d3.mouse(this);
		    selectionRect.update(p[0], p[1]);
		    // attributesText
		    // 	.text(selectionRect.getCurrentAttributesAsText());
		}

		function dragEnd() {
			var finalAttributes = selectionRect.getCurrentAttributes();
			if(finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1){
				// range selected
				d3.event.sourceEvent.preventDefault();
				selectionRect.focus();
				t0 = selectionRect.getCurrentTime()[0];
				t1 = selectionRect.getCurrentTime()[1];
				dragCallback(t0, t1);
			} else {
		        // single point selected
		        selectionRect.remove();
		        // trigger click event manually
		    }
		}

		var dragBehavior = d3.behavior.drag()
		    .on("drag", dragMove)
		    .on("dragstart", dragStart)
		    .on("dragend", dragEnd);

		svg.call(dragBehavior);

		var selectionRect = {
			element			: null,
			previousElement : null,
			currentY		: chartHeight,
			currentX		: 0,
			originX			: 0,
			originY			: 0,
			setElement: function(ele) {
				this.previousElement = this.element;
				this.element = ele;
			},
			getNewAttributes: function() {
				var x = this.currentX<this.originX?this.currentX:this.originX;
				var y = this.currentY<this.originY?this.currentY:this.originY;
				var width = Math.abs(this.currentX - this.originX);
				var height = Math.abs(this.currentY - this.originY);
				return {
			        x       : x,
			        y       : y,
			        width  	: width,
			        height  : chartHeight
				};
			},
			getCurrentTime: function() {
				var attrs = this.getCurrentAttributes();
				var t0 = timeScale.invert(attrs.x1)
				var t1 = timeScale.invert(attrs.x2);
				return [t0, t1];
			},
			getCurrentAttributes: function() {
				// use plus sign to convert string into number
				var x = +this.element.attr("x");
				var y = +this.element.attr("y");
				var width = +this.element.attr("width");
				var height = +this.element.attr("height");
				return {
					x1  : x,
			        y1	: y,
			        x2  : x + width,
			        y2  : y + height
				};
			},
			getCurrentAttributesAsText: function() {
				var attrs = this.getCurrentAttributes();
				return "x1: " + attrs.x1 + " x2: " + attrs.x2 + " y1: " + attrs.y1 + " y2: " + attrs.y2;
			},
			init: function(newX, newY) {
				var rectElement = svg.append("rect")
				    .attr({
				        x       : 0,
				        y       : 0,
				        width   : 0,
				        height  : 0,
				        opacity : 0.1
				    }).style("fill", "blue")
				    //.style("stroke-width", "0")
				    .classed("selection", true);
			    this.setElement(rectElement);
				this.originX = newX;
				//this.originY = newY;
				this.update(newX, newY);
			},
			update: function(newX, newY) {
				this.currentX = newX;
				this.currentY = newY;
				this.element.attr(this.getNewAttributes());
			},
			focus: function() {
		        // this.element
		        //     .style("stroke", "#DE695B")
		        //     .style("stroke-width", "2.5");
		    },
		    remove: function() {
		    	this.element.remove();
		    	this.element = null;
		    },
		    removePrevious: function() {
		    	if(this.previousElement) {
		    		this.previousElement.remove();
		    	}
		    }
		};

		this.getCurrentTime = function() {
			return selectionRect.getCurrentTime();
		}

		this.loadExercise = function(excData) {
			svg.selectAll("rect.exc").remove();
			svg.selectAll("text").remove();
			// draw label
			var textX = xScale(0);
			svg.selectAll("text")
				.data(excData)
				.enter()
				.append("text")
				.attr("x", function(d) {
					textX += xScale(d.beats);
					return textX - xScale(d.beats/2);
				})
				.attr("y", function(d) {
					return yScale(d.note + 1.5);
				})
				.style("text-anchor", "middle")
				.text(function(d) {
					return d.label;
				});

			var x = xScale(0);
			svg.selectAll("rect.exc")
				.data(excData)
				.enter().append("rect")
				.attr("x", function(d) {
					x += xScale(d.beats);
					return x - xScale(d.beats);
				})
				.attr("class", "exc")
				.attr("y", function(d) {
					return yScale(d.note + 1);
				})
				.attr("height", chartHeight / nYDivs)
				.attr("width", function(d) {
					return chartWidth*d.beats/xDivs;
				})
				.attr("fill", "#8064c6")
				.attr("fill-opacity", 1);

		};

		var pointGroup = velocity.append("g");
		this.markPitch = function(interval, time) {
			pointGroup.append("rect")
				.attr("x", timeScale(time))
				.attr("y", yScale(interval) - chartHeight / (2 * nYDivs))
				//.attr("y", yScale(currCents) - height / 19 / 2)
				.attr("width", 2)
				.attr("height", 2);
		};

		this.markPitchFeedback = function(interval, time, status) {
			pointGroup.append("rect")
				.attr("x", timeScale(time))
				.attr("y", yScale(interval) - chartHeight / nYDivs)
				.attr("height", chartHeight / nYDivs)
				// .attr("y", yScale(interval * 100))
				.attr("width", 3)
				// .attr("height", 20)
				.attr("fill", function() {
					if (status === scorer.statuses.SPOT_ON)
						return "green";
					else if (status === scorer.statuses.NEAR_MISS)
						return "yellow";
					else return "red";
				})
				.attr("opacity", 0.5);
		};

		this.clearPitchMarkers = function() {
			pointGroup.remove();
			pointGroup = svg.append("g");
		};
		this.clearPlayMarkers = function() {
			svg.selectAll("rect.playRect").remove();
		};

		this.clearIndicator = function() {
			svg.selectAll("line.indicator").remove();
		};

		this.setTimeUnit = function(duration) {
			timeScale = d3.scale.linear()
							.domain([0, duration])
							.range([0, chartWidth /xDivs]);
		};

		this.clear = function() {
			if (pointGroup)
				pointGroup.remove();
			this.clearFlash();
			svg.selectAll("rect.ans").remove();
			svg.selectAll(".playRect").remove();
			svg.selectAll("line.indicator").remove();
		};

		this.clearPoints = function() {
			svg.selectAll("rect.play").remove();
			svg.selectAll("rect.sing").remove();
		};

		this.clearUserPoints = function() {
			svg.selectAll("rect.sing").remove();
			velocity.attr("transform", "translate(0,0)");
		};

		this.playAnimate = function(interval, beatDuration, noteNum, beats) {
			var color = "#FFCCCC";

			var playRect = svg.append("rect")
				.attr("class", "playRect")
				.attr("x", xScale(noteNum))
				.attr("y", yScale(interval) - chartHeight / nYDivs)
				.attr("height", chartHeight / nYDivs - 1)
				.attr("width", 0)
				.style("fill", color);
			//.attr("opacity", 0.5);

			playRect
				.transition()
				.duration(beatDuration*beats)
				.ease("linear")
				.attr("width", beats*chartWidth / xDivs);

		};

		this.drawDivideLine = function(totalBeats) {
			svg.selectAll("line.divide").remove();
			velocity.append("line")
				 .attr("x1", xScale(totalBeats))
				 .attr("y1", yScale(yMax))
				 .attr("x2", xScale(totalBeats))
				 .attr("y2", yScale(yMin))
				 .attr("stroke-width", 1)
				 .attr("stroke-opacity", 0.5)
				 .attr("stroke", 'blue')
				 .attr("class", "divide");
			velocity.append("line")
				 .attr("x1", xScale(totalBeats*2))
				 .attr("y1", yScale(yMax))
				 .attr("x2", xScale(totalBeats*2))
				 .attr("y2", yScale(yMin))
				 .attr("stroke-width", 1)
				 .attr("stroke-opacity", 0.5)
				 .attr("stroke", 'blue')
				 .attr("class", "divide");
		}

		this.drawIndicator = function(noteNum, beatDuration, beats, maxNote, minNote, totalBeats) {
			svg.selectAll("line.indicator").remove();
			var singIndicator = velocity.append("line")
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
			// if (totalBeats > xDivs) {
			// 	var shift = (totalBeats - xDivs)*(noteNum+1)/totalBeats;
			// 	velocity
			// 		.transition()
			// 		.duration(beatDuration)
			// 		.ease("linear")
			// 		.attr("transform", "translate(-"+ (xScale(shift)) +",0)");
			// }
		};

		this.plotData = function(data, offset, factor) {
			var color = "green";
			pointGroup = velocity.append("g");
			pointGroup.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "sing")
				.attr("x", function(d, i) {
					return xScale(i * 256 / 48000) + timeScale(t0);
				}).attr("y", function(d) {
					return yScale(d);
				}).attr("width", 1)
				.attr("height", 1)
				.style("fill", color);
		};

		this.plotExerciseData = function(arrayTime, arrayPitch, offset, factor, withSing) {
			pointGroup = velocity.append("g");
			var x0 = arrayTime[0];
			pointGroup.selectAll("rect")
				.data(arrayTime)
				.enter()
				.append("rect")
				.attr("class", function(){ 
							if (withSing)
								return "sing";
							else
								return "play";
						})
				.attr("x", function(d, i) {
					return xScale((d-x0)+offset);
				}).attr("y", function(d, i) {
					return yScale(arrayPitch[i]);
				}).attr("width", 1)
				.attr("height", 1)
				.style("fill", "grey");
		}
	};

	return Display;
});