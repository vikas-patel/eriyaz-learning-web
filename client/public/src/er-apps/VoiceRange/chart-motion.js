define(['./module', 'chart', 'd3', 'webaudioplayer', 'note', 'melody'], function(app, Chart, d3, Player, Note, Melody) {
	var womanAxis = ["G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"];
	var manAxis = ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#"];
	var womanlabelsNote = ["G3#", "A3", "A3#", "B3", "C4", "C4#", "D4", "D4#", "E4",
	 "F4", "F4#", "G4", "G4#", "A4", "A4#", "B4", "C5", "C5#", "D5", "D5#", "E5",
	 "F5", "F5#", "G5", "G5#", "A5", "A5#"];
	 var manlabelsNote = ["B2", "C3", "C3#", "D3", "D3#", "E3", "F3", "F3#", "G3", "G3#", "A3", "A3#", "B3", "C4", "C4#", "D4", "D4#", "E4",
	 "F4", "F4#", "G4", "G4#", "A4", "A4#", "B4", "C5", "C5#", "D5", "D5#", "E5",
	 "F5", "F5#", "G5", "G5#", "A5", "A5#"];
	var exerciseHigh = {notes:[0, -100, 1, -100, 2, -100, 3, -100, 4, -100, 5, -100, 6, -100, 7, -100, 8, -100, 9, -100,
							10, -100, 11, -100, 12, -100, 13, -100, 14, -100, 15, -100, 16, -100, 
							17, -100, 18, -100, 19, -100, 20, -100, 21, -100, 22, -100, 23, -100, 24, -101], 
					noteDuration: 2000, breakDuration: 1000, 
					midBreakDuration: 100};
	var exerciseLow = {notes:[0, -100, -1, -100, -2, -100, -3, -100, -4, -100, -5, -100, -6, -100, -7, -100, -8, -100, -9, -100,
							-10, -100, -11, -100, -12, -101],
					noteDuration: 2000, breakDuration: 1000, 
					midBreakDuration: 100};
	var ChartMotion = function(containerId, $scope, parentWidth, parentHeight, labels){
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
		this.isTransitionStopped = true;
		this.countdownNumber = 2;
		chart = this;
	};
	
	ChartMotion.prototype = Object.create(Chart.Class.prototype);
	
	ChartMotion.prototype.constructor = ChartMotion;
	
	ChartMotion.prototype.start = function() {
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

	ChartMotion.prototype.redraw = function() {
		if (this.$scope.gender == "man") {
			this.settings.labels = manAxis;
			this.settings.labels12 = manlabelsNote;
		} else {
			this.settings.labels = womanAxis;
			this.settings.labels12 = womanlabelsNote;
		}
		
		this.parent.prototype.redraw.call(this);
		this.startTime = null;
		if (this.$scope.isHigh) {
			this.exercise = exerciseHigh;
		} else {
			this.exercise = exerciseLow;
		}
		this.drawExercise();
		this.duration = this.getDuration();
		this.setMelody();
		this.nextTick= this.offsetTime;
		this.nextBeatTime = 0;
		this.currentNote = null;
		this.isTransitionStopped = true;
	}

	function transitionFn(_elapsed) {
		if (chart.isTransitionStopped) return true;
		var distance = _elapsed;
		if (distance > chart.duration + chart.offsetTime) {
			chart.$scope.$broadcast('chartOver');
			return true;
		}
		//TODO: Stop condition
		chart.indicatorLine.attr("transform", "translate(" + chart.x(distance/1000) +",0)");
		// var totalDuration = (chart.duration + 2*chart.offsetTime - chart.settings.timeSpan)/(chart.duration + chart.offsetTime);
		//var groupLag = Math.min(distance*.2, chart.settings.timeSpan/2);
		chart.svg.velocity.attr("transform", "translate(-" + chart.x((0.9*distance)/1000) +",0)");

		// play instrument
		if (distance > chart.nextTick) {
			chart.currentNote = chart.melody.shift();
			chart.nextTick += chart.currentNote.duration;
			chart.player.playNote(chart.currentNote.freq, chart.currentNote.duration);
			if (chart.currentNote.freq <= 0) chart.$scope.$broadcast("note-change");
		}
		return false;
	}

	ChartMotion.prototype.setMelody = function() {
		this.melody = [];
		var melody = this.melody;
		var rootNote = this.$scope.rootNote;
		$.each(this.exercise.notes, function(idx, item) {
			var note;
			if (item == -100) {
				// don't play
				note = Note.createSilentNote(exerciseHigh.breakDuration);
			} else if (item == -101) {
				// don't play
				note = Note.createSilentNote(exerciseHigh.midBreakDuration);
			} else {
				note = Note.createFromMidiNum(rootNote + item, exerciseHigh.noteDuration);
			}
			melody.push(note);
		});
	}

	ChartMotion.prototype.getTimeRendered = function(){
		var d = new Date();
		var currentTime = d.getTime();
		return (currentTime -this.startTime);
	}

	app.directive('voiceRangeChart', function() {
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
					labels: womanAxis,
					labels12: womanlabelsNote,
					yTicks: 38,
					timeSpan:10000,
					precision: 0
				};
				var chart = new ChartMotion(element.attr('id'), scope, chartSettings);
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