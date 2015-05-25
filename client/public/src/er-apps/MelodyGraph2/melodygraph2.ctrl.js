define(['./module', './melodygen', 'd3', './chart', 'webaudioplayer', 'currentaudiocontext','melody','note'],
    function(app, MelodyGen, d3, Chart, Player, CurrentAudioContext,Melody,Note) {
        var melody;
        var audioContext = CurrentAudioContext.getInstance();
        var player = new Player(audioContext);

        app.controller('MelodyGraph2Ctrl', function($scope) {
            $scope.numNotesOpts = [3, 4, 5, 6];
            $scope.numNotes = 3;

            var chart = new Chart();

            $scope.newSequence = function() {
                chart.reset($scope.numNotes);
                melody = MelodyGen.getNewMelody($scope.numNotes);
                melody.play(player);
            };

            $scope.repeat = function() {
                melody.play(player);
            };

            $scope.playMyGraph = function() {
                dataToMelody(melody.notes[0].midiNumber,chart.getData()).play(player);
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

            function dataToMelody(baseNoteNum,data) {
                var melody1 = new Melody();
                melody1.addNote(Note.createFromMidiNum(baseNoteNum, data[0].duration));
                for (var i = 1; i < data.length; i++) {
                    melody1.addNote(Note.createFromMidiNum(baseNoteNum + data[i].degree, data[i].duration));
                }
                return melody1;
            }
        });
    });