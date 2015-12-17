define(['./module', './states/boot', './states/menu', './states/preload', './states/levels', './states/play', './states/level1'], 
    function(app, Boot, Menu, Preload, Levels, Play, Level1) {
        app.controller('FlappyBirdCtrl', function($scope, User, $window) {
            
            var game = new Phaser.Game(576, 505, Phaser.AUTO, 'flappyBird');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('menu', Menu);
            game.state.add('preload', Preload);
            game.state.add('levels', Levels);
            game.state.add("level1", Level1);
            game.state.add('play', Play);
            game.starArray = [0, 4, 4, 4];

            game.state.start('boot');
            // Set flexible root note.
            User.get({
                id: $window.localStorage.userId
              }).$promise.then(function(user) {
                $scope.gender = user.gender;
                if ($scope.gender == 'man') {
                    game.rootNote = 47;
                } else {
                    game.rootNote = 58;
                }
              });
        });
    });