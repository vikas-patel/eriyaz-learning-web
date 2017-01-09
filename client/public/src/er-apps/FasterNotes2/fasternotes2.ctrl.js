define(['./module', 'underscore', './display', 'note', 'webaudioplayer', 'currentaudiocontext', 'tanpura', 'music-calc'], function(app, _, Display, Note, Player, CurrentAudioContext, Tanpura, MusicCalc) {
    var sequence;
    var audioContext = CurrentAudioContext.getInstance();
    var player = new Player(audioContext);


    app.controller('FasterNotes2Ctrl', function($scope, $rootScope) {
        $scope.rootNote = 56;
        $scope.tanpuraOn = true;

        var tanpura = null;

        var display = new Display();

        var currSequence;
        var marker = 0;
        var baseFreq = 261;
        var mainPlayTime = 500;
        var transitionPlayTime = 100;

        var scale = [0,2,4,5,7,9,11,12];
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
            tanpura.stop();
        });

        

        function isDisabled(element, index, array) {
            return !element.enabled;
        }


        function fillPlay(arr, scale) {
            var startTime = audioContext.currentTime + mainPlayTime / 1000;
            var nextNoteTime = startTime + mainPlayTime / 1000;
            player.scheduleNote(MusicCalc.getFreq(baseFreq, arr[0] * 100), nextNoteTime, mainPlayTime);
            nextNoteTime += mainPlayTime/1000;
            prev = arr[0];
            for (var i = 1; i < arr.length; i++) {
                inter = getIntermediates(prev, arr[i], scale);
                for (var j = 0; j < inter.length; j++) {
                    player.scheduleNote(MusicCalc.getFreq(baseFreq, inter[j]*100), nextNoteTime, transitionPlayTime);
                    nextNoteTime += transitionPlayTime/1000;
                }
                player.scheduleNote(MusicCalc.getFreq(baseFreq, arr[i] * 100), nextNoteTime, mainPlayTime);
                nextNoteTime += mainPlayTime/1000;
                prev = arr[i];
            }
        }

        function getIntermediates(note1, note2, scale) {
            idx2 = scale.indexOf(note2);
            idx1 = scale.indexOf(note1);
            var interIndices = [];

            for (var i = Math.min(idx2, idx1) + 1; i < Math.max(idx2, idx1); i++) {
                interIndices.push(i);
            }
            var intermediates = interIndices.map(function(i) {
                return scale[i];
            });

            if (idx1 > idx2) {
                intermediates.reverse();
            }

            return intermediates;


        }

        $scope.newSequence = function() {
            currSequence = _.shuffle(scale.slice(1,scale.length)).slice(0, 3);
            currSequence.unshift(scale[0]);
            fillPlay(currSequence,scale);
            display.reset();
        };

        $scope.repeat = function() {
            fillPlay(currSequence,scale);
        };

        $scope.showAns = function() {
            display.showNotes(currSequence.slice(0, 4));
        };

        $scope.playMyGuess = function() {
            fillPlay(display.getNotes(),scale);
        };
    });
});