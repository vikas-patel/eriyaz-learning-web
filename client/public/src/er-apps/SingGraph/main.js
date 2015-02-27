define(['./module', 'jquery', 'require', './referencechart', 'mic', 'audiobuffer', './intensityfilter', './score', './framecontroller',
	  //'countdown', 
	  'webaudio-tools', './tone', 'waveletpitch'],
	function(app, $, Require, ReferenceChart, MicUtil, AudioBuffer, IntensityFilter, Score, Controller) {
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
		// reset variables
		var stopped = true;

		var score;
		var controller;
		var countDown;
		var countDownDisplayed = false;
		var countDownProgress = false;
		var maxNotes = 5;
		app.controller('SingGraphCtrl', function($scope, PitchModel, DialModel) {
			init($scope);
			loadExercises($scope);
			$scope.operation = 'start';
			$scope.showOverlay = false;
			$scope.lastScore = 0;
			$scope.totalScore = 0;
			$scope.scoreCount = 0;
			$scope.partNumber = 0;
			$scope.startOrPause = function(){
				if (!$scope.myExercise) {
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

			$scope.selectExercise = function () {
				setExercise($scope);
				score.reset();
				countDownDisplayed = false;
			}

			 $scope.stop = function() {
			 	$scope.operation = 'start';
			 	reset($scope);
			 }

			 $scope.isDisabled = function () {
			 	if ($scope.operation === 'start') return true;
			 	return false;
			 }

			 $scope.next = function() {
			 	$scope.showOverlay = false;
				score.reset();
				var index = $scope.exercises.indexOf($scope.myExercise);
				$scope.myExercise = $scope.exercises[index+1];
				setExercise($scope);
				// start again
				countDownDisplayed = false;
				stopped = true;
			 }

			 $scope.closeOverlay = function() {
			 	$scope.showOverlay = false;
			 }

			 $scope.restart = function() {
			 	$scope.showOverlay = false;
			 	reset($scope);
				start();
			 }

			 $scope.$on('chartOver',function() {
			 	++$scope.partNumber;
			 	if ($scope.partNumber*maxNotes < $scope.myExercise.sequence.length) {
					chart.setExercise(controller.getExercisePart($scope.myExercise, $scope.partNumber, maxNotes));
				} else {
					stopped = true;
	               	$scope.showOverlay = true;
	               	$scope.$apply();
				}
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
			controller = Controller.getController();
			//$('#play-again').click(restart);
			//$('#next-exercise').click(next);
			//$('#close-overlay').click(closeOverlay);
			//exerciseWidget($scope);

		};
		
		function startCountdown(callback) {
			countDown = new $.GameCountDown({readymessage:"Go", callback: callback});
			//GameCountDown = new jQuery.GameCountDown();
			countDown.Add({control: '#counter', seconds: 4});
		};

		function loadExercises($scope) {
			var url = Require.toUrl("./exercises.json");
			var jqxhr = $.getJSON(url, function(data) {
				console.log(data);
				$scope.exercises = data;
			})
			.fail(function(jqXHR, textStatus, errorThrown) { 
					alert('getJSON request failed! ' + textStatus);
					console.log(errorThrown);
			});
		}

		function setExercise($scope) {
			$scope.partNumber = 0;
			var sequences = controller.getExercisePart($scope.myExercise, $scope.partNumber, maxNotes);
			chart.setExercise(sequences);
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


		// Reset game to original state
		function reset($scope) {
			score.reset();
			// Destroy html element doesn't cancel timeout event.
			chart.pauseIndicatorLine();
			setExercise($scope);
			//controller.reset();
			//chart.drawExercise();
			// start again
			countDownDisplayed = false;
			stopped = true;
		}

		// Control Panel Events
		function pause() {
			chart.pause();
		}
		
		function resume() {
			chart.resume();
		}
		
		function setRoot() {
			rootFreq = currFreq;
		}
		
	});