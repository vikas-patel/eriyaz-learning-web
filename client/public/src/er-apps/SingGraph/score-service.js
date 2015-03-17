  define(['./module'],function(app) {
    var base_url="";
    app.factory('ScoreService', function($http) {
        return {
            save: function(studentId, exerciseId, score) {
                $http.post(base_url + '/students/score', {
                    student: studentId,
                    exercise: exerciseId,
                    score:score
                }).success(function(data) {
                    console.log("success");
                }).error(function(status, data) {
                    console.log("failed");
                    console.log(data);
                });
            },

            findAll: function(studentId) {
                return $http.get(base_url + '/students/score/' + studentId);
            }
        };
    });
});