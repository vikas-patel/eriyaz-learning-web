  define(['./module'], function(app) {
  	app.controller("LoginCtrl", function($scope, $location, $window, LoginSignupService) {
  		$scope.submit = function() {
  			if ($scope.email !== undefined && $scope.password !== undefined) {
  				LoginSignupService.logIn($scope.email, $scope.password).success(function(data) {
              console.log(data.user._id);
  					if (data.status === "success") {
  						$window.sessionStorage.user = data.user;
              $window.sessionStorage.userId = data.user._id;
  						$location.path("/home");
  					} else {
  						$scope.flashMessage = data.info;
  					}
  				}).error(function(status, data) {
  					console.log(status);
  					console.log(data);
  				});
  			}
  		};
  	});
  });