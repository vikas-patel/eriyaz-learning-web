  define(['./module'], function(app) {
    app.factory('AppsInfoModel', function() {
      var appsInfo = {};
      appsInfo.apps = [{
        name: 'Sing Dial',
        thumb: 'eriyaz/images/singdial.jpg',
        desc: 'Get immediate feedback on your singing with Sing Dial',
        href: '#singdial',
        appUrl: 'eartonic-apps/PitchDialAngular/main.html',
        aspectRatio: 5/6
      }, {
        name: 'Sing Graph',
        thumb: 'eriyaz/images/singgraph.jpg',
        desc: 'Practice singing exercises',
        href: '#singgraph',
        appUrl: 'eartonic-apps/SingGraph/main.html',
        aspectRatio : 41/20
      }];
      appsInfo.selectedIndex = 0;
      appsInfo.setSelected = function(index) {
        this.selectedIndex = index;
      };

      appsInfo.getSelectedUrl = function() {
        return this.apps[this.selectedIndex].appUrl;
      };

      appsInfo.getAspectRatio = function() {
        return this.apps[this.selectedIndex].aspectRatio;
      };
      return appsInfo;
    });
  });