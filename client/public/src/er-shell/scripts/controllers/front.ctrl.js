  define(['./module'], function(app) {
  	app.controller("FrontCtrl", function($scope, $location, $window, LoginSignupService) {
  		$scope.loginasguest = function() {
  				LoginSignupService.logIn("guest", "guest").success(function(data) {
  					if (data.status === "success") {
              $window.localStorage.userId = data.user._id;
              $window.localStorage.userType = data.user.userType;
  						$location.path("/home");
  					} else {
  						$scope.flashMessage = data.info;
  					}
  				}).error(function(status, data) {
  					console.log(status);
  					console.log(data);
  				});
  		};
  	});
  });