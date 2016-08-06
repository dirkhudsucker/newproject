var mapcontrol = angular.module('mapcontrol', []);
mapcontrol.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

$http.get('/vehicles').success(function(response){
      console.log("i got the data");
      $scope.vehicles=response;
});

}]);