  define(['./module'],function(app) {
    var base_url="";
    app.factory('ScoreService', function($http, $window) {
        return {
            save: function(exerciseId, score) {
                var userId = $window.sessionStorage.userId;
                $http.post(base_url + '/students/score', {
                    student: userId,
                    exercise: exerciseId,
                    score:score
                }).success(function(data) {
                    console.log("success");
                }).error(function(status, data) {
                    console.log("failed");
                    console.log(data);
                });
            },

            findAll: function() {
                var userId = $window.sessionStorage.userId;
                return $http.get(base_url + '/students/score/' + userId);
            }
        };
    });
});