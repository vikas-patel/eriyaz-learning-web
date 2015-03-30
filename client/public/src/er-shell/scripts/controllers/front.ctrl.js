  define(['./module'], function(app) {
  	app.controller("FrontCtrl", function($scope, $location, $window, LoginSignupService) {
  		$scope.loginasguest = function() {
  				LoginSignupService.logIn("guest", "guest").success(function(data) {
  					if (data.status === "success") {
              $window.sessionStorage.userId = data.user._id;
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