  define(['./module'], function(app) {
  	app.controller("MyStudentsCtrl", function($scope, $resource, $window) {
  		if ($scope.uiModel.userType == 'admin') {
  			$scope.students = $resource('users').query({
		  			//id: $window.localStorage.userId
		  		});
  		} else {
  			$scope.students = $resource('teachers/students/:id').query({
	  			id: $window.localStorage.userId
	  		});
  		}
  		
  	});
  });