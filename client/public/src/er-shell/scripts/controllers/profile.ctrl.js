  define(['./module'], function(app) {
    app.controller("ProfileCtrl", function($scope, $window, User, $resource) {
      User.get({
        id: $window.localStorage.userId
      }).$promise.then(function(data) {
        $scope.user = data;
        $scope.myteacher = User.get({
          id: data.teacher
        });
      });

      $scope.teachers = $resource('teachers').query();
     

      $scope.updateProfile = function() {
        if ($scope.myteacher)
          $scope.user.teacher = $scope.myteacher._id;
        else $scope.user.teacher=null;
        $scope.user.$update(function() {
          $scope.editing = false;
        });
      };
    });
  });