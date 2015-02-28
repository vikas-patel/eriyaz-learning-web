  define(['./module'], function(app) {
    app.factory('AppsInfoModel', function() {
      var appsInfo = {};
      appsInfo.apps = [{
        name: 'Sing Graph',
        thumb: 'er-shell/images/singgraph.jpg',
        desc: 'Do step by step guided singing exercises from easy to difficult.',
        href: '#singgraph',
        appUrl: 'er-apps/SingGraph/main.html',
        aspectRatio: 41 / 20
      }, {
        name: 'Sing Dial',
        thumb: 'er-shell/images/singdial.jpg',
        desc: 'Practice free flow singing with immediate feedback on your pitch.',
        href: '#singdial',
        appUrl: 'er-apps/PitchDial/main.html',
        aspectRatio: 5 / 6
      }, ];
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