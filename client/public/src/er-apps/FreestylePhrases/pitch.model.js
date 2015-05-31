  define(['./module'], function(app) {
    app.factory('PitchModel', function() {
      return {
        rootFreq : 123.4,
        currentFrequency: 110,
        currentInterval : 0
      };
    });
  });