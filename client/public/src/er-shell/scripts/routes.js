 define(['./app', 'angular-ui-router'], function(app) {
     var checkLoginAndRedirect = function($q, $window, $location) {
         if ($window.localStorage.userId === undefined)
             $location.path('/login');
         return true;
     };
     app.config(function($stateProvider, $urlRouterProvider) {
             $stateProvider.
             state('front', {
                 url: '',
                 // templateUrl : 'front.html',
                 onEnter: function(UIModel) {
                     UIModel.uiModel.showMenu = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = true;
                 },
                 resolve: {
                     onLoggedInRedirect: function($q, $location, $window) {
                         if ($window.localStorage.userId !== undefined)
                             $location.path('/home');
                         return true;
                     }
                 }
             }).
             state('login', {
                 url: '/login',
                 onEnter: function(UIModel, LoginSignupDialogModel) {
                     UIModel.uiModel.showMenu = false;
                     UIModel.uiModel.showAppDialog = false;
                     LoginSignupDialogModel.loginSignupDialogModel.selection = 'login';
                     UIModel.uiModel.showFront = true;
                     //UIModel.uiModel.showLoginDialog = true;
                 },
                 resolve: {
                     onLoggedInRedirect: function($q, $location, $window) {
                         if ($window.localStorage.userId) {
                             $location.path('/home');
                         }
                         return true;
                     }
                 }
             }).
             state('signup', {
                 url: '/signup',
                 onEnter: function(UIModel, LoginSignupDialogModel) {
                     UIModel.uiModel.showMenu = false;
                     LoginSignupDialogModel.loginSignupDialogModel.selection = 'signup';
                     UIModel.uiModel.showFront = true;
                     UIModel.uiModel.showLoginDialog = true;
                 },
                 resolve: {
                     onLoggedInRedirect: function($q, $location, $window) {
                         if ($window.localStorage.userId !== undefined)
                             $location.path('/home');
                         return true;
                     }
                 }
             }).
             state('logout', {
                 url: '/logout',
                 onEnter: function(UIModel, $window, $http) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = false;
                     $http.get('/logout').success(function(data) {
                    }).error(function() {
                    });
                     delete $window.localStorage.userId;
                     UIModel.uiModel.showFront = true;
                 }
             }).
             state('forgot', {
                 url: '/forgot',
                 onEnter: function(UIModel, LoginSignupDialogModel) {
                     UIModel.uiModel.showMenu = false;
                     UIModel.uiModel.showAppDialog = false;
                     LoginSignupDialogModel.loginSignupDialogModel.selection = 'forgot';
                     UIModel.uiModel.showFront = true;
                     UIModel.uiModel.showLoginDialog = true;
                 }
             }).
             state('reset', {
                 url: '/reset/:token',
                 onEnter: function(UIModel, LoginSignupDialogModel, $stateParams) {
                     UIModel.uiModel.showMenu = false;
                     UIModel.uiModel.showAppDialog = false;
                     LoginSignupDialogModel.loginSignupDialogModel.selection = 'reset';
                     LoginSignupDialogModel.loginSignupDialogModel.token = $stateParams.token;
                     UIModel.uiModel.showFront = true;
                     UIModel.uiModel.showLoginDialog = true;
                 }
             }).
             state('home', {
                 url: '/home',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showAppDialog = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = false;
                     UIModel.uiModel.showMenu = true;
                     UIModel.uiModel.contentUrl = 'er-shell/html/home.html';
                     AppsInfoModel.setSelected(-1);
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('history', {
                 url: '/history',
                 onEnter: function(UIModel, $stateParams, $window) {
                     UIModel.uiModel.showAppDialog = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = false;
                     UIModel.uiModel.showMenu = true;
                     UIModel.uiModel.title = 'My Scores';
                     $stateParams.s_id = $window.localStorage.userId;
                     UIModel.uiModel.contentUrl = 'er-shell/html/history.html';
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('s_history', {
                 url: '/history/:s_id',
                 onEnter: function(UIModel, User, $stateParams) {
                     UIModel.uiModel.showAppDialog = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = false;
                     UIModel.uiModel.showMenu = true;
                     User.get({
                         id: $stateParams.s_id
                     }).$promise.then(function(data) {
                         UIModel.uiModel.title = data.name ? data.name : data.local.email + '\'s Scores';
                     });

                     UIModel.uiModel.contentUrl = 'er-shell/html/history.html';
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('journal', {
                 url: '/journal',
                 onEnter: function(UIModel) {
                     UIModel.uiModel.showAppDialog = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = false;
                     UIModel.uiModel.showMenu = true;
                     UIModel.uiModel.title = 'My Journal';
                     UIModel.uiModel.contentUrl = 'er-shell/html/journal.html';
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('profile', {
                 url: '/profile',
                 onEnter: function(UIModel) {
                     UIModel.uiModel.showAppDialog = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = false;
                     UIModel.uiModel.showMenu = true;
                     UIModel.uiModel.title = 'My Profile';
                     UIModel.uiModel.contentUrl = 'er-shell/html/profile.html';
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('contact', {
                 url: '/contact',
                 onEnter: function(UIModel) {
                     UIModel.uiModel.showAppDialog = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = false;
                     UIModel.uiModel.showMenu = true;
                     UIModel.uiModel.title = 'My Profile';
                     UIModel.uiModel.contentUrl = 'er-shell/html/contact.html';
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('students', {
                 url: '/students',
                 onEnter: function(UIModel) {
                     UIModel.uiModel.showAppDialog = false;
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showFront = false;
                     UIModel.uiModel.showMenu = true;
                     UIModel.uiModel.title = 'My Students';
                     UIModel.uiModel.contentUrl = 'er-shell/html/mystudents.html';
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).state('songpractice', {
                 url: '/songpractice',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(0);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).state('flappybird', {
                 url: '/flappybird',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(1);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('voicematch2', {
                 url: '/voicematch2',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(2);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('singinggame2', {
                 url: '/singinggame2',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(3);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('alankars', {
                 url: '/alankars',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(4);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('freestyle', {
                 url: '/freestyle',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(5);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('upordown', {
                 url: '/upordown',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(6);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('melodygraph', {
                 url: '/melodygraph',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(7);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('swarspace', {
                 url: '/swarspace',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(8);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('swarposition', {
                 url: '/swarposition',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(9);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('voicematch', {
                 url: '/voicematch',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(10);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('swarmastery', {
                 url: '/swarmastery',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(11);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('melodygraph2', {
                 url: '/melodygraph2',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(12);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('voicerange', {
                 url: '/voicerange',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(13);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('swarsense', {
                 url: '/swarsense',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(14);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('rapidintervals', {
                 url: '/rapidintervals',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(15);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('melakarta', {
                 url: '/melakarta',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(16);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('sargamtuner', {
                 url: '/sargamtuner',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(17);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('melakarta2', {
                 url: '/melakarta2',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(18);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('fasternotes', {
                 url: '/fasternotes',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(19);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('fasternotes2', {
                 url: '/fasternotes2',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(20);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('rapidupdown', {
                 url: '/rapidupdown',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(21);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('extractnotes', {
                 url: '/extractnotes',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(22);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('singsargam', {
                 url: '/singsargam',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(23);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('countnotes', {
                 url: '/countnotes',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(24);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('tonesmemory', {
                 url: '/tonesmemory',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(25);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('poorvanga', {
                 url: '/poorvanga',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(26);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('phraseshape', {
                 url: '/phraseshape',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(27);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('fruitninja', {
                 url: '/fruitninja',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(37);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('thatmemorizer', {
                 url: '/thatmemorizer',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(28);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('singgraph', {
                 url: '/singgraph',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(29);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('freestylephrases', {
                 url: '/freestylephrases',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(30);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).state('singinggame', {
                 url: '/singinggame',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(31);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).state('timetrainer', {
                 url: '/timetrainer',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(32);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('fastsinging', {
                 url: '/fastsinging',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(33);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('singphrases', {
                 url: '/singphrases',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(34);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('uttaranga', {
                 url: '/uttaranga',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(35);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).
             state('freestyle2', {
                 url: '/freestyle2',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(36);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             }).state('monsterblaster', {
                 url: '/monsterblaster',
                 onEnter: function(UIModel, AppsInfoModel) {
                     UIModel.uiModel.showLoginDialog = false;
                     UIModel.uiModel.showMenu = true;
                     AppsInfoModel.setSelected(37);
                     UIModel.uiModel.showAppDialog = true;
                 },
                 resolve: {
                     onLoggedOutRedirect: checkLoginAndRedirect
                 }
             });
         })
         .factory('authHttpResponseInterceptor', ['$q', '$location', '$window', function($q, $location, $window) {
             return {
                 response: function(response) {
                     return response || $q.when(response);
                 },
                 responseError: function(rejection) {
                     if (rejection.status === 401) {
                         console.log("Response Error 401", rejection);
                         $window.localStorage.userId = "";
                         $location.path('/login');
                         //TODO: redirect to original page.
                         //$location.path('/login').search('returnTo', $location.path());
                     }
                     return $q.reject(rejection);
                 }
             }
         }])
         .config(['$httpProvider', function($httpProvider) {
             //Http Intercpetor to check auth failures for xhr requests
             $httpProvider.interceptors.push('authHttpResponseInterceptor');
         }]);
 });