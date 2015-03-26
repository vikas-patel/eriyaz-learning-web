  define(['./module'], function(app) {

    app.factory('Student', function($resource) {
      return $resource('students/:id', {
        id: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    });
  });