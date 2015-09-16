  define(['./module'], function(app) {
    app.controller("JournalCtrl", function($scope, $window, $http, User, $resource) {
      //$scope.messages = ["Practiced 20 mins today.", "No practice today."];
      // User.get({
      //   id: $window.localStorage.userId
      // }).$promise.then(function(data) {
      //   $scope.user = data;
      //   if ($scope.user.dob) $scope.user.dob = new Date($scope.user.dob);
      //   $scope.teachers = $resource('teachers').query(function(resp){
      //         $scope.myteacher = $.grep(resp, function(teacher){return teacher._id == data.teacher; })[0];
      //     });
      // });
      $scope.predefinedMsgs = ["5 mins practice.", "10 mins practice.", "> 30 mins practice", "no practice"];
      $scope.postMessage = function() {
          var userId = $window.localStorage.userId;
          var body = {
              user: userId,
              message: $scope.post,
              date: new Date()
          };
          $http.post('/journal', body).success(function(data) {
              $scope.journals.push(data);
              $scope.post = "";
          }).error(function(status, data) {
              console.log("failed");
              console.log(data);
          });
      };

      $scope.getAllJournals = function() {
          var userId = $window.localStorage.userId;
          $http.get('/journal/' + userId)
          .success(function(data) {
              $scope.journals = data;
          }).error(function(status, data) {
              console.log("failed");
              console.log(data);
          });
      };

      $scope.chooseMessage = function() {
        $scope.post = $scope.selectBox;
      };

      $scope.getAllJournals();
     
    });
  });