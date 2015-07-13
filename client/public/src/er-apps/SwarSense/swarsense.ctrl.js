define(['./module', './intervalgen', './display', 'note', 'webaudioplayer', 'currentaudiocontext', 'tanpura', 'music-calc'],
    function(app, intervalGen, Display, Note, Player, CurrentAudioContext, Tanpura, MusicCalc) {
        var sequence;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);


        app.controller('SwarSenseCtrl', function($scope, $rootScope) {

            var currRoot;
            var currMidiNum;
            var currInterval;
            var playDuration = 500;
            var tanpura = null;

            $scope.total = 0;
            $scope.correct = 0;
            $scope.feedback = "Start with New";
            $scope.notes = ["S", "r", "R", "g", "G", "m", "M", "P", "d", "D", "n", "N"];
            $scope.selected = [true, false, true, false, true, true, false, true, false, true, false, true];
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

            $scope.$watchCollection('selected', function() {
                var selIndices = [];
                $scope.selected.forEach(function(element, index) {
                    if (element) {
                        selIndices.push(index);
                    }
                });
            });

            $scope.$on("$destroy", function() {
                tanpura.stop();
            });

            $scope.showSettings = function() {
                $scope.isSettings = true;
            };

            $scope.checkAns = function(index) {
                if (index === currInterval) {
                    $scope.correct++;
                    $scope.feedback = "Correct!";
                } else {
                    $scope.feedback = "Wrong :(, Correct Ans is " + $scope.notes[currInterval];
                }
                $scope.total++;
                $scope.isPending = false;
            };

            $scope.newNote = function() {
                var randomNote;
                while (!$scope.selected[randomNote]) {
                    randomNote = Math.floor(Math.random() * 13);
                }
                currInterval = randomNote;
                console.log(currInterval);
                var randomOctave = Math.floor(Math.random() * (1-(-2)+1)) - 2;
                currMidiNum = currRoot + randomOctave * 12 + currInterval;
                console.log(currMidiNum);
                playNote(currMidiNum);
                $scope.feedback = "What note is playing?";
                $scope.isPending = true;
            };

            $scope.repeatPlay = function() {
                playNote(currMidiNum);
            };

            function isDisabled(element, index, array) {
                return !element.enabled;
            }

            function playNote(noteNum) {
                player.playNote(MusicCalc.midiNumToFreq(noteNum), playDuration);
            }

        });
    });