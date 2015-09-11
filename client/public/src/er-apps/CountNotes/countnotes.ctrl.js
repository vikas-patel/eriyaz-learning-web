define(['./module', './sequencegen', './display', 'note', 'webaudioplayer', 'currentaudiocontext', 'tanpura', 'music-calc', 'underscore'],
    function(app, sequenceGen, Display, Note, Player, CurrentAudioContext, Tanpura, MusicCalc, _) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('CountNotesCtrl', function($scope, $rootScope) {

            var marker = 0;
            var baseFreq = 261;
            var playTime = 500;
            var currLoopId;

            var currRoot = 54;


            $scope.total = 0;
            $scope.correct = 0;
            $scope.feedback = "Start with New";
            $scope.notes = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N"];
            $scope.rootNote = 56;
            $scope.isSettings = false;
            $scope.isPending = false;
            $scope.minDistinct = 2;
            $scope.maxDistinct = 4;
            $scope.numDistinct = [3, 4, 5, 6, 7, 8];
            $scope.numNotes = 8;
            $scope.playTime = 500;

            $scope.$watchGroup(['maxDistinct', 'playTime'], function() {
                playTime = parseInt($scope.playTime);
                $scope.numDistinct = [];
                var i = $scope.minDistinct;
                while (i <= parseInt($scope.maxDistinct)) {
                    $scope.numDistinct.push(i);
                    i++;
                }
            });

            $scope.$on("$destroy", function() {
                cancelCurrentLoop();
            });


            $scope.check = function(num) {
                $scope.total++;
                if (num === _.uniq(currSequence).length) {
                    $scope.correct++;
                }
            };

            $scope.show = function() {
                playSequence(_.uniq(currSequence).sort());
            };

            $scope.newSequence = function() {
                currSequence = sequenceGen.getRandomSequence(parseInt($scope.minDistinct),parseInt($scope.maxDistinct), parseInt($scope.numNotes));
                playSequence(currSequence);
            };

            $scope.repeatPlay = function() {
                playSequence(currSequence);
            };



            function playSequence(sequence) {
                cancelCurrentLoop();
                var intervalSequence = sequence;
                var baseFreq = MusicCalc.midiNumToFreq(currRoot);
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


        });
    });