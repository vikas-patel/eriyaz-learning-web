  define(['./module'],function(app) {
    var base_url="";
    app.factory('ScoreService', function($http, $window) {
        return {
            save: function(appName, exerciseName, score) {
                var userId = $window.localStorage.userId;
                $http.post(base_url + '/users/score', {
                    user: userId,
                    appName: appName,
                    exercise: exerciseName,
                    score:score
                }).success(function(data) {
                    // do nothing
                }).error(function(status, data) {
                    console.log("failed");
                    console.log(data);
                });
            },

            addTime: function(appName, time, startTime, endTime, sync) {
                var userId = $window.localStorage.userId;
                if (sync) {
                    var xmlhttp=new XMLHttpRequest();
                    xmlhttp.open("POST", '/users/time', false);
                    xmlhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                    xmlhttp.send(JSON.stringify({
                        user: userId,
                        appName: appName,
                        time: time,
                        startTime:startTime,
                        endTime:endTime
                    }));
                    return;
                }
                $http.post(base_url + '/users/time', {
                    user: userId,
                    appName: appName,
                    time: time,
                    startTime:startTime,
                    endTime:endTime
                }).success(function(data) {
                    // do nothing
                }).error(function(status, data) {
                    console.log("failed");
                    console.log(data);
                });
            },

            findTopScores: function(userId) {
                return $http.get(base_url + '/users/topScore/' + userId);
            },

            findAllScores: function(userId) {
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