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
        desc: 'Practice small phrases with quick changes in pitches',
        href: '#freestylephrases',
        appUrl: 'er-apps/FreestylePhrases/main.html',
        aspectRatio: 5 / 3,
        show: false
      }, {
        name: 'SwarMastery',
        thumb: 'er-shell/images/swarmastery.jpg',
        desc: 'Practice hitting random individual notes correctly.',
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
        desc: 'Practice finding exact notes in small melodic phrases.',
        href: '#melodygraph2',
        appUrl: 'er-apps/MelodyGraph2/main.html',
        aspectRatio: 9 / 10,
        show: true
      }, {
        name: 'TimeTrainer',
        thumb: 'er-shell/images/timetrainer.jpg',
        desc: 'Basic rhythm training.',
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
        hotkeys: [
          ['s', 'startOrPause()']
        ],
        aspectRatio: 80 / 100,
        show: true
      }, {
        name: 'SwarSense',
        thumb: 'er-shell/images/swarsense.jpg',
        desc: 'Practice recognizing notes with reference to tanpura.',
        href: '#swarsense',
        appUrl: 'er-apps/SwarSense/main.html',
        aspectRatio: 2 / 3,
        show: false
      }, {
        name: 'RapidIntervals',
        thumb: 'er-shell/images/rapidintervals.jpg',
        desc: 'Learn to differentiate between two close intervals with fast rapidfire practice.',
        href: '#rapidintervals',
        appUrl: 'er-apps/RapidIntervals/main.html',
        hotkeys: [
          ['up', 'repeat()'],
          ['left', 'leftClick()'],
          ['right', 'rightClick()']
        ],
        aspectRatio: 2 / 3,
        show: false
      }, {
        name: 'Melakarta',
        thumb: 'er-shell/images/melakarta.jpg',
        desc: 'Exhaustive 72 Scales from the Carnatic Music System.',
        href: '#melakarta',
        appUrl: 'er-apps/Melakarta/main.html',
        aspectRatio: 5 / 3,
      }, {
        name: 'SargamTuner',
        thumb: 'er-shell/images/sargamtuner.jpg',
        desc: 'Recognize out of tune swars of sargam.',
        href: '#sargamtuner',
        appUrl: 'er-apps/SargamTuner/main.html',
        hotkeys: [
          ['n', 'newInterval()'],
          ['r', 'repeatPlay()']
        ],
        aspectRatio: 9 / 10,
        show: true
      }, {
        name: 'Melakarta2',
        thumb: 'er-shell/images/melakarta2.jpg',
        desc: 'Exhaustive 72 Scales from the Carnatic Music System.',
        href: '#melakarta2',
        appUrl: 'er-apps/Melakarta2/main.html',
        aspectRatio: 3/4,
      }, {
        name: 'FasterNotes',
        thumb: 'er-shell/images/fasternotes.jpg',
        desc: 'Speed up your note recognition.',
        href: '#melakarta2',
        appUrl: 'er-apps/FasterNotes/main.html',
        aspectRatio: 3/4,
      }, {
        name: 'RapidUpDown',
        thumb: 'er-shell/images/rapidupdown.jpg',
        desc: 'Speed Up your Up/Down recognition.',
        href: '#melakarta2',
        appUrl: 'er-apps/RapidUpDown/main.html',
        hotkeys: [
          ['up', 'isSame()'],
          ['left', 'isUp()'],
          ['right', 'isDown()']
        ],
        aspectRatio: 3/4,
      }, {
        name: 'ExtractNotes',
        thumb: 'er-shell/images/extractnotes.jpg',
        desc: 'Extract notes from a fast melody.',
        href: '#extractnotes',
        appUrl: 'er-apps/ExtractNotes/main.html',
        aspectRatio: 3/4,
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