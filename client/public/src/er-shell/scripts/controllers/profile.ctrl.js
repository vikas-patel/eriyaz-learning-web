  define(['./module'], function(app) {
  	app.controller("ProfileCtrl", function($scope, $window, Student) {
  		$scope.user = Student.get({
  			id: $window.sessionStorage.userId
  		});

  		$scope.updateProfile = function() {
  			$scope.user.$update(function() {
  				$scope.editing = false;
  			});
  		};
  	});
  });