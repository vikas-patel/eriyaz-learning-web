define(['./module', 'jquery', 'require', 'mic', 'audiobuffer', './intensityfilter', './score', './framecontroller',
	  //'countdown', 
	  'webaudio-tools', './tone', 'waveletpitch'],
	function(app, $, Require, MicUtil, AudioBuffer, IntensityFilter, Score, Controller) {
		//constants
		var adjustment = 1.088; //pitch adjustment to pitch.js determined pitch(incorrect by itself.)
		var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni"];

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
		var scope;
		app.controller('SingGraphCtrl', function($scope, PitchModel, DialModel) {
			scope = $scope;
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
					case 'start': start($scope);break;
					case 'pause': pause($scope);break;
					case 'resume': resume($scope);
				}
			    $scope.operation = ($scope.operation === 'start' || $scope.operation === 'resume') ? 'pause' : 'resume';
			}

			$scope.$watch(function(scope) { return scope.myExercise },
              function() {if(!$scope.myExercise) return; setExercise($scope)}
             );

			$scope.selectExercise = function () {
				// setExercise($scope);
				// score.reset();
				// countDownDisplayed = false;
				console.log('select exercise');
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
					$scope.chart.setExercise(controller.getExercisePart($scope.myExercise, $scope.partNumber, maxNotes));
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
			score = Score.getScore($scope);
			controller = Controller.getController();
		};
		
		function startCountdown(callback) {
			countDown = new $.GameCountDown({readymessage:"Go", callback: callback});
			//GameCountDown = new jQuery.GameCountDown();
			countDown.Add({control: '#counter', seconds: 4});
		};

		function loadExercises($scope) {
			var url = Require.toUrl("./exercises.json");
			var jqxhr = $.getJSON(url, function(data) {
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
			$scope.chart.setExercise(sequences);
		}

		function play() {
			chart.play(context, root);
		}
		
		function start($scope) {
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
			if (scope.chart.isPaused || stopped) return;
			//if (!displayCountDown()) return;
			
			if (!playInstrument()) return;

			if (!scope.chart.started) {
				scope.chart.start();
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
			scope.chart.draw(currInterval);
			var expNote = scope.chart.exerciseNote(scope.chart.timePlotted);
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
			$scope.chart.pauseIndicatorLine();
			setExercise($scope);
			// start again
			countDownDisplayed = false;
			stopped = true;
		}

		// Control Panel Events
		function pause($scope) {
			$scope.chart.pause();
		}
		
		function resume($scope) {
			$scope.chart.resume();
		}
		
		function setRoot($scope) {
			rootFreq = currFreq;
		}
		
	});