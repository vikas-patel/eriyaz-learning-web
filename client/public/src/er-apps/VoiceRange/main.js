define(['./module', 'jquery', './display', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchdetector', 'note',
		'music-calc', 'stabilitydetector'
	],
	function(app, $, Display, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, Note, MusicCalc, StabilityDetector) {
		//constants
		var detector;
		//other globals;
		var context;
		var buffer;
		var playDuration = 1000;
		app.filter('minRange', function() {
		  return function(input, optional1, optional2) {
		  	if (input < 0) return 0;
		    return input;
		  }
		});
		app.controller('VoiceRangeCtrl', function($scope, User, $window, $timeout) {
			init();
			initVariables();
      		var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
			var timeRange = 3000;
			var display = new Display(timeRange);
			display.draw();
			display.setFlash("Click 'Start'");
			$scope.operation = 'start';
			$scope.showOverlay = false;
			$scope.signalOn = false;
			$scope.stopSignal = true;

			function initVariables () {
				$scope.maxNote = -99;
				$scope.minNote = 99;
			}

			$scope.startOrPause = function() {
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
				initVariables();
				display.draw();
				display.setFlash("Click 'Start'");
				$scope.operation = 'start';
				$scope.stopSignal = true;
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
				var interval = MusicCalc.freqToMidiNum(waveletFreq);
	            display.notifyInterval(interval);
	            stabilityDetector.push(interval);
			};

			function start() {
				$scope.stopSignal = false;
				display.start();
				display.setFlash("Sing and Stabalize");
				$scope.$broadcast('start');
			}

			function unitStabilityDetected(interval) {
		        display.notifyUnitStable(interval);
		  	}

	      	function aggStabilityDetected(interval) {
	      		if (interval > $scope.maxNote) $scope.maxNote = interval;
	      		if (interval < $scope.minNote) $scope.minNote = interval;
		        display.stop();
		        display.setFlash("Stable Tone Detected!");
		        $scope.isPending = false;
		        setTimeout(function() {
		          display.playAnimate(interval, playDuration, 'sang');
		          display.drawLevel($scope.maxNote, $scope.minNote);
		          $scope.$apply();
		          setTimeout(function() { display.clear(); display.start(); display.setFlash("Expand your Range");}, 2000);
		        }, 100);
	      }

		});
	});