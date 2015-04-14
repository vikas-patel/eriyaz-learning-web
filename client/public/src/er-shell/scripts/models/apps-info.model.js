  define(['./module'], function(app) {
    app.factory('AppsInfoModel', function() {
      var appsInfo = {};
      appsInfo.apps = [{
        name: 'Alankars',
        thumb: 'er-shell/images/graph-thumb.jpg',
        desc: 'Do step by step guided singing exercises from easy to difficult.',
        href: '#alankars',
        appUrl: 'er-apps/SingGraph/main.html',
        aspectRatio: 41 / 20,
        show:true
      }, {
        name: 'Freestyle',
        thumb: 'er-shell/images/dial-thumb.jpg',
        desc: 'Practice free flow singing with immediate feedback on your pitch.',
        href: '#freestyle',
        appUrl: 'er-apps/PitchDial/main.html',
        aspectRatio: 5 / 6,
        show:true
      }, {
        name: 'UpOrDown',
        thumb: 'er-shell/images/upordown.jpg',
        desc: 'Can you tell if the second node higher or lower than the first note?',
        href: '#upordown',
        appUrl: 'er-apps/UpOrDown/main.html',
        aspectRatio: 9/10,
        show:true
      }, {
        name: 'MelodyGraph',
        thumb: 'er-shell/images/melodygraph.jpg',
        desc: 'Get familiar with ups and downs in the songs.',
        href: '#melodygraph',
        appUrl: 'er-apps/MelodyGraph/main.html',
        aspectRatio: 9/10,
        show:true
      }, {
        name: 'SwarSpace',
        thumb: 'er-shell/images/swarspace.jpg',
        desc: 'Develop a sense of space between two notes - how far apart they are?',
        href: '#swarspace',
        appUrl: 'er-apps/SwarSpace/main.html',
        aspectRatio: 9/10,
        show:true
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