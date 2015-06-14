  define(['./module'], function(app) {



  	app.controller("SignupCtrl", function($scope, $location, $window, LoginSignupService) {
  		$scope.submit = function() {
  			if ($scope.email !== undefined && $scope.password !== undefined && $scope.gender !== undefined && $scope.name !==undefined) {
  				LoginSignupService.signUp($scope.email, $scope.password, $scope.gender,$scope.name).success(function(data) {
  					console.log(data.info);
  					if (data.status === "success") {
              $window.localStorage.userId = data.user._id;
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