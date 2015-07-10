define(['d3'], function(d3) {
	var rectW = 5;
	var saGreen = "#d4f5d5";
	var reKRed = "#FFFFFF";
	var reRed = "#ffdddc";
	var gaKGolden = "#FFFFFF";
	var gaGolden = "#ffedca";
	var maWhite = "#f3f3f3";
	var maTWhite = "#FFFFFF";
	var paBlue = "#dcecff";
	var dhaKYellow = "#FFFFFF";
	var dhaYellow = "#fafcbe";
	var niKMulti = "#FFFFFF";
	var niMulti = "#ffedff";
	
	var colors = [saGreen,reKRed,reRed,gaKGolden,gaGolden,maWhite,maTWhite,paBlue,dhaKYellow,dhaYellow,niKMulti,niMulti];
		
    var Chart = function(containerId, settings) {
		this.settings = settings;
		this.containerId = containerId;
		this.width = this.settings.width - this.settings.marginLeft - this.settings.marginRight;
		this.height = this.settings.height - this.settings.marginTop - this.settings.marginBottom;
		this.offsetTime = 2000;
		//this.redraw();
	};
	
	Chart.prototype.redraw = function() {
		// construct display elements
		this.createCanvas();
		this.createScale();
		this.createAxis();
		// group for moving points
		this.svg.velocity = this.svg.append("g");
		var zoomListener = d3.behavior.zoom()
		  .scaleExtent([1, 1])
		  .on("zoom", zoomHandler);
		this.svg.call(zoomListener);
		// function for handling zoom event
		velocityElement = this.svg.velocity;
		function zoomHandler() {
		  	velocityElement.attr("transform", "translate(" + d3.event.translate[0] + ",0)");
		};
	};
		
	Chart.prototype.createScale = function() {
		this.y = d3.scale.linear().domain([-12, 25]).range([this.height,0]);
		this.x = d3.scale.linear().domain([0, this.settings.timeSpan/1000]).range([0,this.width]);
	};
	
	Chart.prototype.createAxis = function() {
		this.x.axis = d3.svg.axis().scale(this.x).tickFormat(function(d) { return d; }).orient('bottom');
		this.svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.x.axis)
			.append("text")
			.attr("x", this.width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("Time (seconds)");

		var labels = this.settings.labels;
		var ticks = this.settings.yTicks;
		this.y.axis = d3.svg.axis().scale(this.y).ticks(ticks).tickFormat(function(d) { if (d<0) d += 12; return labels[d%12]; }).orient('left');
		this.svg.yg = this.svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0, 0)');
		
		this.svg.yg.call(this.y.axis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Note");
			
		var y = this.y;
		var h = this.height;
		var w = this.width;
		this.svg.yg.selectAll("rect")
			.data(this.y.ticks(ticks))
			.enter()
			.append("rect")
			.style("opacity", 1)
			.attr("x", function(d, i) {
				return 0;
			})
			.attr("y", function(d,i) {
				return y(d)-h/(2*(ticks-1));
			})
			.attr("height", function(d, i) {
				if (i==0) return h/(2*(ticks-1));
				return h/(ticks-1);
			})
			.attr("width", w)
			.attr("fill", function(d, i) {
				if (d<0) d +=12;
				return colors[d%12];
			});
	};
	
	Chart.prototype.createCanvas = function() {
		$('#'+this.containerId).html("");
		this.svgBox = d3.select('#'+this.containerId).append('svg');
		this.svg = this.svgBox
        .attr('class', 'svg-content')
        .attr('width', '100%')
        .attr('height', '100%')
        //.attr('width', this.width + this.settings.marginLeft + this.settings.marginRight)
        //.attr('height', this.height + this.settings.marginTop + this.settings.marginBottom)
		//.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 " + (this.width + this.settings.marginLeft + this.settings.marginRight) + " " + (this.height + this.settings.marginTop + this.settings.marginBottom))
		.append("g")
		.attr("transform", "translate(" + this.settings.marginLeft + "," + this.settings.marginTop + ")");
	};

	Chart.prototype.exerciseNote = function(time) {
		// remove start offset
		if (time < this.offsetTime) return -100;
		time = time - this.offsetTime;
		var timeTotal = 0;
		var notes = this.exercise.notes;
		var duration = 0;
	 	
		for (var i in notes) {
			var note = notes[i];
			if (note==-100)
				duration = this.exercise.breakDuration;
			else if (note==-101)
				duration = this.exercise.midBreakDuration;
			else
				duration = this.exercise.noteDuration;
			timeTotal += duration;
			if (time <= timeTotal) {
				return note;
			}
		}
		return -100;
	}

	Chart.prototype.draw = function(currInterval, renderTime) {
		var diff = Math.abs(this.exerciseNote(renderTime) - currInterval.toFixed(this.settings.precision))
		var rectH = this.height/this.settings.yTicks;
		this.svg.velocity.append("rect")
			.attr("x", this.x(renderTime/1000))
			.attr("y", this.y(currInterval.toFixed(this.settings.precision)) - rectH/2)
			.attr("width", rectW)
			.attr("height", rectH)
			.style("fill", function() {
						if (diff==0) return "#2BB03B";//green perfect
						if (diff==1) return "#FBD295";// almost
						return "#E79797"; //red very far
						});
	};

	Chart.prototype.drawIndicatorLine = function() {
		this.indicatorLine = this.svg.velocity.append("line")
								 .attr("x1", 0)
								 .attr("y1", this.y(-12))
								 .attr("x2", 0)
								 .attr("y2", this.y(25))
								 .attr("stroke-width", 1)
								 .attr("stroke", 'red')
								 .attr("class", "indicatorLine");
	}

	Chart.prototype.drawExercise = function () {
		var exercise = this.exercise;
		var result = this.exercise.notes;
		var labels12 = this.settings.labels12;
		//console.info("result" + JSON.stringify(result));
		// delay at start
		var t1 = this.offsetTime;
		var y = this.y;
		var x = this.x;
		var rectH = this.height/this.settings.yTicks;

		var textX=t1;
		this.svg.velocity.selectAll("text")
			.data(result)
			.enter()
			.append("text")
			.attr("x", function(d) {
				var duration = 0;
			 	if (d==-100) 
					duration = exercise.breakDuration;
				else if (d==-101)
					duration = exercise.midBreakDuration;
				else
					duration = exercise.noteDuration;
				textX = textX + duration;
				return x(textX-duration/2)/1000;
			})
			.attr("y", function(d) {
				return y(d)-rectH;
			})
			.style("text-anchor", "middle")
			.text(function(d) {
				if (d<0) 
					return "";
				else
					return labels12[d];
			});

		this.svg.velocity.selectAll("rect.exercise")
			.data(result)
			.enter()
			.append("rect")
			.attr("x", function(d){
				var duration = 0;
			 	if (d==-100) 
					duration = exercise.breakDuration;
				else if (d==-101)
					duration = exercise.midBreakDuration;
				else
					duration = exercise.noteDuration;
				t1 = t1 + duration;
				return x(t1-duration)/1000;
			})
			.attr("y", function(d){
				// return y(d.pitch) - rectH/2;
				return y(d) - rectH/2;
			})
			.attr("width", function(d){
			 	var duration = 0;
			 	if (d == -100) 
					duration = exercise.breakDuration;
				else if (d == -101)
					duration = exercise.midBreakDuration;
				else
					duration = exercise.noteDuration;
				return x(duration/1000);
			 })
			.attr("height", function(d){
				if (d<-99) return 0;
				return rectH;
			})
			.attr("rx", rectH/2)
			.attr("ry", rectH/2)
			.attr("class", "exercise");
	};

	Chart.prototype.getDuration = function() {
		var duration = 0;
		var notes = this.exercise.notes;
		for (var i in notes) {
			var note = notes[i];
			if (note == -100) {
				duration += this.exercise.breakDuration;
			} else if (note == -101) {
				duration += this.exercise.midBreakDuration;
			} else {
				duration += this.exercise.noteDuration;
			}
		}
		return duration;
	};

    return {
		Class: Chart,
        getChart: function(containerId, parentWidth, parentHeight, labels) {
            return new Chart(containerId, parentWidth, parentHeight, labels);
        }
    };
});