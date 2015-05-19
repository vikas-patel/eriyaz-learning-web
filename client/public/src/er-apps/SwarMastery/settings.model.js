  define(['./module'], function(app) {
    app.factory('SettingsModel', function() {
      return {
        rootNote : 56,
        selectedNotes : [0,2,4,5,7,9,11,12]
      };
    });
  });