define(['./module', './thatgen', './display', 'note', 'webaudioplayer', 'currentaudiocontext', 'tanpura', 'music-calc'], function(app, thatGen, Display, Note, Player, CurrentAudioContext, Tanpura, MusicCalc) {
    var sequence;
    var audioContext = CurrentAudioContext.getInstance();
    var player = new Player(audioContext);


    app.controller('MelakartaCtrl', function($scope, $rootScope) {
        $scope.avroh = false;
        $scope.rootNote = 56;
        $scope.tanpuraOn = true;
        $scope.duration = 2000;

        var tanpura = null;

        var display = new Display();

        var currThat;
        var marker = 0;
        var baseFreq = 261;
        var playTime = 500;

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


        $scope.$watch('duration', function() {
            playTime = parseInt($scope.duration);
        });

        $scope.$on("$destroy", function() {
            cancelCurrentLoop();
            tanpura.stop();
        });

        $scope.newThat = function() {
            currThat = thatGen.getRandomThat();
            playThat(currThat);
            display.reset();
        };

        function isDisabled(element, index, array) {
            return !element.enabled;
        }

        function playThat(that) {
            cancelCurrentLoop();
            var reverseData = that.slice();
            reverseData.reverse();
            var intervalSequence;
            if ($scope.avroh) {
                intervalSequence = reverseData;
            } else {
                intervalSequence = that;
            }
            var startTime = audioContext.currentTime + playTime / 1000;
            currLoopId = setInterval(function() {
                noteStartTime = startTime + playTime * marker / 1000;
                var noteFreq = baseFreq * Math.pow(2, intervalSequence[marker] / 12);
                player.scheduleNote(noteFreq, noteStartTime, playTime);
                marker++;
                if (marker >= intervalSequence.length) {
                    cancelCurrentLoop();
                }
            }, playTime);
        }

        function cancelCurrentLoop() {
            marker = 0;
            clearInterval(currLoopId);
        }

        $scope.repeat = function() {
            playThat(currThat);
        };

        $scope.showAns = function() {
            display.displayThat(currThat);
        };

        $scope.playMyGuess = function() {
            console.log(display.getThat());
            playThat(display.getThat());
        };
    });
});