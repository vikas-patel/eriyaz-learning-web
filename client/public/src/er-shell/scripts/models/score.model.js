  define(['./module'], function(app) {

    app.factory('Score', function($resource) {
      return $resource('students/score/:id');
    });
  });