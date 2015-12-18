define(['./module', './states/boot', './states/menu', './states/preload', './states/levels', './states/level2', './states/level1'], 
    function(app, Boot, Menu, Preload, Levels, Level2, Level1) {
        app.controller('FlappyBirdCtrl', function($scope, User, $window) {
            
            var game = new Phaser.Game(576, 505, Phaser.AUTO, 'flappyBird');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('menu', Menu);
            game.state.add('preload', Preload);
            game.state.add('levels', Levels);
            game.state.add("level1", Level1);
            game.state.add('level2', Level2);
            game.starArray = [0, 1, 4, 4];

            game.state.start('boot');
            // TODO: small range in level 1
            // Set flexible root note.
            // Position stars better
            // Variable star numbers
            // Highest score
            // End of level: flag or trophy
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