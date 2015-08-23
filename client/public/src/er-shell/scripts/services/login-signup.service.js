  define(['./module'],function(app) {


    // var base_url = 'http://localhost:3000';
    var base_url="";
    app.factory('LoginSignupService', function($http) {
        return {
            logIn: function(email, password) {
                return $http.post(base_url + '/login', {
                    email: email,
                    password: password
                });
            },

            signUp: function(email, password, gender, name, mobile) {
                return $http.post(base_url + '/signup', {
                    email: email,
                    password: password,
                    gender:gender,
                    name:name,
                    mobile:mobile
                });
            },

            register: function(name, email, mobile) {
                return $http.post(base_url + '/register', {
                    'entry.1769033687': name,
                    'entry.109852712': email,
                    'entry.1154736723':mobile
                });
            }
        };
    });
});