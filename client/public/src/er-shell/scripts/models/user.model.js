  define(['./module'], function(app) {

    app.factory('User', function($resource) {
      return $resource('users/:id', {
        id: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    });
  });