define(['./module', './states/boot', './states/menu', './states/preload',
 './states/levels', './states/level2', './states/level-updown', './states/level-middle', 
 './states/level4', './states/level-cloud', './states/level-stone', './states/level-ascend', 
 './states/level-step', './states/level-step-down', './states/level-random', './states/level-wave', 
 './states/level-wall', './states/level-wall-high', './states/level-wall-random', './states/level-wall-ascend',
 './states/level-wall-descend', './states/level-wall-mix'], 
    function(app, Boot, Menu, Preload, Levels, Level2, LevelUpDown, LevelMiddle, Level4, LevelCloud, 
      LevelStone, LevelAscend, LevelStep, LevelStepDown, LevelRandom, LevelWave, LevelWall, LevelWallHigh, 
      LevelWallRandom, LevelWallAscend, LevelWallDecend, LevelWallMix) {
        app.controller('FlappyBirdCtrl', function($scope, User, $window, $http, ScoreService) {
            
            var game = new Phaser.Game(720, 505, Phaser.AUTO, 'flappyBird');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('menu', Menu);
            game.state.add('preload', Preload);
            game.state.add('levels', Levels);
            game.state.add("level1", LevelUpDown);
            game.state.add('level2', LevelMiddle);
            game.state.add('level3', LevelRandom);
            game.state.add('level7', LevelWallAscend);
            game.state.add('level5', LevelWallHigh);
            game.state.add('level8', LevelWallDecend);
            game.state.add('level4', LevelWall);
            game.state.add('level6', LevelWallRandom);
            game.state.add('level9', LevelWallMix);
            game.state.start('boot');
            // TODO:
            // Set flexible root note.
            // Highest score
            // base selection
            // landing page on mobile
            // new levels
            User.get({
                id: $window.localStorage.userId
              }).$promise.then(function(user) {
                $scope.gender = user.gender;
                if ($scope.gender == 'man') {
                    game.isMan = true;
                    game.rootNote = 47;
                } else if ($scope.gender == 'child'){
                    game.rootNote = 62;
                    game.isMan = false;
                } else {
                    game.rootNote = 58;
                    game.isMan = false;
                }
                console.log("root note:"+ game.rootNote);
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
                // Save Score
                ScoreService.save("flappybird", level, score);
                // Save Medals
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