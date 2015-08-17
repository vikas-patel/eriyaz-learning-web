define(['./module', './melodygen', 'd3', './chart', 'webaudioplayer', 'currentaudiocontext', 'melody', 'note', 'tanpura'],
    function(app, MelodyGen, d3, Chart, Player, CurrentAudioContext, Melody, Note, Tanpura) {
        var melody;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);

        app.controller('MelodyGraph2Ctrl', function($scope) {
            $scope.numNotesOpts = [3, 4, 5, 6];
            $scope.numNotes = 3;
            $scope.rootNote = 56;

            var chart = new Chart();
            var tanpura = null;

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

            $scope.newSequence = function() {
                chart.reset($scope.numNotes);
                melody = MelodyGen.getNewMelody($scope.numNotes,currRoot);
                melody.play(player);
            };

            $scope.repeat = function() {
                melody.play(player);
            };

            $scope.playMyGraph = function() {
                dataToMelody(melody.notes[0].midiNumber, chart.getData()).play(player);
            };

            $scope.showAnswer = function() {
                chart.plotData(melodyToData());
            };

            function melodyToData() {
                var data = [];
                var baseNum = melody.notes[0].midiNumber;
                data.push({
                    degree: 0,
                    duration: melody.notes[0].duration
                });
                for (var i = 1; i < melody.notes.length; i++) {
                    data.push({
                        degree: melody.notes[i].midiNumber - baseNum,
                        duration: melody.notes[i].duration
                    });
                }
                return data;
            }

            function dataToMelody(baseNoteNum, data) {
                var melody1 = new Melody();
                melody1.addNote(Note.createFromMidiNum(baseNoteNum, data[0].duration));
                for (var i = 1; i < data.length; i++) {
                    melody1.addNote(Note.createFromMidiNum(baseNoteNum + data[i].degree, data[i].duration));
                }
                return melody1;
            }
        });
    });