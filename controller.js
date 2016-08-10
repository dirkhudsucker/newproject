var mapcontrol = angular.module('mapcontrol', ['angular.filter']);
var markers=[];
 var image = {
    url: 'image/bus.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
     anchor: new google.maps.Point(16, 16)
   
    // The anchor for this image is the base of the flagpole at (0, 32).
    
  };
var infowindow = new google.maps.InfoWindow();
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
            var map = new google.maps.Map(document.getElementById("map"), myOptions); 
mapcontrol.controller('AppCtrl', ['$scope', '$http','$timeout', function($scope, $http,$timeout) {
    console.log("Hello World from controller");
    //loading data
var refresh=function(){
$http.get('/vehicles').success(function(response){
      $scope.vehicles=response;
      for(i=0;i<$scope.vehicles.length;i++){
        var obj=$scope.vehicles[i];
        
        var marker = new google.maps.Marker({
      position: new google.maps.LatLng(obj.latitude,obj.longitude),
      icon: image,
      map: map,
     });
     markers.push(marker);
      var details = "<h5>RouteID:"+" "+"<mark>"+obj.routeNumber+"</mark>"+"</h5>"
      +"<h5>Direction:"+" "+"<mark>"+obj.direction+"</mark>"+"</h5>"
      +"<h5>Next Stop:"+" "+"<mark>"+obj.nextLocID+"</mark>"+"</h5>"
      +"<h5>Next Stop:"+" "+"<mark>"+obj.longitude+"</mark>"+"</h5>";
        bindInfoWindow(marker, map, infowindow, details);

     



};

  function bindInfoWindow(marker, map, infowindow, strDescription) {
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(strDescription);
        infowindow.open(map, marker);
    });
   
}   
      



});
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
refresh();
 $scope.select = {
    rate: null,
    names:['3000','6000','9000','10000']
   };


$scope.refreshrate=function(){
clearInterval($scope.handle);
if($scope.select.rate<9000){      
$scope.handle=setInterval(function(){   console.log($scope.select.rate); setMapOnAll(null); markers=[]; refresh(); }, $scope.select.rate);

}

};



}]);




