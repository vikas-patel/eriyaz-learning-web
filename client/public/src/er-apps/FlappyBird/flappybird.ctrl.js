define(['./module', 'phaser', './states/boot', './states/menu', './states/preload', './states/play'], 
    function(app, Phaser, Boot, Menu, Preload, Play) {
        app.controller('FlappyBirdCtrl', function($scope) {
            
            var game = new Phaser.Game(576, 505, Phaser.AUTO, 'flappyBird');

            // Game States
            game.state.add('boot', Boot);
            game.state.add('menu', Menu);
            game.state.add('preload', Preload);
            game.state.add('play', Play);

            game.state.start('boot');
        });
    });