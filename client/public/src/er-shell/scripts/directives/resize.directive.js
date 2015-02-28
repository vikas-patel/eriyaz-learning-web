define(['angular', './module'], function(angular, app) {
	
	app.directive('ngResize', function($window,$rootScope,UIModel,AppsInfoModel) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				var w = angular.element($window);
				scope.$watch(function() {
					return {
						'h': window.innerHeight,
						'w': window.innerWidth,
						'visible':UIModel.uiModel.showAppDialog,
						'selected':AppsInfoModel.selectedIndex
					};
				}, function(newValue, oldValue) {
					var aspectRatio = AppsInfoModel.getAspectRatio();
					var width;
					var height;
					if(newValue.w > newValue.h * aspectRatio) {
						height = newValue.h *0.95; 
						width = height * aspectRatio;
					} else {
						width = newValue.w * 0.95;
						height = width / aspectRatio;
					}

					//can use more margins in desktop
					if(newValue.w > 640) {
						height = height * 0.8;
						width = width * 0.8;
					}

					scope.style = function() {
						return {
							'height':height+ 'px',
							'width': width + 'px'
						};
					};
				},true);

				
				w.bind('resize', function() {
					scope.$apply();
				});
			}
		};
	});
});