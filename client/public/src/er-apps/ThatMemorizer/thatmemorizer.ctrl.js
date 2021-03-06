define(['./module', './intervalgen', './display', 'note', 'webaudioplayer', 'currentaudiocontext'], function(app, intervalGen, Display, Note, Player, CurrentAudioContext) {
    var sequence;
    var audioContext = CurrentAudioContext.getInstance();
    var player = new Player(audioContext);
    var thats =
        [{
            name: 'Bilawal',
            model: [0, 2, 4, 5, 7, 9, 11, 12],
            enabled: true
        }, {
            name: 'Kafi',
            model: [0, 2, 3, 5, 7, 9, 10, 12],
            enabled: false
        }, {
            name: 'Bhairavi',
            model: [0, 1, 3, 5, 7, 8, 10, 12],
            enabled: true
        }, {
            name: 'Kalyan',
            model: [0, 2, 4, 6, 7, 9, 11, 12],
            enabled: false
        }, {
            name: 'Khamaj',
            model: [0, 2, 4, 5, 7, 9, 10, 12],
            enabled: false
        }, {
            name: 'Asavari',
            model: [0, 2, 3, 5, 7, 8, 10, 12],
            enabled: false
        }, {
            name: 'Bhairav',
            model: [0, 1, 4, 5, 7, 8, 11, 12],
            enabled: false
        }, {
            name: 'Marva',
            model: [0, 1, 4, 6, 7, 9, 11, 12],
            enabled: false
        }, {
            name: 'Purvi',
            model: [0, 1, 4, 6, 7, 8, 11, 12],
            enabled: false
        }, {
            name: 'Todi',
            model: [0, 1, 3, 6, 7, 8, 11, 12],
            enabled: false
        }];

    app.controller('ThatMemorizerCtrl', function($scope, $rootScope) {
        $scope.thats = thats;
        $scope.total = 0;
        $scope.correct = 0;
        $scope.hideNotes = false;
        $scope.avrohOnly = false;
        $scope.feedback = "Start with New";

        var display = new Display();
        var intV;

        var currThat;
        var marker = 0;
        var baseFreq = 261;
        var playTime = 500;

        var currLoopId;

        $scope.$watch('hideNotes', function() {
            if ($scope.hideNotes) {
                display.hideDisplay();
            } else
                display.showDisplay();
        });

        $scope.$on("$destroy", function() {
            cancelCurrentLoop();
        });

        $scope.newThat = function() {

            if (thats.every(isDisabled)) {
                $scope.feedback = "Please enable atleast one that, or better yet two";
            } else {
                var randomIndex = Math.floor(Math.random() * thats.length);
                while (!thats[randomIndex].enabled) {
                    randomIndex = Math.floor(Math.random() * thats.length);
                }
                currThat = thats[randomIndex];
                $scope.feedback = "Which that is playing?";
                display.displayThat(currThat.model);
                if ($scope.hideNotes) {
                    display.hideDisplay();
                }
                playThat();
            }
        };

        function isDisabled(element, index, array) {
            return !element.enabled;
        }

        function playThat() {
            cancelCurrentLoop();
            var reverseData = currThat.model.slice();
            reverseData.reverse();
            var intervalSequence;
            if ($scope.avrohOnly) {
                intervalSequence = reverseData;
            } else {
                intervalSequence = currThat.model.concat(reverseData);
            }
            var startTime = audioContext.currentTime + playTime / 1000;
            display.markNote(intervalSequence[0]);
            currLoopId = setInterval(function() {
                noteStartTime = startTime + playTime * marker / 1000;
                var noteFreq = baseFreq * Math.pow(2, intervalSequence[marker] / 12);
                display.markNote(intervalSequence[marker]);
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
            setTimeout(function() {
                display.markNone();
            }, playTime);
        }

        $scope.repeatPlay = function() {
            playThat();
        };

        $scope.checkAnswer = function(thatName) {
            $scope.total++;
            if (thatName === currThat.name) {
                $scope.feedback = "Cool! Correct Answer : " + currThat.name;
                $scope.correct++;

            } else {
                $scope.feedback = "Oops! Correct Answer : " + currThat.name;
            }
        };

        $scope.showAns = function() {
            display.showDisplay();
            playThat();
        };
    });
});