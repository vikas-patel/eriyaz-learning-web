  define(['./module'], function(app) {
  	app.controller("ProfileCtrl", function($scope, $window, Student) {
  		$scope.user = new Student();
  		$scope.user = Student.get({
  			id: $window.sessionStorage.userId
  		});

  		$scope.updateProfile = function() {
  			$scope.user.$update(function() {
  				// console.log('success');
  				$scope.editing = false;
  			});
  		};

  	});
  });