  define(['./module'], function(app) {
  	app.controller("LoginCtrl", function($scope, $location, $window, $sce, LoginSignupService, LoginSignupDialogModel) {
  		$scope.submit = function() {
  			if ($scope.email !== undefined && $scope.password !== undefined) {
  				LoginSignupService.logIn($scope.email, $scope.password).success(function(data) {
  					if (data.status === "success") {
              $window.localStorage.userId = data.user._id;
              $window.localStorage.userType = data.user.userType;
  						$location.path("/home");
  					} else {
  						//$scope.flashMessage = data.info;
              $scope.flashMessage = $sce.trustAsHtml(data.info);
  					}
  				}).error(function(status, data) {
  					console.log(status);
  					console.log(data);
  				});
  			}
  		};

      $scope.forgot = function() {
          LoginSignupService.forgot($scope.email).success(function(data) {
            $scope.flashMessage = data;
          }).error(function(data, status) {
            $scope.flashMessage = data;
          });
      };

      $scope.reset = function() {
          LoginSignupService.reset(LoginSignupDialogModel.loginSignupDialogModel.token, $scope.password).success(function(data) {
            $scope.flashMessage = data;
            $scope.success = true;
          }).error(function(data, status) {
            $scope.flashMessage = data;
          });
      };
  	});
  });