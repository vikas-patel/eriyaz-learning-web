define(['./chart', 'd3', 'webaudioplayer', 'note', 'melody'], function(Chart, d3, Player, Note, Melody) {
	//constant
	var rectW = 5;
	var ExerciseChart = function(containerId, $scope, parentWidth, parentHeight, labels){
		this.parent = Chart.Class;
		// super constructor
		this.parent.call(this, containerId, parentWidth, parentHeight, labels);
		this.$scope = $scope;
		this.transitionDuration = 0;
		this.transitionDelay = 5000; //ms
		this.offsetTime = 1000;
	};
	
	ExerciseChart.prototype = Object.create(Chart.Class.prototype);
	
	ExerciseChart.prototype.constructor = ExerciseChart;
	
	ExerciseChart.prototype.start = function() {
		this.parent.prototype.start.call(this);
		this.drawIndicatorLine();
		this.startTransition();
	}

	ExerciseChart.prototype.pause = function() {
		if (this.isPaused) return;
		this.parent.prototype.pause.call(this);
		this.pauseIndicatorLine();
		this.pauseTransition();
	}

	ExerciseChart.prototype.play = function(context, root) {
		this.instrumentProgress = true;
		var player = new Player(context);
		var sequences = this.exercise;
		var melody = new Melody();
		$.each(sequences, function(idx, sequence) {
			var note = Note.createFromMidiNum(root + +sequence.pitch, +sequence.duration);
			melody.addNote(note);
		});
		player.playMelody(melody, this.offsetTime);
		this.drawIndicatorLine();
	}
	
	ExerciseChart.prototype.resume = function() {
		if (!this.isPaused) return;
		this.parent.prototype.resume.call(this);
		this.resumeIndicatorLine();
		this.resumeTransition();
	}
	
	ExerciseChart.prototype.drawIndicatorLine = function() {
		var callback;
		var color;
		var chart = this;
		if (this.instrumentProgress) {
			var chart = this;
			callback = function(){
				chart.instrumentPlayed = true; 
				chart.instrumentProgress = false;
				//d3.selectAll("line.indicatorLine").remove();
			};
			color = 'black';
		} else {
			callback = function () { chart.$scope.$broadcast('chartOver'); };
			color = 'red';
		}
		this.indicatorLine = this.svg.velocity.append("line")
								 .attr("x1", 0)
								 .attr("y1", this.y(-12))
								 .attr("x2", 0)
								 .attr("y2", this.y(25))
								 .attr("stroke-width", 1)
								 .attr("stroke", color)
								 .attr("class", "indicatorLine");
		var duration = this.duration + this.offsetTime;
		this.indicatorLine.transition()
				.duration(duration)
				.delay(0)
				.ease("linear")
				.attr("transform", "translate(" + this.x(duration/1000) +",0)")
				.each("end", callback);
	}

	ExerciseChart.prototype.resumeIndicatorLine = function () {
		var duration = this.duration + this.offsetTime;
		this.indicatorLine.transition()
				.duration(duration - this.getTimeRendered())
				.delay(0)
				.ease("linear")
				.attr("transform", "translate(" + this.x(duration/1000) +",0)")
				.each("end", this.onExerciseEnd);
	}
	
	ExerciseChart.prototype.setExercise = function(exercise, onExerciseEnd) {
		this.exercise = exercise;
		this.onExerciseEnd = onExerciseEnd;
		this.duration = this.getDuration();
		if (this.duration > this.settings.timeSpan) {
			this.transitionDuration = this.duration - this.settings.timeSpan;	
		} else {
			this.transitionDuration = 0;
		}
		this.drawExercise();
	};

	ExerciseChart.prototype.getDuration = function() {
		var duration = 0;
		$.each(this.exercise, function(idx, note) {
			duration += +note.duration;
		});
		return duration;
	};
	
	ExerciseChart.prototype.drawExercise = function () {
		this.reset();
		
		var result = this.exercise;
		//console.info("result" + JSON.stringify(result));
		// delay at start
		var t1 = this.offsetTime;
		var y = this.y;
		var x = this.x;
		var rectH = this.height/this.settings.yTicks;
		this.svg.velocity.selectAll("rect.exercise")
			.data(result)
			.enter()
			.append("rect")
			.attr("x", function(d){ t1 = t1 + (+d.duration); return  x((t1-(+d.duration))/1000); })
			.attr("y", function(d){ return y(d.pitch) - rectH/2; })
			.attr("width", function(d){ return x(+d.duration/1000); })
			.attr("height", rectH)
			.attr("rx", rectH/2)
			.attr("ry", rectH/2)
			.attr("class", "exercise");
	};
	
	ExerciseChart.prototype.pauseTransition = function () {
		this.svg.velocity.transition().duration(0);
	}

	ExerciseChart.prototype.pauseIndicatorLine = function () {
		this.indicatorLine.transition().duration(0);
	}	
	
	ExerciseChart.prototype.getTimeRendered = function(){
		var d = new Date();
		var currentTime = d.getTime();
		return currentTime -this.startTime - this.pauseDuration;
	}
	
	ExerciseChart.prototype.resumeTransition = function () {
		var delay = this.transitionDelay - this.getTimeRendered();
		if (delay<0) delay = 0;
		var timeLeft = this.svg.velocity.attr("transitionTimeLeft");
		this.svg.velocity.transition()
				.duration(timeLeft)
				.delay(delay)
				.ease("linear")
				.attr("transform", "translate(-" + this.x(this.transitionDuration/1000) +",0)")
				.attr("transitionTimeLeft",0);
	}
	
	ExerciseChart.prototype.startTransition = function () {
		this.svg.velocity.attr("transitionTimeLeft",this.transitionDuration);
		this.svg.velocity.transition()
				.duration(this.transitionDuration)
				.delay(this.transitionDelay)
				.ease("linear")
				.attr("transform", "translate(-" + this.x(this.transitionDuration/1000) +",0)")
				.attr("transitionTimeLeft",0);
	};
	
	ExerciseChart.prototype.exerciseNote = function(time) {
		// remove start offset
		time = time - this.offsetTime;
		var timeTotal = 0;
		var sequences = this.exercise;
		for (var i in sequences) {
			var sequence = sequences[i];
			var duration = +sequence.duration;
			timeTotal += duration;
			if (time <= timeTotal) {
				return sequence.pitch;
			}
		}
		return null;
	}
	
	ExerciseChart.prototype.draw = function(currInterval) {
		var d = new Date();
		var intervalTime = d.getTime();
		this.timePlotted = intervalTime-this.startTime - this.pauseDuration;
		var diff = Math.abs(this.exerciseNote(this.timePlotted) - currInterval.toFixed(this.settings.precision))
		var rectH = this.height/this.settings.yTicks;
		this.svg.velocity.append("rect")
			.attr("x", this.x(this.timePlotted/1000))
			.attr("y", this.y(currInterval.toFixed(this.settings.precision)) - rectH/2)
			.attr("width", rectW)
			.attr("height", rectH)
			.style("fill", function() {
						if (diff==0) return "#2BB03B";//green perfect
						if (diff==1) return "#FBD295";// almost
						return "#E79797"; //red very far
						});
	};

    return {
        getChart: function(containerId, $scope, parentWidth, parentHeight, labels) {
			return new ExerciseChart(containerId, $scope, parentWidth, parentHeight, labels);
        }
    };
});