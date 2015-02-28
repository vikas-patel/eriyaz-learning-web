define(['./app'], function(app) {
	app.run(function($templateCache,$http,AppsInfoModel) {
		for(var i=0;i<AppsInfoModel.apps.length;i++) {
			$http.get(AppsInfoModel.apps[i].appUrl, {cache:$templateCache});
		}
	});
});