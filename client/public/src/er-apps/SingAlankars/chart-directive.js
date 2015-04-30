define(['./module', './chart', 'd3', 'webaudioplayer', 'note', 'melody'], function(app, Chart, d3, Player, Note, Melody) {
	var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni"];
	var labels12 = ["Sa", "Re(k)", "Re", "Ga(k)", "Ga", "Ma", "Ma(t)", "Pa", "Dha(k)", "Dha", "Ni(k)", "Ni", "SA"];
	var rectW = 5;
	var chart;
	var ExerciseChart = function(containerId, $scope, parentWidth, parentHeight, labels){
		this.parent = Chart.Class;
		// super constructor
		this.parent.call(this, containerId, parentWidth, parentHeight, labels);
		this.$scope = $scope;
		this.offsetTime = 2000;
		this.nextTick= this.offsetTime;
		this.player = new Player($scope.context);
		this.beatDuration = 1000;
		this.nextBeatTime = 0;
		this.currentNote = null;
		this.isPlayInstrument = false;
		this.isTransitionStopped = true;
		this.countdownNumber = 2;
	};
	
	ExerciseChart.prototype = Object.create(Chart.Class.prototype);
	
	ExerciseChart.prototype.constructor = ExerciseChart;
	
	ExerciseChart.prototype.start = function() {
		this.parent.prototype.start.call(this);
		this.drawIndicatorLine();
		// transition
		this.isTransitionStopped = false;
		d3.timer(transitionFn);
		if (!this.$scope.stopSignal) {
			d3.timer(countdownFn);
		}
	}

	ExerciseChart.prototype.redraw = function() {
		this.parent.prototype.redraw.call(this);
		if (this.exercise) this.drawExercise();
		this.nextTick= this.offsetTime;
		this.nextBeatTime = 0;
		this.currentNote = null;
		this.isTransitionStopped = true;
	}

	// ExerciseChart.prototype.pause = function() {
	// 	if (this.isPaused) return;
	// 	this.parent.prototype.pause.call(this);
	// 	this.pauseIndicatorLine();
	// 	this.pauseTransition();
	// }
	
	ExerciseChart.prototype.resume = function() {
		if (!this.isPaused) return;
		this.parent.prototype.resume.call(this);
		this.resumeIndicatorLine();
		this.resumeTransition();
	}
	
	ExerciseChart.prototype.drawIndicatorLine = function() {
		var callback;
		var color = 'red';
		// if (this.isPlayInstrument) {
		// 	color = 'black';
		// }
		chart = this;
		//callback = function () { chart.$scope.$broadcast('chartOver'); };
		this.indicatorLine = this.svg.velocity.append("line")
								 .attr("x1", 0)
								 .attr("y1", this.y(-12))
								 .attr("x2", 0)
								 .attr("y2", this.y(25))
								 .attr("stroke-width", 1)
								 .attr("stroke", color)
								 .attr("class", "indicatorLine");
		var duration = this.duration + this.offsetTime;
	}

	function countdownFn(_elapsed) {
		if (!chart.nextCounter) {
			chart.nextCounter = chart.offsetTime/chart.countdownNumber;
			chart.$scope.countdownValue = chart.countdownNumber;
			chart.$scope.$apply();
			return false;
		}
		if (_elapsed > chart.nextCounter) {
			if (chart.$scope.countdownValue == "SING") {
				chart.$scope.countdownValue = "";
				chart.nextCounter = null;
				chart.$scope.$apply();
				return true;
			}
			chart.nextCounter += chart.offsetTime/chart.countdownNumber;
			--chart.$scope.countdownValue;
			if (chart.$scope.countdownValue == 0) {
				chart.$scope.countdownValue = "SING";
			}
			chart.$scope.$apply();
			return false;
		}
	}

	function transitionFn(_elapsed) {
		if (chart.isTransitionStopped) return true;
		if (_elapsed > chart.duration + chart.offsetTime) {
			chart.$scope.$broadcast('chartOver');
			return true;
		}
		chart.indicatorLine.attr("transform", "translate(" + chart.x(_elapsed/1000) +",0)");
		var totalDuration = (chart.duration + 2*chart.offsetTime - chart.settings.timeSpan)/(chart.duration + chart.offsetTime);
		chart.svg.velocity.attr("transform", "translate(-" + chart.x((totalDuration*_elapsed)/1000) +",0)");
		if (_elapsed > chart.nextBeatTime) {
			chart.player.playBeat();
			chart.nextBeatTime += chart.beatDuration;
		}
		// play instrument
		if (chart.isPlayInstrument && _elapsed > chart.nextTick) {
			chart.currentNote = chart.melody.shift();
			chart.nextTick += chart.currentNote.duration;
			chart.player.playNote(chart.currentNote.freq, chart.currentNote.duration);
		}
		return false;
	}

	ExerciseChart.prototype.setExercise = function(exercise) {
		this.isPlayInstrument = false;
		this.exercise = exercise;
		this.duration = this.getDuration();
		this.melody = [];
		melody = this.melody;
		var rootNote = this.$scope.user.settings.rootNote;
		$.each(exercise.notes, function(idx, item) {
			var note;
			if (item == -1) {
				// don't play
				note = Note.createSilentNote(exercise.breakDuration);
			} else if (item == -2) {
				// don't play
				note = Note.createSilentNote(exercise.midBreakDuration);
			} else {
				note = Note.createFromMidiNum(rootNote + item, exercise.noteDuration);
			}
			melody.push(note);
		});
	};

	ExerciseChart.prototype.getDuration = function() {
		var duration = 0;
		var notes = this.exercise.notes;
		for (var i in notes) {
			var note = notes[i];
			if (note == -1) {
				duration += this.exercise.breakDuration;
			} else if (note == -2) {
				duration += this.exercise.midBreakDuration;
			} else {
				duration += this.exercise.noteDuration;
			}
		}
		return duration;
	};
	
	ExerciseChart.prototype.drawExercise = function () {
		var exercise = this.exercise;
		var result = this.exercise.notes;
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
			 	if (d==-1) 
					duration = exercise.breakDuration;
				else if (d==-2)
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
			 	if (d==-1) 
					duration = exercise.breakDuration;
				else if (d==-2)
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
			 	if (d == -1) 
					duration = exercise.breakDuration;
				else if (d == -2)
					duration = exercise.midBreakDuration;
				else
					duration = exercise.noteDuration;
				return x(duration/1000);
			 })
			.attr("height", function(d){
				if (d<0) return 0;
				return rectH;
			})
			.attr("rx", rectH/2)
			.attr("ry", rectH/2)
			.attr("class", "exercise");
	};
	
	ExerciseChart.prototype.getTimeRendered = function(){
		var d = new Date();
		var currentTime = d.getTime();
		return currentTime -this.startTime - this.pauseDuration;
	}
	
	ExerciseChart.prototype.exerciseNote = function(time) {
		// remove start offset
		if (time < this.offsetTime) return -1;
		time = time - this.offsetTime;
		var timeTotal = 0;
		var notes = this.exercise.notes;
		var duration = 0;
	 	
		for (var i in notes) {
			var note = notes[i];
			if (note==-1)
				duration = this.exercise.breakDuration;
			else if (note==-2)
				duration = this.exercise.midBreakDuration;
			else
				duration = this.exercise.noteDuration;
			timeTotal += duration;
			if (time <= timeTotal) {
				return note;
			}
		}
		return -1;
	}
	
	ExerciseChart.prototype.draw = function(currInterval, renderTime) {
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

	app.directive('ngSingAlankars', function() {
        return {
            link: function(scope, element) {
                var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				x = w.innerWidth || e.clientWidth || g.clientWidth,
				y = w.innerHeight|| e.clientHeight|| g.clientHeight;
				//x = 1000;
				var chartSettings = {
					width: x,
					height: 0.46*x,
					marginTop:20,
					marginRight:20,
					marginBottom:20,
					marginLeft:30,
					labels: labelsIndian,
					yTicks: 38,
					timeSpan:10000,
					precision: 0
				};
				var chart = new ExerciseChart(element.attr('id'), scope, chartSettings);
				scope.chart = chart;

				scope.$on('start',function() {
					chart.isPlayInstrument = false;
					chart.start();
				});

				scope.$on('start-instrument',function() {
					chart.isPlayInstrument = true;
					chart.start();
				});
            }
        };
    });
});