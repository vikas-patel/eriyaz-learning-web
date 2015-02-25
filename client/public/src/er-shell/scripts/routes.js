 define(['./app', 'angular-ui-router'], function(app) {
     var checkLoginAndRedirect = function($q, $window, $location) {
         if ($window.sessionStorage.user === undefined)
             $location.path('/login');
         return true;
     };
     app.config(function($stateProvider, $urlRouterProvider) {
         $stateProvider.
         state('front', {
             url: '',
             // templateUrl : 'front.html',
             onEnter: function(UIModel) {
                 UIModel.uiModel.showFront = true;
                 UIModel.uiModel.showMenu = false;
                 UIModel.uiModel.showLoginDialog = false;
             },
             resolve: {
                 onLoggedInRedirect: function($q, $location, $window) {
                     if ($window.sessionStorage.user !== undefined)
                         $location.path('/home');
                     return true;
                 }
             }
         }).
         state('login', {
             url: '/login',
             onEnter: function(UIModel,LoginSignupDialogModel) {
                 LoginSignupDialogModel.loginSignupDialogModel.selection = 'login';
                 UIModel.uiModel.showMenu = false;
                 UIModel.uiModel.showFront = true;
                 UIModel.uiModel.showLoginDialog = true;
             },
             resolve: {
                 onLoggedInRedirect: function($q, $location, $window) {
                     if ($window.sessionStorage.user !== undefined)
                         $location.path('/home');
                     return true;
                 }
             }
         }).
         state('signup', {
             url: '/signup',
             onEnter: function(UIModel,LoginSignupDialogModel) {
                 LoginSignupDialogModel.loginSignupDialogModel.selection = 'signup';
                 UIModel.uiModel.showMenu = false;
                 UIModel.uiModel.showFront = true;
                 UIModel.uiModel.showLoginDialog = true;
             },
             resolve: {
                 onLoggedInRedirect: function($q, $location, $window) {
                     if ($window.sessionStorage.user !== undefined)
                         $location.path('/home');
                     return true;
                 }
             }
         }).
         state('logout', {
             url: '/logout',
             onEnter: function(UIModel, $window) {
                 delete $window.sessionStorage.user;
                 UIModel.uiModel.showFront = true;
                 UIModel.uiModel.showMenu = false;
                 UIModel.uiModel.showLoginDialog = false;
             }
         }).
         state('home', {
             url: '/home',
             onEnter: function(UIModel) {
                 UIModel.uiModel.showFront = false;
                 UIModel.uiModel.showMenu = true;
                 UIModel.uiModel.contentUrl = 'er-shell/html/home.html';
                 UIModel.uiModel.showLoginDialog = false;
                 UIModel.uiModel.showAppDialog = false;
             },
             resolve: {
                 onLoggedOutRedirect: checkLoginAndRedirect
             }
         }).
         state('singdial', {
             url: '/singdial',
             onEnter: function(UIModel,AppsInfoModel) {
                 UIModel.uiModel.showMenu = true;
                 UIModel.uiModel.showLoginDialog = false;
                 AppsInfoModel.setSelected(0);
                 UIModel.uiModel.showAppDialog = true;
             },
             resolve: {
                 onLoggedOutRedirect: checkLoginAndRedirect
             }
         }).
         state('singgraph', {
             url: '/singgraph',
             onEnter: function(UIModel,AppsInfoModel) {
                 UIModel.uiModel.showMenu = true;
                 UIModel.uiModel.showLoginDialog = false;
                 AppsInfoModel.setSelected(1);
                 UIModel.uiModel.showAppDialog = true;
             },
             resolve: {
                 onLoggedOutRedirect: checkLoginAndRedirect
             }
         });
     });
 });