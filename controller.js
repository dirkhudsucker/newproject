var mapcontrol = angular.module('mapcontrol', ['angular.filter']);
  


mapcontrol.controller('AppCtrl', ['$scope', '$http','$q','$log','$timeout', function($scope, $http,$q,$log,$timeout) {
   //setting window:
   $scope.accesskey={
    username:null,
    key:null
   };
   $scope.initialize=function(){
    $http.post('/key',$scope.accesskey);
    console.log($scope.accesskey.key);
    $http.get('/access').success(function(response){
      var access=response;
      if(access==1){
        $('#initiator').css({'visibility':'hidden'}); 
       $('#setting').css({'visibility':'visible'}); 
       alert("Success key, loading...")
      $q.when().then(getloc).then(refresh);
    } else{
      alert("Wrong key or this is not 25-digit")
    }
    })
  }
   
    $('#setting').click(function(){
     clearInterval($scope.handle);
     x=x+1;
    if(x%2==1){$('#menu').css({'visibility':'visible'})};
    if(x%2==0){$('#menu').css({'visibility':'hidden'})};

  });   
    var image = {
    url: 'image/bus.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
     anchor: new google.maps.Point(16, 16)
   
    // The anchor for this image is the base of the flagpole at (0, 32).
    
  };
var x=0;
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

    console.log("Hello World from controller");
    //loading data and building all the markers
function bindInfoWindow(marker, map, infowindow, strDescription) {
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(strDescription);
        infowindow.open(map, marker);
    });
   
}
function markerfilter(){
    setMapOnAll(null);
 for(var i=0;i<$scope.vehicles.length;i++){
  for(var j=0;j<$scope.result.length;j++)
    if($scope.vehicles[i].routeNumber==$scope.result[j]){
     $scope.markers[i].setMap(map);
    }
 }   
}
$scope.setting=false;
$scope.stopmarker=[];
$scope.result=[];
$scope.loc=[];
$scope.locid=[];
var getloc= function() {
  var deferred=$q.defer();  
$http.get('/locations').success(function(response){
   $scope.loc=response;
   for(i=0;i<$scope.loc.length;i++){
    $scope.locid.push($scope.loc[i].locid);
   }
   deferred.resolve();
   })
   return deferred.promise;
   }
var refresh=function(){
$http.get('/vehicles').success(function(response){
      $scope.markers=[];
      $scope.nextloc=[];
      $scope.lastloc=[];
      $scope.vehicles=response;
      for(i=0;i<$scope.vehicles.length;i++){
        var obj=$scope.vehicles[i];
        var marker = new google.maps.Marker({
      position: new google.maps.LatLng(obj.latitude,obj.longitude),
      icon: image,
      map: map,
     });
    $scope.markers.push(marker);
    var n=$scope.locid.indexOf(obj.nextLocID);
    if(n!=-1){$scope.nextloc.push($scope.loc[n].desc)};
    if(n==-1){$scope.nextloc.push("unknown")};
    var m=$scope.locid.indexOf(obj.lastLocID);
    if(m!=-1){$scope.lastloc.push($scope.loc[m].desc)};
    if(m==-1){$scope.lastloc.push("unknown")};
     if($scope.setting==false){
        $scope.result.push(obj.routeNumber);
        }
      var details = "<h5>RouteID:"+" "+"<mark>"+obj.routeNumber+"</mark>"+"</h5>"
      +"<h5>Direction:"+" "+"<mark>"+obj.direction+"</mark>"+"</h5>"
      +"<h5>Next Stop:"+" "+"<mark>"+$scope.nextloc[i]+"</mark>"+"</h5>"
      +"<h5>Last Stop:"+" "+"<mark>"+$scope.lastloc[i]+"</mark>"+"</h5>"
      +"<h5>Description:"+" "+"<mark>"+obj.signMessageLong+"</mark>"+"</h5>"
      + "<h5>On time:"+" "+"<mark>"+obj.delay+" secs</mark>"+"</h5>";
        bindInfoWindow(marker, map, infowindow, details);      

};
markerfilter();
});
}
//visualizing
function setMapOnAll(map) {
  for (var i = 0; i < $scope.markers.length; i++) {
    $scope.markers[i].setMap(map);
  }
}
 $scope.select = {
    rate: null,
    names:['3000','6000','9000','10000']
   };

//refresh rate function
$scope.refreshing=function(){
  x=x+1;
 if($scope.SelectedRoute!="a") {
 if($scope.stopmarker.length>0){
 for(var i=0;i<$scope.stopmarker.length;i++){
$scope.stopmarker[i].setMap(null);
}  
}
$scope.bounds = new google.maps.LatLngBounds();
$scope.stopmarker=[];
$scope.setting=true;
$scope.result=[];
clearInterval($scope.handle);
if($scope.select.rate<=9000){      
$scope.handle=setInterval(function(){setMapOnAll(null); $scope.markers=null; refresh(); }, $scope.select.rate);
}

  $scope.result.push($scope.SelectedRoute.routeNumber);
markerfilter();

$('#menu').css({'visibility':'hidden'});

$http.post('/stops',$scope.SelectedRoute);

$http.get('/stop').success(function(response){
$scope.stops=response;
for(var i=0;i<$scope.stops.length;i++){
 var obj=$scope.stops[i];
 var marker = new google.maps.Marker({
      position: new google.maps.LatLng(obj.lat,obj.lng),
      map: map,
      zIndex:1
     });
 $scope.bounds.extend(marker.getPosition());
 $scope.stopmarker.push(marker);
  var details = "<h5>Stop Name:"+" "+"<mark>"+obj.desc+"</mark>"+"</h5>"
      +"<h5>Coordinates:"+" "+"<mark>"+obj.lng+", "+obj.lat+"</mark>"+"</h5>";
 bindInfoWindow(marker, map, infowindow, details); 
}
map.setCenter($scope.bounds.getCenter());
});
} if($scope.SelectedRoute==""){
alert("Please select")  
}

}




}]);




