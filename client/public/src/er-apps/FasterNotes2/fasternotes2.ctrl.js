define(['./module', './thatgen', './display', 'note', 'webaudioplayer', 'currentaudiocontext', 'tanpura', 'music-calc'], function(app, thatGen, Display, Note, Player, CurrentAudioContext, Tanpura, MusicCalc) {
    var sequence;
    var audioContext = CurrentAudioContext.getInstance();
    var player = new Player(audioContext);


    app.controller('FasterNotes2Ctrl', function($scope, $rootScope) {
        $scope.rootNote = 56;
        $scope.tanpuraOn = true;

        var tanpura = null;

        var display = new Display();

        var currThat;
        var marker = 0;
        var baseFreq = 261;
        var mainPlayTime = 500;
        var transitionPlayTime = 100;

        var currLoopId;

        $scope.noteDuration = mainPlayTime;
        $scope.transitionDuration = transitionPlayTime;
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

        $scope.$watch('noteDuration', function() {
            mainPlayTime = parseInt($scope.noteDuration);
        });

        $scope.$watch('transitionDuration', function() {
            transitionPlayTime = parseInt($scope.transitionDuration);
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
            intervalSequence = that.slice(0,4);
            var startTime = audioContext.currentTime + mainPlayTime / 1000;
            currLoopId = setInterval(function() {
                noteStartTime = startTime + mainPlayTime * marker / 1000;
                var noteFreq = baseFreq * Math.pow(2, intervalSequence[marker] / 12);
                player.scheduleNote(noteFreq, noteStartTime, mainPlayTime);
                marker++;
                if (marker >= intervalSequence.length) {
                    cancelCurrentLoop();
                }
            }, mainPlayTime);
        }

        function cancelCurrentLoop() {
            marker = 0;
            clearInterval(currLoopId);
        }

        $scope.repeat = function() {
            playThat(currThat);
        };

        $scope.showAns = function() {
            display.showNotes(currThat.slice(0,4));
        };

        $scope.playMyGuess = function() {
            console.log(display.getNotes());
            playThat(display.getNotes());
        };
    });
});