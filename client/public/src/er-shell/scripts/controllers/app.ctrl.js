  define(['./module'], function(app) {
  	app.controller("AppCtrl", function($scope, $rootScope, UIModel, LoginSignupDialogModel,AppsInfoModel, hotkeys) {
  		$scope.uiModel = UIModel.uiModel;
  		$scope.loginSignupDialogModel = LoginSignupDialogModel.loginSignupDialogModel;
  		$scope.appsInfo = AppsInfoModel;
  		$rootScope.$watch(function() {return AppsInfoModel.selectedIndex}, function() {
  				if (AppsInfoModel.selectedIndex < 0) return;
                var keys = AppsInfoModel.apps[AppsInfoModel.selectedIndex].hotkeys;
                if (!keys) return;
                angular.forEach(keys, function (key) {
                	hotkeys.add({
                    combo: key[0],
                    description: '',
                    callback: function() {
                        var scope = angular.element($('#selected-app').children().first()).scope();
                        scope.$eval(key[1]);
                    }
                  });
                })
             }
	   );
  	});
  });