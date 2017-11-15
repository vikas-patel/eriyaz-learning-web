  define(['./module'], function(app) {
    app.factory('PitchModel', function() {
      return {
        rootFreq : 110,
        currentFrequency: 110,
        currentInterval : 0
      };
    });
  });