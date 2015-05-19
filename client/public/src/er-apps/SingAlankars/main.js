define(['./module', 'jquery', './exercises', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchdetector', 'note',
		'tanpura', 'metronome', 'music-calc'
	],
	function(app, $, exercises, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, Note, Tanpura, metronome, MusicCalc) {
		//constants
		var detector;
		//other globals;
		var context;
		var buffer;
		var maxNotes = 5;
		var tanpura;
		app.controller('SingAlankarsCtrl', function($scope, $rootScope, ScoreService, ExerciseService, User, $window) {
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
			$scope.stopSignal = true;
			$scope.isInstrumentProgress = false;
			$scope.user = User.get({
				id: $window.localStorage.userId
			}, function() {
				if (!$scope.user.settings || !$scope.user.settings.rootNote) {
					$scope.showSettings = true;
					return;
				}
				if ($scope.user.settings.isPlayTanpura) {
					startTanpura();
				}
				$scope.rootFreq = MusicCalc.midiNumToFreq($scope.user.settings.rootNote);
			});

			$scope.$on("$destroy", function() {
				stopTanpura();
				$scope.chart.isTransitionStopped = true;
			});

			$scope.updateSettings = function() {
				$scope.user.$update(function() {
					$scope.showSettings = false;
					if ($scope.user.settings.isPlayTanpura) {
						startTanpura();
					} else {
						stopTanpura();
					}
					$scope.rootFreq = MusicCalc.midiNumToFreq($scope.user.settings.rootNote);
				});
			}
			$scope.startOrPause = function() {
				if (!$scope.user.settings.rootNote) {
					$scope.showSettings = true;
					return;
				}

				if (!$scope.myExercise) {
					showToastMessage("Please Select Exercise.");
					$scope.toastMessageDisplayed = true;
					return;
				}
				switch ($scope.operation) {
					case 'start':
						if ($scope.signalOn) {
							start();
						} else {
							startMic($scope);
						}
						$scope.operation = 'reset';
						break;
					case 'reset':
						reset();
						break;
				}
			}

			$scope.$watch(function(scope) {
					return scope.myExercise
				},
				function() {
					if (!$scope.myExercise)
						return;
					setExercise();
					$scope.operation = 'start';
				});

			$scope.$watch(function(scope) {
					return scope.signalOn
				},
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
				$scope.myExercise = $scope.exercises[index + 1];
				$scope.$apply();
				$scope.operation = 'reset';
				start();
			}

			$scope.closeOverlay = function() {
				$scope.showOverlay = false;
			}

			$scope.restart = function() {
				$scope.showOverlay = false;
				reset();
				$scope.operation = 'reset';
				start();
			}

			$scope.$on('chartOver', function() {
				if ($scope.user.settings.playInstrument == "before" && $scope.chart.isPlayInstrument) {
					$scope.chart.redraw();
					start();
					return;
				}
				$scope.stopSignal = true;
				$scope.showOverlay = true;
				$scope.$apply();
				// save score at server.
				ScoreService.save("alankar", $scope.myExercise.name, $scope.totalScore);
			})

			function init() {
				context = CurrentAudioContext.getInstance();
				$scope.context = context;
				detector = PitchDetector.getDetector('wavelet', context.sampleRate);
			}

			function startMic($scope) {
				MicUtil.getMicAudioStream(
					function(stream) {
						buffer = new AudioBuffer(context, stream, 2048);
						buffer.addProcessor(processSignal);
						$scope.signalOn = true;
						$scope.$apply();
					}
				);
			}

			function processSignal(data) {
				// yet to start or paused.
				if ($scope.stopSignal) {
					return;
				}
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
				if ($scope.user.settings.playInstrument == "before" && !$scope.chart.isPlayInstrument) {
					$scope.stopSignal = true;
					$scope.$broadcast('start-instrument');
				} else if ($scope.user.settings.playInstrument == "with") {
					$scope.stopSignal = false;
					$scope.$broadcast('start-instrument');
				} else {
					$scope.stopSignal = false;
					$scope.$broadcast('start');
				}
			}

			// Reset game to original state
			function reset() {
				resetScore();
				setExercise();
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
				if (tanpura !== null && tanpura)
					tanpura.stop();
				var progressListener = function(message, progress) {
					if (progress === 100) {
						tanpura.play();
					}
				};
				tanpura = Tanpura.getInstance();
				tanpura.setTuning($scope.user.settings.rootNote, 7, progressListener);
			}

			function stopTanpura() {
				if (tanpura) {
					tanpura.stop();
				}
			}

		});
	});