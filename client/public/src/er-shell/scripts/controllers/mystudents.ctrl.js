  define(['./module'], function(app) {
  	app.controller("MyStudentsCtrl", function($scope, $resource, $window) {
  		$scope.students = $resource('teachers/students/:id').query({
  			id: $window.localStorage.userId
  		});
  	});
  });