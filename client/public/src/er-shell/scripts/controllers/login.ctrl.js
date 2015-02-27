  define(['./module'], function(app) {
  	app.controller("LoginCtrl", function($scope, $location, $window, LoginSignupService) {
  		$scope.submit = function() {
  			if ($scope.email !== undefined && $scope.password !== undefined) {
  				LoginSignupService.logIn($scope.email, $scope.password).success(function(data) {

  					if (data.status === "success") {
  						$window.sessionStorage.user = data.email;
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