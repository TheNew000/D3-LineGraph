myApp.controller('mainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    // This is the configuration we'll pass in to our Sparkline Directive
    $scope.sparklineConfig = {
      data: [{
        x: 1,
        y: 2
      }, {
        x: 2,
        y: -1
      }, {
        x: 3,
        y: 5
      }, {
        x: 4,
        y: 12
      }, {
        x: 5,
        y: 10
      }, {
        x: 6,
        y: 18
      }, {
        x: 7,
        y: 8
      }, {
        x: 8,
        y: 15
      }, {
        x: 9,
        y: 21
      }, {
        x: 10,
        y: 26
      }],
      showPoints: "no",
      interpolate: "linear"
    };

    // Using ng-options we can create a <select> that lets the user choose from these interpolations
    $scope.interpolateOptions = [
      "linear",
      "linear-closed",
      "step",
      "step-before",
      "step-after",
      "basis",
      "basis-open",
      "basis-closed",
      "bundle",
      "cardinal",
      "cardinal-open",
      "cardinal-closed",
      "monotone"
    ];

    // We'll broadcast config changes so we can refresh the viz
    $scope.configChange = function() {
      $rootScope.$broadcast("configChange");
    };

}]);
