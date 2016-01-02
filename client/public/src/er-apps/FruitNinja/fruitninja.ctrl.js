define(['./module', './states/Boot', './states/Loading', './states/Levels', './states/Title',
 './states/Classic', './states/TimeAttack', './states/Level2'], 
    function(app, Boot, Loading, Levels, Title, Classic, TimeAttack, Level2) {
        app.controller('FruitNinjaCtrl', function($scope, User, $window, $http) {
            
            var game = new Phaser.Game(576, 505, Phaser.AUTO, 'fruitNinja');
            game.starArray = {};

            // Game States
            game.state.add("Boot", new Boot);
            game.state.add("Loading", new Loading);
            game.state.add("Levels", new Levels);
            game.state.add("Title", new Title);
            game.state.add("Classic", new Classic);
            game.state.add("Level2", new Level2);
            //game.state.add("TimeAttack", new TimeAttack);
            game.state.start("Boot", true, false, "er-apps/FruitNinja/assets/levels/title_screen.json", "Title", true);

            if (!game.events) game.events = {};
            game.events.onLevelCompleted = new Phaser.Signal();
            game.events.onLevelCompleted.add(onLevelCompleted);
            // Load user medals
            $http.get('/medal/' + $window.localStorage.userId + "/fruitninja")
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