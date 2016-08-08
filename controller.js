var mapcontrol = angular.module('mapcontrol', []);
mapcontrol.controller('AppCtrl', ['$scope', '$http','$timeout', function($scope, $http,$timeout) {
    console.log("Hello World from controller");
    //loading data
var refresh=function(){
$http.get('/vehicles').success(function(response){
      console.log("i got the data");
      $scope.vehicles=response;
      //init map
      $timeout(function(){          
            var latlng = new google.maps.LatLng(45.518,-122.672);
            var myOptions = {
                zoom: 13,
                center: latlng,
                mapTypeControl: true,
                mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.TERRAIN
      ],
            };
            $scope.map = new google.maps.Map(document.getElementById("map"), myOptions); 
            $scope.overlay = new google.maps.OverlayView();
            $scope.overlay.draw = function() {}; // empty function required
            $scope.overlay.setMap($scope.map);
            $scope.element = document.getElementById('map');

            //markers
            for(i=0;i<$scope.vehicles.length;i++){
           var obj=$scope.vehicles[i];
        var marker = new google.maps.Marker({
      position: new google.maps.LatLng(obj.latitude,obj.longitude),
      map: $scope.map,
     });

};

          
        },100);
console.log($scope.vehicles[1].latitude);


});
}
refresh();



}]);

