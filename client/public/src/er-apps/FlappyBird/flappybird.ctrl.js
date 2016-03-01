define(['./module', './states/boot', './states/menu', './states/preload',
 './states/levels', './states/level2', './states/level-updown', './states/level-middle', 
 './states/level4', './states/level-cloud', './states/level-stone', './states/level-ascend', 
 './states/level-step', './states/level-step-down', './states/level-random', './states/level-wave', 
 './states/level-wall', './states/level-wall-high', './states/level-wall-random', './states/level-wall-ascend',
 './states/level-wall-descend', './states/level-wall-mix', './states/level-wall-setting', './states/level-wall-easy'], 
    function(app, Boot, Menu, Preload, Levels, Level2, LevelUpDown, LevelMiddle, Level4, LevelCloud, 
      LevelStone, LevelAscend, LevelStep, LevelStepDown, LevelRandom, LevelWave, LevelWall, LevelWallHigh, 
      LevelWallRandom, LevelWallAscend, LevelWallDecend, LevelWallMix, LevelWallSetting, LevelWallEasy) {
        app.controller('FlappyBirdCtrl', function($scope, User, $window, $http, ScoreService) {
            
            var game = new Phaser.Game(720, 505, Phaser.AUTO, 'flappyBird');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('menu', Menu);
            game.state.add('preload', Preload);
            game.state.add('levels', Levels);
            game.state.add('level0', LevelWallSetting);
            game.state.add("level1", LevelUpDown);
            game.state.add('level2', LevelMiddle);
            game.state.add('level3', LevelRandom);
            game.state.add('level4', LevelWallEasy);
            game.state.add('level5', LevelWall);
            game.state.add('level6', LevelWallHigh);
            game.state.add('level7', LevelWallRandom);
            game.state.add('level8', LevelWallAscend);
            game.state.add('level9', LevelWallDecend);
            game.state.add('level10', LevelWallMix);
            game.state.start('boot');
              User.get({
                id: $window.localStorage.userId
              }).$promise.then(function(user) {
                $scope.user = user;
                $scope.gender = user.gender;
                game.upperNote = user.settings.upperNote;
                game.lowerNote = user.settings.lowerNote;
                game.gender = user.gender;
                if ($scope.gender == 'man') {
                    game.isMan = true;
                } else {
                    game.isMan = false;
                }
              });
              if (!game.events) game.events = {};
              // save score event
              game.events.onLevelCompleted = new Phaser.Signal();
              game.events.onLevelCompleted.add(onLevelCompleted);
              // save settings event
              game.events.onSettingSaved = new Phaser.Signal();
              game.events.onSettingSaved.add(onSettingSaved);
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

            function onSettingSaved(note, isHigh) {
              if (isHigh) {
                game.upperNote = note;
                $scope.user.settings.upperNote = note;
              } else {
                game.lowerNote = note;
                $scope.user.settings.lowerNote = note;
              }
                $scope.user.$update(function() {
                });
            }
        });
    });