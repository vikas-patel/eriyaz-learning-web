  define(['./module'], function(app) {
  	app.controller("FacebookCtrl", function($scope, $location, $window, $http, $sce) {
      (function(d){
       var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement('script'); js.id = id; js.async = true;
       js.src = "//connect.facebook.net/en_US/all.js";
       ref.parentNode.insertBefore(js, ref);
     }(document));

// Init the SDK upon load
window.fbAsyncInit = function() {
  FB.init({
    appId      : '463969353784069', // App ID
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  // respond to clicks on the login and logout links
  $('#fb-login').click(function(){
    FB.login(function(response) {
    if (response.authResponse) {
      // user has auth'd your app and is logged into Facebook
      $http({
            url: '/auth/facebook',
            method: "GET",
            params: {access_token: response.authResponse.accessToken}
         }).then(function(res) {
            var data = res.data;
            console.log(data);
            if (data.status === "success") {
              $window.localStorage.userId = data.user._id;
              $window.localStorage.userType = data.user.userType;
              $location.path("/home");
            } else {
              //$scope.flashMessage = data.info;
              $scope.flashMessage = $sce.trustAsHtml(data.info);
            }
        }, function(x) {
            console.log(x);
            // Request error
        });
    } else {
      // user has not auth'd your app, or is not logged into Facebook
      console.log("user has not given permission");
      $('#facebook-error').html("Couldn't get permissions from facebook");
    }
  });
  });
};
  	});
  });