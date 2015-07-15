  define(['./module', 'timeMe'], function(app) {
      app.factory('AppsInfoModel', function(ScoreService, $window) {
          var appsInfo = {};
          appsInfo.apps = [{
              name: 'Alankars',
              thumb: 'er-shell/images/singalankars.jpg',
              desc: 'Do step by step guided singing exercises from easy to difficult.',
              href: '#alankars',
              appUrl: 'er-apps/SingAlankars/main.html',
              aspectRatio: 41 / 20,
              show: true
          }, {
              name: 'Freestyle',
              thumb: 'er-shell/images/dial-thumb.jpg',
              desc: 'Practice free flow singing with immediate feedback on your pitch.',
              href: '#freestyle',
              appUrl: 'er-apps/PitchDial/main.html',
              aspectRatio: 5 / 6,
              show: true
          }, {
              name: 'UpOrDown',
              thumb: 'er-shell/images/upordown.jpg',
              desc: 'Can you tell if the second node higher or lower than the first note?',
              href: '#upordown',
              appUrl: 'er-apps/UpOrDown/main.html',
              hotkeys: [
                  ['n', 'newProblem()'],
                  ['r', 'repeat()'],
                  ['up', 'isUp()'],
                  ['down', 'isDown()']
              ],
              aspectRatio: 9 / 10,
              show: true
          }, {
              name: 'MelodyGraph',
              thumb: 'er-shell/images/melodygraph.jpg',
              desc: 'Get familiar with ups and downs in the songs.',
              href: '#melodygraph',
              appUrl: 'er-apps/MelodyGraph/main.html',
              hotkeys: [
                  ['n', 'newSequence()'],
                  ['r', 'repeat()'],
                  ['p', 'playMyGraph()'],
                  ['c', 'check()']
              ],
              aspectRatio: 9 / 10,
              show: true
          }, {
              name: 'SwarSpace',
              thumb: 'er-shell/images/swarspace.jpg',
              desc: 'Develop a sense of space between two notes - how far apart they are?',
              href: '#swarspace',
              appUrl: 'er-apps/SwarSpace/main.html',
              hotkeys: [
                  ['n', 'newInterval()'],
                  ['r', 'repeatPlay()']
              ],
              aspectRatio: 9 / 10,
              show: true
          }, {
              name: 'SwarPosition',
              thumb: 'er-shell/images/swarposition.jpg',
              desc: 'Practice regonizing the exact swar, by using its position in the sargam.',
              href: '#swarposition',
              appUrl: 'er-apps/SwarPosition/main.html',
              hotkeys: [
                  ['n', 'newInterval()'],
                  ['r', 'repeatPlay()']
              ],
              aspectRatio: 9 / 10,
              show: true
          }, {
              name: 'ThatMemorizer',
              thumb: 'er-shell/images/thatmemorizer.jpg',
              desc: 'Learn to differentiate between Thats. Start with selecting just two of them and add more one by one.',
              href: '#thatmemorizer',
              appUrl: 'er-apps/ThatMemorizer/main.html',
              aspectRatio: 9 / 10,
              show: true
          }, {
              name: 'SingGraph',
              thumb: 'er-shell/images/singgraph.jpg',
              desc: 'Practice free flow singing with immediate feedback on your pitch.',
              href: '#singgraph',
              appUrl: 'er-apps/SingGraph/main.html',
              aspectRatio: 5 / 3,
              show: false
          }, {
              name: 'VoiceMatch',
              thumb: 'er-shell/images/voicematch.jpg',
              desc: 'Practice matching your voice to the tone of the instrument.',
              href: '#voicematch',
              appUrl: 'er-apps/VoiceMatch/main.html',
              hotkeys: [
                  ['n', 'new()'],
                  ['r', 'repeat()'],
                  ['m', 'startMic()']
              ],
              aspectRatio: 80 / 100,
              show: true
          }, {
              name: 'FreestylePhrases',
              thumb: 'er-shell/images/freestylephrases.jpg',
              desc: 'Practice matching your voice to the tone of the instrument.',
              href: '#freestylephrases',
              appUrl: 'er-apps/FreestylePhrases/main.html',
              aspectRatio: 5 / 3,
              show: false
          }, {
              name: 'SwarMastery',
              thumb: 'er-shell/images/swarmastery.jpg',
              desc: 'Practice matching your voice to the tone of the instrument.',
              href: '#swarmastery',
              appUrl: 'er-apps/SwarMastery/main.html',
              hotkeys: [
                  ['n', 'newNote()'],
                  ['m', 'startMic()']
              ],
              aspectRatio: 2 / 3,
              show: true
          }, {
              name: 'MelodyGraph2',
              thumb: 'er-shell/images/melodygraph2.jpg',
              desc: 'Practice matching your voice to the tone of the instrument.',
              href: '#melodygraph2',
              appUrl: 'er-apps/MelodyGraph2/main.html',
              aspectRatio: 9 / 10,
              show: true
          }, {
              name: 'TimeTrainer',
              thumb: 'er-shell/images/timetrainer.jpg',
              desc: 'Practice matching your voice to the tone of the instrument.',
              href: '#timetrainer',
              appUrl: 'er-apps/TimeTrainer/main.html',
              aspectRatio: 9 / 10,
              show: false
          }, {
              name: 'VoiceRange',
              thumb: 'er-shell/images/voicerange.jpg',
              desc: 'Know your voice range.',
              href: '#voicerange',
              appUrl: 'er-apps/VoiceRange/main.html',
              aspectRatio: 80/100,
              show: true
          }, {
              name: 'SwarSense',
              thumb: 'er-shell/images/swarsense.jpg',
              desc: 'Know your voice range.',
              href: '#swarsense',
              appUrl: 'er-apps/SwarSense/main.html',
              aspectRatio: 2/3,
              show: true
          }];
          appsInfo.selectedIndex = -1;
          TimeMe.setIdleDurationInSeconds(60);
          appsInfo.setSelected = function(index) {
              // exit an app.
              if (this.selectedIndex > -1 && index == -1) {
                  TimeMe.stopTimer();
                  var lastPage = this.apps[this.selectedIndex].name;
                  var timeSpent = TimeMe.getTimeOnCurrentPageInSeconds();
                  // Upload time to the server.
                  if (timeSpent > 10) {
                      ScoreService.addTime(lastPage, Math.round(timeSpent), TimeMe.startTime, new Date(), false);
                  }
              } else if (index > -1) {
                  TimeMe.stopTimer();
                  TimeMe.setCurrentPageName(this.apps[index].name);
                  TimeMe.startTimer();
                  TimeMe.startTime = new Date();
              }
              this.selectedIndex = index;
          };

          $window.onbeforeunload = function(event) {
              if (appsInfo.selectedIndex > -1) {
                  TimeMe.stopTimer();
                  var lastPage = appsInfo.apps[appsInfo.selectedIndex].name;
                  var timeSpent = TimeMe.getTimeOnCurrentPageInSeconds();
                  // Upload time to the server.
                  if (timeSpent > 10) {
                      ScoreService.addTime(lastPage, Math.round(timeSpent), TimeMe.startTime, new Date(), true);
                  }
              }
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