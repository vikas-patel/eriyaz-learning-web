  define(['./module'], function(app) {
  	app.controller("MyStudentsCtrl", function($scope, $resource, $window, ngTableParams, $filter, $http) {
  		if ($scope.uiModel.userType == 'admin') {
  			$resource('users').query({} , function(users) {
            $scope.students = users;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                total: users.length, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                            $filter('orderBy')(users, params.orderBy()) :
                            users;
                    
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
  		} else {
  			$scope.students = $resource('teachers/students/:id').query({
	  			id: $window.localStorage.userId
	  		});
  		}
       $scope.sortType     = 'name';
      $scope.sortReverse  = false;
  		
      $scope.update = function(user) {
          user.$edit = false;
          $http.put('/users/'+user._id, user).success(function(data) {
              // do nothing
            }).error(function(status, data) {
                console.log("failed");
                console.log(data);
            });
      };
  	});
  });