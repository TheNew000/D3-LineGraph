
// Main App Module
var myApp = angular.module('myApp', ['widgets', 'd3', 'controllers', 'directive']);

// All the Dependency Modules
var d3Module = angular.module('d3', []);
var widgetModule = angular.module('widgets', []);
var controllerModule = angular.module('controllers', []);
var directiveModule = angular.module('directive', ['d3']);

myApp.controller('mainCtrl', function($scope){
    $scope.here = "Working!";
});
