  define(['./module'], function(app) {
    app.factory('AppsInfoModel', function() {
      var appsInfo = {};
      appsInfo.apps = [{
        name: 'Alankars',
        thumb: 'er-shell/images/graph-thumb.jpg',
        desc: 'Do step by step guided singing exercises from easy to difficult.',
        href: '#alankars',
        appUrl: 'er-apps/SingGraph/main.html',
        aspectRatio: 41 / 20
      }, {
        name: 'Freestyle',
        thumb: 'er-shell/images/dial-thumb.jpg',
        desc: 'Practice free flow singing with immediate feedback on your pitch.',
        href: '#freestyle',
        appUrl: 'er-apps/PitchDial/main.html',
        aspectRatio: 5 / 6
      }, {
        name: 'UpOrDown',
        thumb: 'er-shell/images/upordown.jpg',
        desc: 'Can you tell if the second node higher or lower than the first note?',
        href: '#upordown',
        appUrl: 'er-apps/UpOrDown/main.html',
        aspectRatio: 9/10
      }, {
        name: 'MelodyGraph',
        thumb: 'er-shell/images/melodygraph.jpg',
        desc: 'Get familiar with ups and downs in the songs.',
        href: '#melodygraph',
        appUrl: 'er-apps/MelodyGraph/main.html',
        aspectRatio: 9/10
      }];
      appsInfo.selectedIndex = -1;
      appsInfo.setSelected = function(index) {
        this.selectedIndex = index;
      };

      appsInfo.getSelectedUrl = function() {
        if (this.selectedIndex == -1) return "";
        return this.apps[this.selectedIndex].appUrl;
      };

      appsInfo.getAspectRatio = function() {
        if (this.selectedIndex == -1) return 1;
        return this.apps[this.selectedIndex].aspectRatio;
      };
      return appsInfo;
    });
  });