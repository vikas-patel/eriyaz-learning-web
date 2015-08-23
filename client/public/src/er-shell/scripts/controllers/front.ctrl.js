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

      $scope.register = function() {
        if ($scope.signup_form.$valid) {
          LoginSignupService.register($scope.name, $scope.email, $scope.mobile).success(function(data) {
            $scope.flashMessage = data.info;
          }).error(function(status, data) {
            $scope.flashMessage = "Something wrong: Please contact +91 8287459406 or eriyazonline@gmail.com for registration.";
            console.log(status);
            console.log(data);
          });
        } else {
          $scope.signup_form.submitted = true;
        }
      };

  	});
  });