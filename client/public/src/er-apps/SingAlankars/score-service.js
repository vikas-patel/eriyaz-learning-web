  define(['./module'],function(app) {
    var base_url="";
    app.factory('ScoreService', function($http, $window) {
        return {
            save: function(exerciseName, score) {
                var userId = $window.localStorage.userId;
                $http.post(base_url + '/users/score', {
                    user: userId,
                    appName: "alankar",
                    exercise: exerciseName,
                    score:score
                }).success(function(data) {
                    // do nothing
                }).error(function(status, data) {
                    console.log("failed");
                    console.log(data);
                });
            },

            findAll: function() {
                var userId = $window.localStorage.userId;
                return $http.get(base_url + '/users/score/' + userId);
            },

            getScore: function(expected, actual) {
                var diff = Math.abs(expected - actual);
                return 1/(1+diff);
            },

            getTotalScore: function(lastTotal, lastScore, count) {
                return (lastTotal*count + lastScore)/(count + 1);
            }
        };
    });
});