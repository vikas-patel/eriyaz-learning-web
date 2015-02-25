  define(['./module'], function(app) {
  	app.controller("AppCtrl", function($scope, UIModel, LoginSignupDialogModel,AppsInfoModel) {
  		$scope.uiModel = UIModel.uiModel;
  		$scope.loginSignupDialogModel = LoginSignupDialogModel.loginSignupDialogModel;
  		$scope.appsInfo = AppsInfoModel;
  	});
  });