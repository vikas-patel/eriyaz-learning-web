define(['./module', 'jquery', 'require', 'mic', 'audiobuffer', './score', './framecontroller', 'pitchdetector', 'note',
	  //'countdown', 
	  'webaudio-tools', './tone', 'wavelet-pitch'],
	function(app, $, Require, MicUtil, AudioBuffer, Score, Controller, PitchDetector, Note) {
		//constants
		var detector;
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
		var instrumentEnabled = true;
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
			$scope.rootNote = 49;
			$scope.signalOn = false;
			$scope.isInstrumentProgress = false;
			$scope.startOrPause = function(){
				if (!$scope.myExercise) {
					showToastMessage("Please Select Exercise.");
					$scope.toastMessageDisplayed = true;
					return;
				}
				if (!$scope.rootNote) {
					showToastMessage("Please Set Sa.");
					$scope.toastMessageDisplayed = true;
					return;
				}
				switch($scope.operation) {
					case 'start':
						if ($scope.signalOn) {
							start($scope);
						} else {
							startMic($scope);
						}
						break;
					case 'pause': $scope.$broadcast('pause');break;
					case 'resume': $scope.$broadcast('resume');
				}
			    $scope.operation = ($scope.operation === 'start' || $scope.operation === 'resume') ? 'pause' : 'resume';
			}

			$scope.$watch(function(scope) { return scope.myExercise },
              function() {if(!$scope.myExercise) return; setExercise($scope)}
             );

			$scope.$watch(function(scope) { return scope.rootNote },
              function() {
              	if(!$scope.rootNote) return; 
              	$scope.rootFreq = Note.numToFreq($scope.rootNote);
              }
             );

			$scope.$watch(function(scope) { return scope.signalOn},
              function() {
              	if (!scope.signalOn) return;
              		start(scope);
          		}
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
			 	if ($scope.isInstrumentProgress) {
			 		$scope.chart.drawExercise();
			 		start($scope);
			 		return;
			 	}
			 	++$scope.partNumber;
			 	if ($scope.partNumber*maxNotes < $scope.myExercise.sequence.length) {
					$scope.chart.setExercise(controller.getExercisePart($scope.myExercise, $scope.partNumber, maxNotes));
					start($scope);
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
			$scope.context = context;
			score = Score.getScore($scope);
			controller = Controller.getController();
			detector = PitchDetector.getDetector('wavelet',context.sampleRate);
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
			chart.play(context, $scope.rootNote);
		}

		function start($scope) {
			if (instrumentEnabled && !$scope.isInstrumentProgress) {
				$scope.isInstrumentProgress = true;
				$scope.$broadcast('start-instrument');
				showToastMessage("First Listen.");
			} else {
				$scope.isInstrumentProgress = false;
				$scope.$broadcast('start');
				showToastMessage("Sing Now.");
			}
		}
		
		function startMic($scope) {
			MicUtil.getMicAudioStream(
				function(stream) {
					buffer = new AudioBuffer(context, stream, 2048);
					buffer.addProcessor(processSignal);
					$scope.signalOn = true;
				}
			);
		};

		function processSignal(data) {
			// yet to start or paused.
			if (scope.operation === 'start' || scope.operation === 'resume' || 
				scope.operation === 'over' || scope.isInstrumentProgress == true) {
				return;
			}
			//if (!displayCountDown()) return;
			updatePitch(data);
		}

		function updatePitch(data) {
			
			var waveletFreq = detector.findPitch(data);
			if (waveletFreq == 0) return;
			currInterval = Math.round(1200 * (Math.log(waveletFreq / scope.rootFreq) / Math.log(2))) / 100;
			scope.chart.draw(currInterval);
			var expNote = scope.chart.exerciseNote(scope.chart.timePlotted);
			score.updateScore(expNote, currInterval.toFixed(0));
		}

		function playInstrument() {
			// Always play instrument.
			if (!instrumentEnabled) return true;
			if (scope.chart.instrumentPlayed) return true;
			if (scope.chart.instrumentProgress) return false;
			//scope.$broadcast('start-instrument');
			//scope.chart.play(context, scope.rootNote);
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
	});