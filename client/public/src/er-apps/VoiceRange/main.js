define(['./module', 'jquery', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchdetector', 'note',
		'music-calc', 'octaveError'
	],
	function(app, $, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, Note, MusicCalc, octaveError) {
		//constants
		var detector;
		//other globals;
		var context;
		var buffer;
		var renderTimeShift = 0;
		var lastExpNote;
		var notesArray;
		var maxNote;
		var minNote;
		app.controller('VoiceRangeCtrl', function($scope, User, $window, $timeout) {
			init();
			initVariables();
			$scope.operation = 'start';
			$scope.showOverlay = false;
			$scope.signalOn = false;
			$scope.stopSignal = true;
			$scope.isHigh = true;
			$scope.offsetDuration = 2000;
			$scope.user = User.get({
				id: $window.localStorage.userId
			}, function() {
				$scope.gender = $scope.user.gender;
			});

			$scope.$watch('gender', function() {
		        if ($scope.gender == "man") {
		            $scope.rootNote = 47;
		        } else {
		          $scope.rootNote = 56;
		        }
		        $scope.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
		        $scope.chart.redraw();
		      });

			function initVariables () {
				lastExpNote = 0;
				notesArray = [];
				maxNote = -99;
				minNote = 99;
				$scope.isHigh = true;
			}

			$scope.startOrPause = function() {
				 if (!$scope.gender) {
		            setMessage("Please set user type first.");
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
				initVariables();
				$scope.lastMaxNote = "";
				$scope.lastMinNote = "";
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
				if ($scope.isHigh) {
					setMessage("Get Ready to Sing Descending notes");
					$timeout(function(){
						$scope.isHigh = false;
						notesArray = [];
						$scope.chart.redraw();
						$scope.operation = 'reset';
						start();
					}, 3000);
				} else {
					$scope.showOverlay = true;
					$scope.octaveRange = (maxNote - minNote + 1)/12;
				}
				$scope.$apply();
			})

			$scope.$on('note-change', function() {
				if (notesArray.length == 0) return;
				var meanNote = Number(_.chain(notesArray).countBy().pairs().max(_.last).head().value());
				if ($scope.isHigh) {
					if (meanNote > maxNote) {
						maxNote = meanNote;
						console.log("maxNote:"+maxNote);
						$scope.lastMaxNote = MusicCalc.midiNumToNotation($scope.rootNote+maxNote);
						$scope.$apply();
					}
				} else {
					if (meanNote < minNote) {
						minNote = meanNote;
						console.log("minNote:"+minNote);
						$scope.lastMinNote = MusicCalc.midiNumToNotation($scope.rootNote+minNote);
						$scope.$apply();
					}
				}
				notesArray = [];
			});

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

			function setMessage(message) {
				$('#countdown').text(message);
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
				if (expNote < -99) return;
				var expFreq = Math.pow(2, expNote/12)*$scope.rootFreq;
				//var actualFreq = octaveError.fix(waveletFreq, expFreq);
				currInterval = Math.round(1200 * (Math.log(waveletFreq/$scope.rootFreq) / Math.log(2)) / 100);
				notesArray.push(currInterval);
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