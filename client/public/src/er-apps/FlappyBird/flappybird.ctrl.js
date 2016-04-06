define(['./module', './states/boot', './states/menu', './states/preload',
 './states/levels', './states/level-updown', './states/level-middle', './states/level-random',
 './states/level-wall', './states/level-wall-high', './states/level-wall-random', './states/level-wall-ascend',
 './states/level-wall-descend', './states/level-wall-mix', './states/level-wall-setting', './states/level-wall-easy',
 './states/level-voice', './states/level-slow', './states/level-normal-speed'], 
    function(app, Boot, Menu, Preload, Levels, LevelUpDown, LevelMiddle,
      LevelRandom, LevelWall, LevelWallHigh, 
      LevelWallRandom, LevelWallAscend, LevelWallDecend, LevelWallMix, LevelWallSetting, LevelWallEasy, LevelVoice, 
      LevelSlow, LevelNormalSpeed) {
        app.controller('FlappyBirdCtrl', function($scope, User, $window, $http, ScoreService) {
            
            var game = new Phaser.Game(720, 505, Phaser.AUTO, 'flappyBird');
            // Game States
            game.state.add('boot', Boot);
            game.state.add('menu', Menu);
            game.state.add('preload', Preload);
            game.state.add('levels', Levels);
            
            game.state.add('level0', LevelVoice);
            game.state.add("level1", LevelSlow);
            game.state.add('level2', LevelNormalSpeed);
            game.state.add('level3', LevelWallSetting);
            game.state.add("level4", LevelUpDown);
            game.state.add('level5', LevelMiddle);
            
            game.state.add('level6', LevelRandom);
            game.state.add('level7', LevelWallEasy);
            game.state.add('level8', LevelWall);
            game.state.add('level9', LevelWallHigh);
            game.state.add('level10', LevelWallRandom);
            game.state.add('level11', LevelWallAscend);
            game.state.add('level12', LevelWallDecend);
            game.state.add('level13', LevelWallMix);
            game.state.start('boot');
              User.get({
                id: $window.localStorage.userId
              }).$promise.then(function(user) {
                $scope.user = user;
                $scope.gender = user.gender;
                if (user.settings) {
                  game.upperNote = user.settings.upperNote;
                  game.lowerNote = user.settings.lowerNote;
                  game.rootNote = user.settings.rootNote;
                }
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
              // save root note
              game.events.onVoiceSaved = new Phaser.Signal();
              game.events.onVoiceSaved.add(onVoiceSaved);
              // Load user medals
              $http.get('/medal/' + $window.localStorage.userId + "/flappybird")
                  .success(function(data) {
                      game.starArray = _.indexBy(data, 'level');
                      // game.starArray = data;
                  }).error(function(status, data) {
                      console.log("failed");
                      console.log(data);
                  });

            function onLevelCompleted(level, medal, score) {
                // Save Score
                ScoreService.save("flappybird", level, score);
                // Save Medals
                var levelScore = game.starArray[level];
                if (levelScore.medal >= medal && levelScore.score >= score) {
                    return;
                }
                levelScore.medal = Math.max(levelScore.medal, medal);
                levelScore.score = Math.max(levelScore.score, score);
                var userId = $window.localStorage.userId;
                  $http.post('/medal', levelScore).success(function(data) {
                    if (data && data.level) {
                      game.starArray[level] = data;
                    }
                  }).error(function(status, data) {
                      console.log("failed");
                      console.log(data);
                  });
            }

            function onSettingSaved(game, upperNote, lowerNote) {
                game.upperNote = upperNote;
                if (!$scope.user.settings) $scope.user.settings = {};
                $scope.user.settings.upperNote = upperNote;
                game.lowerNote = lowerNote;
                $scope.user.settings.lowerNote = lowerNote;
                $scope.user.$update(function() {
                });
            }

            function onVoiceSaved(game, rootNote) {
                game.rootNote = parseInt(rootNote);
                if (!$scope.user.settings) $scope.user.settings = {};
                $scope.user.settings.rootNote = rootNote;
                $scope.user.$update(function() {
                });
            }
        });
    });