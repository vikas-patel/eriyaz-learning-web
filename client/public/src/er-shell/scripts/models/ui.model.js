  define(['./module'], function(app) {

      app.factory('UIModel', function($window) {
          return {
              uiModel: {
                  showMenu: false,
                  showFront: false,
                  showLoginDialog: false,
                  showAppDialog: false,
                  isTeacher : $window.sessionStorage.isTeacher
              }
          };
      });
  });