  define(['./module'],function(app) {
    var base_url="";
    app.factory('ExerciseService', function($http, $window) {
        return {
            findAll: function() {
                //TODO: Append teacherId
                return $http.get(base_url + '/exercises');
            }
        };
    });
});