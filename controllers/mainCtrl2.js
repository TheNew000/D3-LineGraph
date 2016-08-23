myApp.controller('mainCtrl2', ['$scope', function($scope){
    // $scope.onClick = function(item) {
    //     $scope.$apply(function() {
    //         if (!$scope.showDetailPanel)
    //             $scope.showDetailPanel = true;
    //         $scope.detailItem = item;
    //     });
    // };
    // $scope.greeting = "Resize the page to see the re-rendering";
    $scope.data = [
        {date: "1-May-12", value: 58.13},
        {date: "30-Apr-12",    value:  53.98},
        {date: "27-Apr-12",     value: 67.00},
        {date: "26-Apr-12",   value: 89.70},
        {date: "25-Apr-12", value: 99.00},
        {date: "24-Apr-12",     value: 130.28}
    ];

}]);
