  define(['./module'], function(app) {
  	app.controller("ProfileCtrl", function($scope, $window, User) {
  		$scope.user = User.get({
  			id: $window.sessionStorage.userId
  		});

  		$scope.updateProfile = function() {
  			$scope.user.$update(function() {
  				$scope.editing = false;
  			});
  		};
  	});
  });