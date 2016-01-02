define(['./module', './states/boot', './states/menu', './states/preload',
 './states/levels', './states/level2', './states/level1', './states/level3', './states/level4'], 
    function(app, Boot, Menu, Preload, Levels, Level2, Level1, Level3, Level4) {
        app.controller('FlappyBirdCtrl', function($scope, User, $window, $http) {
            
            var game = new Phaser.Game(576, 505, Phaser.AUTO, 'flappyBird');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('menu', Menu);
            game.state.add('preload', Preload);
            game.state.add('levels', Levels);
            game.state.add("level1", Level1);
            game.state.add('level2', Level3);
            game.state.add('level3', Level4);
            game.state.add('level4', Level2);

            game.state.start('boot');
            // TODO:
            // Set flexible root note.
            // Variable star numbers
            // Highest score
            // End of level: flag or trophy
            // hard coded px
            // rounded note
            // base selection
            // get rid of logout
            // loading bar
            // blade mark
            // easy level
            // splash sound
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
              if (!game.events) game.events = {};
              game.events.onLevelCompleted = new Phaser.Signal();
              game.events.onLevelCompleted.add(onLevelCompleted);
              // Load user medals
              $http.get('/medal/' + $window.localStorage.userId + "/flappybird")
                  .success(function(data) {
                      game.starArray = data;
                  }).error(function(status, data) {
                      console.log("failed");
                      console.log(data);
                  });

            function onLevelCompleted(level, medal, score) {
                var levelScore = game.starArray[level-1];
                if (levelScore.medal >= medal && levelScore.score >= score) {
                    return;
                }
                levelScore.medal = Math.max(levelScore.medal, medal);
                levelScore.score = Math.max(levelScore.score, score);
                var userId = $window.localStorage.userId;
                  $http.post('/medal', levelScore).success(function(data) {
                    if (data && data.level) {
                      game.starArray[level-1] = data;
                    }
                  }).error(function(status, data) {
                      console.log("failed");
                      console.log(data);
                  });
            }
        });
    });