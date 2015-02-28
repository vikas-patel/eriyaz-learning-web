define(['./module', 'jquery', 'require', 'mic', 'audiobuffer', './intensityfilter', './score', './framecontroller',
	  //'countdown', 
	  'webaudio-tools', './tone', 'waveletpitch'],
	function(app, $, Require, MicUtil, AudioBuffer, IntensityFilter, Score, Controller) {
		//constants
		var adjustment = 1.088; //pitch adjustment to pitch.js determined pitch(incorrect by itself.)
		//state variables. 
		var rootFreq = 110;
		// MIDI
		var root = 57; // Freq: 220
		var currFreq;
		//other globals;
		var context;
		var chart;
		var buffer;

		var score;
		var controller;
		var countDown;
		var countDownDisplayed = false;
		var countDownProgress = false;
		var maxNotes = 5;
		var scope;
		var instrumentEnabled = false;
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
					showToastMessage("Please Select Exercise.");
					$scope.toastMessageDisplayed = true;
					return;
				}
				switch($scope.operation) {
					case 'start': start($scope);break;
					case 'pause': $scope.$broadcast('pause');break;
					case 'resume': $scope.$broadcast('resume');
				}
			    $scope.operation = ($scope.operation === 'start' || $scope.operation === 'resume') ? 'pause' : 'resume';
			}

			$scope.$watch(function(scope) { return scope.myExercise },
              function() {if(!$scope.myExercise) return; setExercise($scope)}
             );

			 $scope.reset = function() {
			 	$scope.operation = 'start';
			 	reset($scope);
			 }

			 $scope.next = function() {
			 	$scope.showOverlay = false;
				score.reset();
				var index = $scope.exercises.indexOf($scope.myExercise);
				$scope.myExercise = $scope.exercises[index+1];
				//setExercise($scope);
				// start again
				countDownDisplayed = false;
				$scope.operation = 'pause';
			 }

			 $scope.closeOverlay = function() {
			 	$scope.showOverlay = false;
			 }

			 $scope.restart = function() {
			 	$scope.showOverlay = false;
			 	reset($scope);
				$scope.operation = 'pause';
			 }

			 $scope.$on('chartOver',function() {
			 	++$scope.partNumber;
			 	if ($scope.partNumber*maxNotes < $scope.myExercise.sequence.length) {
					$scope.chart.setExercise(controller.getExercisePart($scope.myExercise, $scope.partNumber, maxNotes));
				} else {
					$scope.operation = 'over';
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
			// yet to start or paused.
			if (scope.operation === 'start' || scope.operation === 'resume' || scope.operation === 'over') {
				return;
			}
			//if (!displayCountDown()) return;
			
			if (!playInstrument()) return;

			if (!scope.chart.started) {
				showToastMessage("Sing Now.");
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
			if (!instrumentEnabled) return true;
			if (scope.chart.instrumentPlayed) return true;
			if (scope.chart.instrumentProgress) return false;
			showToastMessage("First Listen.");
			scope.chart.play(context, root);
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

		function showToastMessage(text) {
			document.querySelector('#toast-alert').setAttribute("text", text);
			document.querySelector('#toast-alert').show();
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
			$scope.operation = 'start';
		}
		
		function setRoot($scope) {
			rootFreq = currFreq;
		}
		
	});