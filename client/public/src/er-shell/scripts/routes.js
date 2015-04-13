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
             onEnter: function(UIModel, $window) {
                 UIModel.uiModel.showLoginDialog = false;
                 UIModel.uiModel.showMenu = false;
                 delete $window.localStorage.userId;
                 UIModel.uiModel.showFront = true;
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
                 console.log($stateParams.s_id);
                 User.get({
                     id: $stateParams.s_id
                 }).$promise.then(function(data) {
                     UIModel.uiModel.title = data.name + '\'s Scores';
                 });

                 UIModel.uiModel.contentUrl = 'er-shell/html/history.html';
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
         }).
         state('alankars', {
             url: '/alankars',
             onEnter: function(UIModel, AppsInfoModel) {
                 UIModel.uiModel.showLoginDialog = false;
                 UIModel.uiModel.showMenu = true;
                 AppsInfoModel.setSelected(0);
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
                 AppsInfoModel.setSelected(1);
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
                 AppsInfoModel.setSelected(2);
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
                 AppsInfoModel.setSelected(3);
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
                 AppsInfoModel.setSelected(4);
                 UIModel.uiModel.showAppDialog = true;
             },
             resolve: {
                 onLoggedOutRedirect: checkLoginAndRedirect
             }
         });
     });
 });