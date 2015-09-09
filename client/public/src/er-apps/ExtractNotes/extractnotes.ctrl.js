define(['./module', './sequencegen', './display', 'note', 'webaudioplayer', 'currentaudiocontext', 'tanpura', 'music-calc','underscore'],
    function(app, sequenceGen, Display, Note, Player, CurrentAudioContext, Tanpura, MusicCalc,_) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('ExtractNotesCtrl', function($scope, $rootScope) {

            var marker = 0;
            var baseFreq = 261;
            var playTime = 500;
            var currLoopId;

            var currRoot;

            var playDuration = 500;
            var tanpura = null;

            $scope.total = 0;
            $scope.correct = 0;
            $scope.feedback = "Start with New";
            $scope.notes = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N"];
            $scope.rootNote = 56;
            $scope.isSettings = false;
            $scope.isPending = false;

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
            });

            
            $scope.$on("$destroy", function() {
                tanpura.stop();
            });

            $scope.showSettings = function() {
                $scope.isSettings = true;
            };

            $scope.check = function(index) {
                console.log(_.uniq(currSequence).sort());
            };

            $scope.newSequence = function() {
                currSequence = sequenceGen.getRandomSequence();
                playSequence(currSequence);
            };

            $scope.repeatPlay = function() {
                playSequence(currSequence);
            };

         
            $scope.playNote = function(noteInterval) {
                var noteNum = noteInterval + currRoot;
                player.playNote(MusicCalc.midiNumToFreq(noteNum), playDuration);
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