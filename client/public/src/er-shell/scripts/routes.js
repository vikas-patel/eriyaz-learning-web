 define(['./app', 'angular-ui-router'], function(app) {
     var checkLoginAndRedirect = function($q, $window, $location) {
         if ($window.sessionStorage.userId === undefined)
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
                     if ($window.sessionStorage.userId !== undefined)
                         $location.path('/home');
                     return true;
                 }
             }
         }).
         state('login', {
             url: '/login',
             onEnter: function(UIModel,LoginSignupDialogModel) {
                 UIModel.uiModel.showMenu = false;
                 UIModel.uiModel.showAppDialog = false;
                 LoginSignupDialogModel.loginSignupDialogModel.selection = 'login';
                 UIModel.uiModel.showFront = true;
                 UIModel.uiModel.showLoginDialog = true;
             },
             resolve: {
                 onLoggedInRedirect: function($q, $location, $window) {
                     if ($window.sessionStorage.userId !== undefined)
                         $location.path('/home');
                     return true;
                 }
             }
         }).
         state('signup', {
             url: '/signup',
             onEnter: function(UIModel,LoginSignupDialogModel) {
                 UIModel.uiModel.showMenu = false;
                 LoginSignupDialogModel.loginSignupDialogModel.selection = 'signup';
                 UIModel.uiModel.showFront = true;
                 UIModel.uiModel.showLoginDialog = true;
             },
             resolve: {
                 onLoggedInRedirect: function($q, $location, $window) {
                     if ($window.sessionStorage.userId !== undefined)
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
                 delete $window.sessionStorage.userId;
                 UIModel.uiModel.showFront = true;
             }
         }).
         state('home', {
             url: '/home',
             onEnter: function(UIModel) {
                 UIModel.uiModel.showAppDialog = false;
                 UIModel.uiModel.showLoginDialog = false;
                 UIModel.uiModel.showFront = false;
                 UIModel.uiModel.showMenu = true;
                 UIModel.uiModel.contentUrl = 'er-shell/html/home.html';
             },
             resolve: {
                 onLoggedOutRedirect: checkLoginAndRedirect
             }
         }).
         state('history', {
             url: '/history',
             onEnter: function(UIModel) {
                 UIModel.uiModel.showAppDialog = false;
                 UIModel.uiModel.showLoginDialog = false;
                 UIModel.uiModel.showFront = false;
                 UIModel.uiModel.showMenu = true;
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
                 UIModel.uiModel.contentUrl = 'er-shell/html/profile.html';
             },
             resolve: {
                 onLoggedOutRedirect: checkLoginAndRedirect
             }
         }).
         state('alankars', {
             url: '/alankars',
             onEnter: function(UIModel,AppsInfoModel) {
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
             onEnter: function(UIModel,AppsInfoModel) {
                 UIModel.uiModel.showLoginDialog = false;
                 UIModel.uiModel.showMenu = true;
                 AppsInfoModel.setSelected(1);
                 UIModel.uiModel.showAppDialog = true;
             },
             resolve: {
                 onLoggedOutRedirect: checkLoginAndRedirect
             }
         });
     });
 });