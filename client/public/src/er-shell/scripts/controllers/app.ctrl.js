  define(['./module', 'socketio-client'], function(app, io) {
  	app.controller("AppCtrl", function($scope, $rootScope, UIModel, LoginSignupDialogModel,AppsInfoModel, hotkeys, $location) {
  		$scope.uiModel = UIModel.uiModel;
  		$scope.loginSignupDialogModel = LoginSignupDialogModel.loginSignupDialogModel;
  		$scope.appsInfo = AppsInfoModel;
      // socket operations
      var socket = io.connect();
      socket.on('connect', function(data) {
          console.log("socket connected");
      });
        // register mouse event handlers
        document.onmousedown = function(e){
                if (!e.shiftKey) return true;
                var xpath = getXPath(e.target);
                var data = {type:"click", element: xpath};
                socket.emit('event', data);
          return true;
        };

        var isShiftKey = false;
        document.onkeydown = function (e) {
            if (e.keyCode == 16) {
              isShiftKey = true;
              return;
            }
            if (!isShiftKey) return true;
            var data = {type: "keydown", "keyCode": e.keyCode};
            socket.emit('event', data);
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
          var data = {type:"change", element: xpath, value: value};
          socket.emit('event', data);
        };
       
      socket.on('event', function (data) {
        if (data.type == 'click') {
            var elem = lookupElementByXPath(data.element);
            elem.click();
        } else if (data.type == 'change') {
          var elem = lookupElementByXPath(data.element);
          elem.value = data.value;
        } else if (data.type == 'keydown') {
            var keyCode = data.keyCode;
            var keyEvent = new KeyboardEvent("keydown", {keyCode: keyCode, which: keyCode});
            delete keyEvent.keyCode;
            Object.defineProperty(keyEvent, "keyCode", {"value" : keyCode});
            delete keyEvent.which;
            Object.defineProperty(keyEvent, "which", {"value" : keyCode});
            document.dispatchEvent(keyEvent);
        }
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
                    action: 'keydown',
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