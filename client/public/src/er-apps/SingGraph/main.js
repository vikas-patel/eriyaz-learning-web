define(['./module', 'jquery', './referencechart', 'mic', 'audiobuffer', './intensityfilter', './score', './framecontroller',
	  //'countdown', 
	  'webaudio-tools', './tone', 'waveletpitch'],
	function(app, $, ReferenceChart, MicUtil, AudioBuffer, IntensityFilter, Score, Controller) {
		//constants
		var adjustment = 1.088; //pitch adjustment to pitch.js determined pitch(incorrect by itself.)
		var labels1 = ["P1", "m2", "M2", "m3", "M3", "P4", "TR", "P5", "m6", "M6", "m7", "M7", "P1"];
		var labels2 = ["Sa", "Re'", "Re", "Ga'", "Ga", "Ma", "Ma''", "Pa", "Dha'", "Dha", "Ni'", "Ni", "Sa"];
		// added extra space to make unique value for domain map.
		var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni"];
		var labelsWestern = ["1", "2b", "2", "3b", "3", "4", "4#/5b", "5", "6b", "6", "7b", "7", "1"];

		//state variables. 
		var rootFreq = 110;
		// MIDI
		var root = 57; // Freq: 220
		var currFreq;
		var labels = labelsIndian;
		//other globals;
		var context;
		var chart;
		var buffer;
		var exercises;
		// reset variables
		var stopped = true;

		var score;
		var controller;
		var countDown;
		var countDownDisplayed = false;
		var countDownProgress = false;
		app.controller('SingGraphCtrl', function($scope, PitchModel, DialModel) {
			init($scope);
			$scope.operation = 'start';
			$scope.showOverlay = false;
			$scope.lastScore = 0;
			$scope.totalScore = 0;
			$scope.scoreCount = 0;
			$scope.startOrPause = function(){
				if (!chart.exercise) {
					alert("Please select exercise.");
					return;
				}
				switch($scope.operation) {
					case 'start': start();break;
					case 'pause': pause();break;
					case 'resume': resume();
				}
			    $scope.operation = ($scope.operation === 'start' || $scope.operation === 'resume') ? 'pause' : 'resume';
			  }

			 $scope.stop = function() {
			 	$scope.operation = 'start';
			 	reset();
			 }

			 $scope.isDisabled = function () {
			 	if ($scope.operation === 'start') return true;
			 	return false;
			 }

			 $scope.next = function() {
			 	$scope.showOverlay = false;
				score.reset();
				var index = $("#exerciseId")[0].selectedIndex;
				$('#exerciseId option')[++index].selected = true;
				var val = $('#exerciseId').val();
				setExercise(val);
				// start again
				countDownDisplayed = false;
				stopped = true;
			 }

			 $scope.closeOverlay = function() {
			 	$scope.showOverlay = false;
			 }

			 $scope.restart = function() {
			 	$scope.showOverlay = false;
			 	reset();
				start();
			 }

			 $scope.$on('exerciseOver',function() {
               	stopped = true;
               	$scope.showOverlay = true;
               	$scope.$apply();
				//showOverlay();
           	});
		});

		function init($scope) {
			initAudio();
			audioContext = window.AudioContext || window.webkitAudioContext;
			context = new audioContext();
			
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
			chart = ReferenceChart.getChart("chart-box", $scope, chartSettings);
			score = Score.getScore($scope);
			controller = Controller.getController(chart, $scope);
			//$('#play-again').click(restart);
			//$('#next-exercise').click(next);
			//$('#close-overlay').click(closeOverlay);
			exerciseWidget();

		};
		
		function startCountdown(callback) {
			countDown = new $.GameCountDown({readymessage:"Go", callback: callback});
			//GameCountDown = new jQuery.GameCountDown();
			countDown.Add({control: '#counter', seconds: 4});
		};
		
		function exerciseWidget() {
			var select = $('#exerciseId');
			select.append($('<option />').text("Select one...").val(""));
			var jqxhr = $.getJSON( "/eartonic-apps/SingGraph/exercises.json", function(data) {
				exercises = data;
				$.each(data, function(idx, exercise) {
					select.append($('<option />').text(exercise.name).val(exercise.name));
				});
				})
			  .fail(function(jqXHR, textStatus, errorThrown) { 
					alert('getJSON request failed! ' + textStatus);
					console.log(errorThrown);
			  });
			$('#exerciseId').on('change', function() {
				var val = $(this).val();
				if (!val) return;
				setExercise(val);
				score.reset();
				countDownDisplayed = false;
			});
		};

		function setExercise(val) {
			$.each(exercises, function(idx, exercise) {
				if (val == exercise.name) {
					controller.setExercise(exercise);
				}
			});
		}

		function play() {
			chart.play(context, root);
		}
		
		function start() {
			stopped = false;
			if (!buffer) {
				MicUtil.getMicAudioStream(
					function(stream) {
						buffer = new AudioBuffer(context, stream, 2048);
						buffer.addProcessor(processSignal);
					}
				);
			}
		};

		function processSignal(data) {
			if (chart.isPaused || stopped) return;
			//if (!displayCountDown()) return;
			
			if (!playInstrument()) return;

			if (!chart.started) {
				chart.start();
			}
			updatePitch(data);
		}

		function updatePitch(data) {
			
			var waveletFreq = 0;
			if (IntensityFilter.rootMeanSquare(data) > 0.01) {
				waveletFreq = dywapitch_computepitch(data);
			}
			// no tone
			if (waveletFreq == 0) return;
			currInterval = Math.round(1200 * (Math.log(waveletFreq / rootFreq) / Math.log(2))) / 100;
			chart.draw(currInterval);
			var expNote = chart.exerciseNote(chart.timePlotted);
			score.updateScore(expNote, currInterval.toFixed(0));
		}

		function playInstrument() {
			// Always play instrument.
			if (!$("#instrumentEnabled").prop("checked")) return true;
			if (chart.instrumentPlayed) return true;
			if (chart.instrumentProgress) return false;
			chart.play(context, root);
		}
		
		function displayCountDown() {
			if (countDownDisplayed) return true;
			if (countDownProgress) return false;
			countDownProgress = true;
			startCountdown(function(id){
				countDown.Remove('#counter');
				$('#counter').text("");
				countDownDisplayed = true;
				countDownProgress = false;
			});
		}
		
		function now(){
			var d = new Date();
			return d.getTime();
		}
		// Exercise over
		// function onEnd() {
		// 	stopped = true;
		// 	showOverlay();
		// }

		// Reset game to original state
		function reset() {
			score.reset();
			controller.reset();
			//chart.drawExercise();
			// start again
			countDownDisplayed = false;
			stopped = true;
		}

		// function showOverlay() {
		// 	$('#overlay-score').text(score.formatScore(score.totalScore));
		// 	$('#overlay-content').show();
		// 	$('#overlay').show();
		// }

		// function closeOverlay() {
		// 	$('#overlay-content').hide();
		// 	$('#overlay').hide();
		// 	$('#overlay-score').text("");
		// }

		// function next() {
		// 	closeOverlay();
		// 	score.reset();
		// 	var index = $("#exerciseId")[0].selectedIndex;
		// 	$('#exerciseId option')[++index].selected = true;
		// 	var val = $('#exerciseId').val();
		// 	setExercise(val);
		// 	// start again
		// 	countDownDisplayed = false;
		// 	stopped = true;
		// }
		
		// function restart() {
		// 	reset();
		// 	start();
		// }

		// Control Panel Events
		function pause() {
			chart.pause();
		}
		
		function resume() {
			chart.resume();
		}

		// function stop() {
		// 	reset();
		// }
		
		function setRoot() {
			rootFreq = currFreq;
		}
		
	});