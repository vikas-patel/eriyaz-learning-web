  define(['./module'], function(app) {
    app.controller("ProfileCtrl", function($scope, $window, User, $resource) {
      User.get({
        id: $window.localStorage.userId
      }).$promise.then(function(data) {
        $scope.user = data;
        if ($scope.user.dob) $scope.user.dob = new Date($scope.user.dob);
        $scope.teachers = $resource('teachers').query(function(resp){
              $scope.myteacher = $.grep(resp, function(teacher){return teacher._id == data.teacher; })[0];
          });
      });
     

      $scope.updateProfile = function() {
        if ($scope.myteacher)
          $scope.user.teacher = $scope.myteacher._id;
        else $scope.user.teacher=null;
        $scope.user.$update(function() {
          $scope.editing = false;
          if ($scope.user.dob) $scope.user.dob = new Date($scope.user.dob);
        });
      };
    });
  });