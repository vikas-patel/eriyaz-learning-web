define(['./module', 'chart', 'd3', 'webaudioplayer', 'note', 'melody'], function(app, Chart, d3, Player, Note, Melody) {
	var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni"];
	var exercise = {notes:[0, 2, 4, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 
					noteDuration: 2000, breakDuration: 500, 
					midBreakDuration: 0};
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
		this.isPlayInstrument = false;
		this.isTransitionStopped = true;
		this.countdownNumber = 2;
		this.maxTempo = 60;
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
		this.parent.prototype.redraw.call(this);
		this.startTime = null;
		this.exercise = exercise;
		this.drawExercise();
		this.duration = this.getDuration();
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
		chart.svg.velocity.attr("transform", "translate(-" + chart.x((0.8*distance)/1000) +",0)");

		// play instrument
		if (chart.isPlayInstrument && distance > chart.nextTick) {
			chart.currentNote = chart.melody.shift();
			chart.nextTick += chart.currentNote.duration;
			chart.player.playNote(chart.currentNote.freq, chart.currentNote.duration/tempo);
		}
		return false;
	}

	ChartMotion.prototype.getTimeRendered = function(){
		var d = new Date();
		var currentTime = d.getTime();
		return (currentTime -this.startTime)*(this.$scope.tempo/this.maxTempo);
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
					labels: labelsIndian,
					yTicks: 38,
					timeSpan:10000,
					precision: 0
				};
				var chart = new ChartMotion(element.attr('id'), scope, chartSettings);
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