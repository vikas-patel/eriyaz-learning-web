define(['d3'], function(d3) {
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
		this.reset();
	};
	
	Chart.prototype.reset = function() {
		//pause and resume
		this.pauseDuration = 0;
		this.startTime = null;
		this.started = false;
		this.lastIntervalTime = null;
		this.instrumentPlayed = false;
		this.instrumentProgress = false;
		// construct display elements
		this.createCanvas();
		this.createScale();
		this.createAxis();
		// group for moving points
		this.svg.velocity = this.svg.append("g");
	}
		
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
	
	Chart.prototype.start = function() {
		var d = new Date();
		this.startTime = d.getTime();
		this.started = true;
	}
	
	Chart.prototype.pause = function() {
		if (this.isPaused) return;
		this.isPaused = true;
		var d = new Date();
		this.pauseTime = d.getTime();
	};
	
	Chart.prototype.resume = function() {
		if (!this.isPaused) return;
		this.isPaused = false;
		var d = new Date();
		this.resumeTime = d.getTime();
		this.pauseDuration +=(this.resumeTime - this.pauseTime);
		//this.svg.selectAll('line.line').remove();
	};
	
	Chart.prototype.draw = function(currInterval) {
		var d = new Date();
		if (!this.lastIntervalTime) this.lastIntervalTime = this.startTime;
		if (!this.lastInterval) this.lastInterval = currInterval;
		var intervalTime = d.getTime();
		if (intervalTime-this.startTime > this.settings.timeSpan) {
			this.startTime = this.lastIntervalTime;
			this.spanNumber++;
			// Don't remove axis ticks, adding class name.
			this.svg.selectAll('line.line').remove();
		}
		this.svg.append("line")
			.attr("x1", this.x((this.lastIntervalTime - this.startTime)/1000))
			.attr("y1", this.y(this.lastInterval.toFixed(this.settings.precision)))
			.attr("x2", this.x((intervalTime - this.startTime)/1000))
			.attr("y2", this.y(currInterval.toFixed(this.settings.precision)))
			.attr("stroke-width", 1)
			.attr("class", "line")
			.attr("stroke", "blue");
		this.lastInterval = currInterval;
		this.lastIntervalTime = intervalTime;
	};
	
    return {
		Class: Chart,
        getChart: function(containerId, parentWidth, parentHeight, labels) {
            return new Chart(containerId, parentWidth, parentHeight, labels);
        }
    };
});