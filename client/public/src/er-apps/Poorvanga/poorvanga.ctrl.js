define(['./module', 'note', 'webaudioplayer', 'currentaudiocontext','tanpura', 'music-calc','underscore'], function(app, Note, Player, CurrentAudioContext, Tanpura, MusicCalc, _) {
    var sequence;
    var audioContext = CurrentAudioContext.getInstance();
    var player = new Player(audioContext);
    var thats =
        [{
            name: 's r1 g1 m1',
            model: [0, 1, 2, 5],
            enabled: true,
            correct: false
        }, {
            name: 's r1 g2 m1',
            model: [0, 1, 3, 5],
            enabled: true,
            correct: false
        },{
            name: 's r1 g3 m1',
            model: [0, 1, 4, 5],
            enabled: true,
            correct: false
        },{
            name: 's r2 g2 m1',
            model: [0, 2, 3, 5],
            enabled: true,
            correct: false
        },{
            name: 's r2 g3 m1',
            model: [0, 2, 4, 5],
            enabled: true,
            correct: false
        },{
            name: 's r3 g3 m1',
            model: [0, 3, 4, 5],
            enabled: true,
            correct: false
        },{
            name: 's r1 g1 m2',
            model: [0, 1, 2, 6],
            enabled: true,
            correct: false
        }, {
            name: 's r1 g2 m2',
            model: [0, 1, 3, 6],
            enabled: true,
            correct: false
        },{
            name: 's r1 g3 m2',
            model: [0, 1, 4, 6],
            enabled: true,
            correct: false
        },{
            name: 's r2 g2 m2',
            model: [0, 2, 3, 6],
            enabled: true,
            correct: false
        },{
            name: 's r2 g3 m2',
            model: [0, 2, 4, 6],
            enabled: true,
            correct: false
        },{
            name: 's r3 g3 m2',
            model: [0, 3, 4, 6],
            enabled: true,
            correct: false
        }];

    app.controller('PoorvangaCtrl', function($scope, $rootScope) {
        $scope.thats = thats;
        $scope.total = 0;
        $scope.correct = 0;
        $scope.avroh = false;
        $scope.feedback = "Start with New";
        $scope.rootNote = 56;
        $scope.playTime = 200;
		$scope.shuffle = false;

        var currThat;
        var marker = 0;
        var baseFreq = 261;
        var slowPlayTime = 400;
        var tanpura = null;

        var currLoopId;

      $scope.$watch('rootNote', function() {
            currRoot = parseInt($scope.rootNote);
            // PitchModel.rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
            if (tanpura !== null)
                tanpura.stop();
            $scope.loading = true;
            var progressListener = function(message, progress) {
                if (progress === 100) {
                    tanpura.play();
                    $scope.loading = false;
                    // $scope.$apply();
                }
            };
            tanpura = Tanpura.getInstance();
            tanpura.setTuning($scope.rootNote, 7, progressListener);
            baseFreq = MusicCalc.midiNumToFreq(currRoot);
        });


        $scope.$on("$destroy", function() {
            cancelCurrentLoop();
            tanpura.stop();
        });

        $scope.newThat = function() {
            if(currThat)
                currThat.correct = false;
            if (thats.every(isDisabled)) {
                $scope.feedback = "Please enable atleast one that, or better yet two";
            } else {
                var randomIndex = Math.floor(Math.random() * thats.length);
                while (!thats[randomIndex].enabled) {
                    randomIndex = Math.floor(Math.random() * thats.length);
                }
                currThat = thats[randomIndex];
                $scope.feedback = "Which that is playing?";
                playThat(currThat.model,$scope.playTime);
            }
        };

        function isDisabled(element, index, array) {
            return !element.enabled;
        }

        function playThat(that,playDuration) {
            cancelCurrentLoop();
            var reverseData = that.slice();
            reverseData.reverse();
            var intervalSequence;
            if ($scope.avroh) {
                intervalSequence = reverseData;
            } else {
                intervalSequence = that;
            }
			if($scope.shuffle) {
				intervalSequence = _.shuffle(intervalSequence);
			}
            var startTime = audioContext.currentTime + playDuration / 1000;
            currLoopId = setInterval(function() {
                noteStartTime = startTime + playDuration * marker / 1000;
                var noteFreq = baseFreq * Math.pow(2, intervalSequence[marker] / 12);
                player.scheduleNote(noteFreq, noteStartTime, playDuration);
                marker++;
                if (marker >= intervalSequence.length) {
                    cancelCurrentLoop();
                }
            }, playDuration);
        }

        function cancelCurrentLoop() {
            marker = 0;
            clearInterval(currLoopId);
        }

        $scope.repeat = function() {
            playThat(currThat.model,$scope.playTime);
        };

         $scope.slowRepeat = function() {
            playThat(currThat.model,slowPlayTime);
        };

        $scope.checkAnswer = function(thatName) {
            $scope.total++;
            currThat.correct = true;
            if (thatName === currThat.name) {
                $scope.feedback = "Cool!";
                $scope.correct++;

            } else {
                $scope.feedback = "Oops! Correct Answer : " + currThat.name;
            }
        };

       
    });
});