define(['./module', 'chart', 'd3', 'webaudioplayer', 'note', 'melody'], function(app, Chart, d3, Player, Note, Melody) {
	var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni"];
	var labels12 = ["Sa", "Re(k)", "Re", "Ga(k)", "Ga", "Ma", "Ma(t)", "Pa", "Dha(k)", "Dha", "Ni(k)", "Ni", "SA"];
	
	var chart;
	var ExerciseChart = function(containerId, $scope, parentWidth, parentHeight, labels){
		this.parent = Chart.Class;
		// super constructor
		this.parent.call(this, containerId, parentWidth, parentHeight, labels);
		this.$scope = $scope;
		// State variables
		this.nextTick= this.offsetTime;
		this.player = new Player($scope.context);
		this.beatDuration = 1000;
		this.nextBeatTime = 0;
		this.currentNote = null;
		this.isPlayInstrument = false;
		this.isTransitionStopped = true;
		this.countdownNumber = 2;
		this.maxTempo = 60;
		chart = this;
	};
	
	ExerciseChart.prototype = Object.create(Chart.Class.prototype);
	
	ExerciseChart.prototype.constructor = ExerciseChart;
	
	ExerciseChart.prototype.start = function() {
		var d = new Date();
		this.startTime = d.getTime();
		this.drawIndicatorLine();
		// transition
		this.isTransitionStopped = false;
		d3.timer(transitionFn);
		if (!this.$scope.stopSignal) {
			this.$scope.$broadcast('start-timer');
		}
	}

	ExerciseChart.prototype.redraw = function() {
		this.parent.prototype.redraw.call(this);
		this.startTime = null;
		if (this.exercise) this.drawExercise();
		this.nextTick= this.offsetTime;
		this.nextBeatTime = 0;
		this.currentNote = null;
		this.isTransitionStopped = true;
	}

	function transitionFn(_elapsed) {
		if (chart.isTransitionStopped) return true;
		var tempo = chart.$scope.tempo/chart.maxTempo;
		var distance = _elapsed*tempo;
		if (distance > chart.duration + chart.offsetTime) {
			chart.$scope.$broadcast('chartOver');
			return true;
		}
		chart.indicatorLine.attr("transform", "translate(" + chart.x(distance/1000) +",0)");
		var totalDuration = (chart.duration + 2*chart.offsetTime - chart.settings.timeSpan)/(chart.duration + chart.offsetTime);
		chart.svg.velocity.attr("transform", "translate(-" + chart.x((totalDuration*distance)/1000) +",0)");
		if (_elapsed > chart.nextBeatTime) {
			chart.player.playBeat();
			chart.nextBeatTime += chart.beatDuration/tempo;
		}
		// play instrument
		if (chart.isPlayInstrument && distance > chart.nextTick) {
			chart.currentNote = chart.melody.shift();
			chart.nextTick += chart.currentNote.duration;
			chart.player.playNote(chart.currentNote.freq, chart.currentNote.duration/tempo);
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
	
	ExerciseChart.prototype.getTimeRendered = function(){
		var d = new Date();
		var currentTime = d.getTime();
		return (currentTime -this.startTime)*(this.$scope.tempo/this.maxTempo);
	}

	app.directive('timer', ['$interval', function($interval) {
		return {
			link: function(scope, element, attr) {
				var count;
				function updateCounter() {
					if (count == "SING") {
						count = "";
					} else if (count == 1) {
						count = "SING";
					} else {
						count--;
					}
					element.text(count);
				}
				
				scope.$on('start-timer', function() {
					var interval = attr.offset/3*(60/scope.tempo);
					count = 4;
					updateCounter();
					$interval(function() {
						updateCounter();
					}, interval, 4);
				});
			}
		};
	}]);

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
					labels12: labels12,
					yTicks: 38,
					timeSpan:10000,
					precision: 0
				};
				var chart = new ExerciseChart(element.attr('id'), scope, chartSettings);
				chart.redraw();
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