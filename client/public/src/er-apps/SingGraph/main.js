define(['./module', 'jquery', './exercises', 'mic','currentaudiocontext','audiobuffer', 'pitchdetector', 'note',
		'tanpura'],
	function(app, $, exercises, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, Note, Tanpura) {
		//constants
		var detector;
		//other globals;
		var context;
		var chart;
		var buffer;
		var countDown;
		var countDownDisplayed = false;
		var countDownProgress = false;
		var maxNotes = 5;
		var tanpura;
		app.controller('SingGraphCtrl', function($scope, $rootScope, ScoreService, ExerciseService, User, $window) {
			init();
			// Load Exercises
			$scope.exercises = ExerciseService.findAll();
			$scope.operation = 'start';
			$scope.showSettings = false;
			$scope.showOverlay = false;
			$scope.lastScore = 0;
			$scope.totalScore = 0;
			$scope.scoreCount = 0;
			$scope.partNumber = 0;
			$scope.signalOn = false;
			$scope.isInstrumentProgress = false;
			$scope.user = User.get({id: $window.localStorage.userId}, function() {
				if (!$scope.user.settings || !$scope.user.settings.rootNote) {
					$scope.showSettings = true;
					return;
				}
				if ($scope.user.settings.isPlayTanpura) {
					startTanpura();
				}
			});
			$rootScope.$on('$stateChangeSuccess', 
				function(event, toState, toParams, fromState, fromParams){
					if (fromState.name == 'alankars') {
						stopTanpura();
					}
					if (toState.name == 'alankars' && $scope.user && $scope.user.settings
						&& $scope.user.settings.isPlayTanpura) {
						startTanpura();
					}
				});
			$scope.updateSettings = function() {
				$scope.user.$update(function() {
					$scope.showSettings = false;
					if ($scope.user.settings.isPlayTanpura) {
						startTanpura();
					} else {
						stopTanpura();
					}
				});
			}
			$scope.startOrPause = function(){
				if (!$scope.user.settings.rootNote) {
					$scope.showSettings = true;
					return;
				}
				
				if (!$scope.myExercise) {
					showToastMessage("Please Select Exercise.");
					$scope.toastMessageDisplayed = true;
					return;
				}
				$scope.rootFreq = Note.numToFreq($scope.user.settings.rootNote);
				switch($scope.operation) {
					case 'start':
						if ($scope.signalOn) {
							start();
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
              function() {
              	if(!$scope.myExercise) 
              		return; 
              	setExercise();
              	$scope.operation = 'start';
              });

			$scope.$watch(function(scope) { return scope.signalOn},
              function() {
              	if (!$scope.signalOn) return;
              		start();
          		}
             );

			 $scope.reset = function() {
			 	$scope.operation = 'start';
			 	reset();
			 }

			 $scope.next = function() {
			 	$scope.showOverlay = false;
				resetScore();
				var index = $scope.exercises.indexOf($scope.myExercise);
				$scope.myExercise = $scope.exercises[index+1];
				$scope.$apply();
				// start again
				countDownDisplayed = false;
				$scope.operation = 'pause';
				start();
			 }

			 $scope.closeOverlay = function() {
			 	$scope.showOverlay = false;
			 }

			 $scope.restart = function() {
			 	$scope.showOverlay = false;
			 	reset();
				$scope.operation = 'pause';
				start();
			 }

			 $scope.$on('chartOver',function() {
			 	if ($scope.isInstrumentProgress) {
			 		$scope.chart.redraw();
			 		start();
			 		return;
			 	}
			 	$scope.operation = 'over';
               	$scope.showOverlay = true;
               	$scope.$apply();
               	// save score at server.
               	ScoreService.save($scope.myExercise.name, $scope.totalScore);
	               	
			 // 	++$scope.partNumber;
			 // 	if ($scope.partNumber*maxNotes < $scope.myExercise.notes.length) {
				// 	$scope.chart.setExercise(ExerciseService.getSubset($scope.myExercise, $scope.partNumber, maxNotes));
				// 	$scope.chart.redraw();
				// 	start();
				// } else {
				// 	$scope.operation = 'over';
	   //             	$scope.showOverlay = true;
	   //             	$scope.$apply();
	   //             	// save score at server.
	   //             	ScoreService.save($scope.myExercise._id, $scope.totalScore);
				// }
			 })

			 function init() {
				context = CurrentAudioContext.getInstance();
				$scope.context = context;
				detector = PitchDetector.getDetector('wavelet',context.sampleRate);
			}

			function startMic($scope) {
				MicUtil.getMicAudioStream(
					function(stream) {
						buffer = new AudioBuffer(context, stream, 2048);
						buffer.addProcessor(processSignal);
						$scope.signalOn = true;
					}
				);
			}

			function processSignal(data) {
				// yet to start or paused.
				if ($scope.operation === 'start' || $scope.operation === 'resume' || 
					$scope.operation === 'over' || $scope.isInstrumentProgress == true) {
					return;
				}
				//if (!displayCountDown()) return;
				updatePitch(data);
			}

			function updatePitch(data) {
				
				var waveletFreq = detector.findPitch(data);
				if (waveletFreq == 0) return;
				currInterval = Math.round(1200 * (Math.log(waveletFreq / $scope.rootFreq) / Math.log(2))) / 100;
				var renderedTime = $scope.chart.getTimeRendered();
				var expNote = $scope.chart.exerciseNote(renderedTime);
				// don't update score; break, mid break or offset time.
				if (expNote < 0) return;
				$scope.chart.draw(currInterval, renderedTime);
				updateScore(expNote, currInterval.toFixed(0))
			};

			function updateScore(expected, actual) {
				$scope.lastScore = ScoreService.getScore(expected, actual);
				$scope.totalScore = ScoreService.getTotalScore($scope.totalScore, $scope.lastScore, $scope.scoreCount);
				$scope.scoreCount++;
				$scope.$apply();
			};

			function setExercise() {
				$scope.partNumber = 0;
				//var sequences = ExerciseService.getSubset($scope.myExercise, $scope.partNumber, maxNotes);
				$scope.chart.setExercise($scope.myExercise);
				$scope.chart.redraw();
			}

			function start() {
				if ($scope.user.settings.isPlayInstrument && !$scope.isInstrumentProgress) {
					$scope.isInstrumentProgress = true;
					$scope.$broadcast('start-instrument');
					//showToastMessage("First Listen.");
				} else {
					$scope.isInstrumentProgress = false;
					$scope.$broadcast('start');
					//showToastMessage("Sing Now.");
				}
			}

			// Reset game to original state
			function reset() {
				resetScore();
				// Destroy html element doesn't cancel timeout event.
				$scope.chart.pauseIndicatorLine();
				setExercise();
				// start again
				countDownDisplayed = false;
				$scope.operation = 'start';
			}

			function resetScore() {
				$scope.scoreCount = 0;
				$scope.lastScore = 0;
				$scope.totalScore = 0;
			}

			function showToastMessage(text) {
				document.querySelector('#toast-alert').setAttribute("text", text);
				document.querySelector('#toast-alert').show();
			}

			function startTanpura() {
				tanpura = new Tanpura($scope.user.settings.rootNote, 7);
				tanpura.play();
			}

			function stopTanpura() {
				if(tanpura) {
					tanpura.stop();
				}
			}

		});
		
		// function startCountdown(callback) {
		// 	countDown = new $.GameCountDown({readymessage:"Go", callback: callback});
		// 	//GameCountDown = new jQuery.GameCountDown();
		// 	countDown.Add({control: '#counter', seconds: 4});
		// };

		// function displayCountDown() {
		// 	if (countDownDisplayed) return true;
		// 	if (countDownProgress) return false;
		// 	countDownProgress = true;
		// 	startCountdown(function(id){
		// 		countDown.Remove('#counter');
		// 		$('#counter').text("");
		// 		countDownDisplayed = true;
		// 		countDownProgress = false;
		// 	});
		// }
	});