  define(['./module'], function(app) {

      app.factory('UIModel', function() {
          return {
              uiModel: {
                  showMenu: false,
                  showFront: false,
                  showLoginDialog: false,
                  showAppDialog: false
              }
          };
      });
  });