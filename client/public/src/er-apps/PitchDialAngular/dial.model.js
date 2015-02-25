  define(['./module'], function(app) {
    var labels1 = ["P1", "m2", "M2", "m3", "M3", "P4", "TR", "P5", "m6", "M6", "m7", "M7", "P1"];
    var labels2 = ["Sa", "Re'", "Re", "Ga'", "Ga", "Ma", "Ma''", "Pa", "Dha'", "Dha", "Ni'", "Ni", "Sa"];
    var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni", "Sa"];
    var labelsWestern = ["1", "2b", "2", "3b", "3", "4", "4#/5b", "5", "6b", "6", "7b", "7", "1"];

    app.factory('DialModel', function($rootScope) {
      return {
        labels: labelsIndian,
        value: 0,
        setValue : function(val) {
          this.value=val;
          $rootScope.$broadcast('newvalue');
        }
      };
    });
  });