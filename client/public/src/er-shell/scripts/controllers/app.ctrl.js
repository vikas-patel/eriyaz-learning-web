  define(['./module'], function(app) {
  	app.controller("AppCtrl", function($scope, $rootScope, UIModel, LoginSignupDialogModel,AppsInfoModel, hotkeys, $location) {
  		$scope.uiModel = UIModel.uiModel;
  		$scope.loginSignupDialogModel = LoginSignupDialogModel.loginSignupDialogModel;
  		$scope.appsInfo = AppsInfoModel;
      // socket operations
      var socket = io.connect();
      socket.on('connect', function(data) {
          console.log("connected");
      });
        // register mouse event handlers
        document.onmousedown = function(e){
          var xpath = getXPath(e.target);
          if (!e.shiftKey) return true;
          // if (!e.target.nodeName || e.target.nodeName.toLowerCase() == "SELECT".toLowerCase()) return true;
          socket.emit('click', xpath);
          return true;
        };

        var isShiftKey = false;
        document.onkeydown = function (e) {
            if (e.keyCode == 16) {
              isShiftKey = true;
            }
        };

        document.onkeyup = function (e) {
            if (e.keyCode == 16) {
              isShiftKey = false;
            }
        };

        document.onchange = function (event) {
          if (!isShiftKey) return true;
          var xpath = getXPath(event.target);
          var value = event.target.value;
          socket.emit('change', [xpath, value]);
        };

      socket.on('change', function (data) {
        var elem = lookupElementByXPath(data[0]);
        elem.value = data[1];
      });
       
      socket.on('click', function (data) {
        var elem = lookupElementByXPath(data);
        elem.click();
     });

      function getXPath(node) {
        var comp, comps = [];
        var parent = null;
        var xpath = '';
        var getPos = function(node) {
            var position = 1, curNode;
            if (node.nodeType == Node.ATTRIBUTE_NODE) {
                return null;
            }
            for (curNode = node.previousSibling; curNode; curNode = curNode.previousSibling) {
                if (curNode.nodeName == node.nodeName) {
                    ++position;
                }
            }
            return position;
         }

        if (node instanceof Document) {
            return '/';
        }

        for (; node && !(node instanceof Document); node = node.nodeType == Node.ATTRIBUTE_NODE ? node.ownerElement : node.parentNode) {
            comp = comps[comps.length] = {};
            switch (node.nodeType) {
                case Node.TEXT_NODE:
                    comp.name = 'text()';
                    break;
                case Node.ATTRIBUTE_NODE:
                    comp.name = '@' + node.nodeName;
                    break;
                case Node.PROCESSING_INSTRUCTION_NODE:
                    comp.name = 'processing-instruction()';
                    break;
                case Node.COMMENT_NODE:
                    comp.name = 'comment()';
                    break;
                case Node.ELEMENT_NODE:
                    comp.name = node.nodeName;
                    break;
            }
            comp.position = getPos(node);
        }

        for (var i = comps.length - 1; i >= 0; i--) {
            comp = comps[i];
            xpath += '/' + comp.name;
            if (comp.position != null) {
                xpath += '[' + comp.position + ']';
            }
        }

        return xpath;

    }

      function lookupElementByXPath(path) { 
          var evaluator = new XPathEvaluator(); 
          var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
          return  result.singleNodeValue; 
      }
              
  		// global short-cut
  		hotkeys.add({
                    combo: "esc",
                    description: '',
                    persistent: true,
                    callback: function() {
                    	if (AppsInfoModel.selectedIndex < 0) return;
                        $location.path("home");
                    }
                  });
  		$rootScope.$watch(function() {return AppsInfoModel.selectedIndex}, function() {
  				if (AppsInfoModel.selectedIndex < 0) {
  					hotkeys.purgeHotkeys();
  					return;
  				}
                var keys = AppsInfoModel.apps[AppsInfoModel.selectedIndex].hotkeys;
                if (!keys) return;
                angular.forEach(keys, function (key) {
                	hotkeys.add({
                    combo: key[0],
                    description: '',
                    persistent: false,
                    callback: function() {
                        var scope = angular.element($('#selected-app').children().first()).scope();
                        scope.$eval(key[1]);
                    }
                  });
                })
             }
	   );
  	});
  });