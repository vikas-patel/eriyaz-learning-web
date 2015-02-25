  define(['./module'], function(app) {

      app.factory('AppsInfoModel', function() {
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