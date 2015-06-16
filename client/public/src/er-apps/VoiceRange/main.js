define(['./module', 'jquery', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchdetector', 'note',
		'music-calc', 'octaveError'
	],
	function(app, $, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, Note, MusicCalc, octaveError) {
		//constants
		var detector;
		//other globals;
		var context;
		var buffer;
		var renderTimeShift = 70;
		app.controller('VoiceRangeCtrl', function($scope, User, $window) {
			init();
			$scope.operation = 'start';
			$scope.showOverlay = false;
			//$scope.partNumber = 0;
			$scope.signalOn = false;
			$scope.stopSignal = true;
			$scope.rootNote = 53;
			$scope.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
			$scope.user = User.get({
				id: $window.localStorage.userId
			}, function() {
				$scope.gender = $scope.user.gender;
			});

			$scope.startOrPause = function() {
				if (!$scope.gender) {
					showToastMessage("Please Select User Type.");
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
						$scope.reset();
						break;
				}
			}

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
				$scope.chart.redraw();
			}

			$scope.closeOverlay = function() {
				$scope.showOverlay = false;
			}

			$scope.restart = function() {
				$scope.showOverlay = false;
				$scope.reset();
				$scope.operation = 'reset';
				start();
			}

			$scope.$on('chartOver', function() {
				$scope.stopSignal = true;
				$scope.showOverlay = true;
				$scope.$apply();
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
						buffer.addProcessor(updatePitch);
						$scope.signalOn = true;
						$scope.$apply();
					}
				);
			}

			function updatePitch(data) {
				if ($scope.stopSignal) {
					return;
				}
				var waveletFreq = detector.findPitch(data);
				if (waveletFreq == 0) return;
				var renderedTime = $scope.chart.getTimeRendered() - renderTimeShift;
				var expNote = $scope.chart.exerciseNote(renderedTime);
				// don't update score; break, mid break or offset time.
				if (expNote < 0) return;
				var expFreq = Math.pow(2, expNote/12)*$scope.rootFreq;
				var actualFreq = octaveError.fix(waveletFreq, expFreq);
				currInterval = Math.round(1200 * (Math.log(actualFreq/$scope.rootFreq) / Math.log(2))) / 100;
				$scope.chart.draw(currInterval, renderedTime);
			};

			function start() {
				$scope.stopSignal = false;
				$scope.$broadcast('start');
			}

			function showToastMessage(text) {
				document.querySelector('#toast-alert').setAttribute("text", text);
				document.querySelector('#toast-alert').show();
			}

		});
	});