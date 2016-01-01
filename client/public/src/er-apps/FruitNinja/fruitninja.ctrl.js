define(['./module','webaudioplayer', 'currentaudiocontext', './states/Boot', './states/Loading', './states/Levels', './states/Title',
 './states/Classic', './states/TimeAttack'], 
    function(app, Player, CurrentAudioContext, Boot, Loading, Levels, Title, Classic, TimeAttack) {
        app.controller('FruitNinjaCtrl', function($scope, User, $window, $http) {
            
            var game = new Phaser.Game(576, 505, Phaser.AUTO, 'fruitNinja');

            // var audioContext = CurrentAudioContext.getInstance();
            // game.player = new Player(audioContext);
            game.starArray = {};

            // Game States
            game.state.add("Boot", new Boot);
            game.state.add("Loading", new Loading);
            game.state.add("Levels", new Levels);
            game.state.add("Title", new Title);
            game.state.add("Classic", new Classic);
            game.state.add("TimeAttack", new TimeAttack);
            game.state.start("Boot", true, false, "er-apps/FruitNinja/assets/levels/title_screen.json", "Title", true);

            // TODO: small range in level 1
            // Set flexible root note.
            // Position stars better
            // Variable star numbers
            // Highest score
            // End of level: flag or trophy
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