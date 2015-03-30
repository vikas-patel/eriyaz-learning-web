  define(['./module'], function(app) {

    app.factory('Score', function($resource) {
      return $resource('users/score/:id');
    });
  });