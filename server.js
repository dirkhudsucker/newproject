var url = 'https://developer.trimet.org/ws/v2/vehicles?appID=B9704D175B3AE9A6657DD9129';
var url2= 'https://developer.trimet.org/ws/V1/stops?bbox=-123,45,-122,46&json=true&appID=B9704D175B3AE9A6657DD9129';
var http=require('https');
var express=require('express');
var app=express();
var routenumber=0;
var bodyparser=require('body-parser');
app.use(express.static(__dirname));
app.use(bodyparser.json());

app.get('/vehicles',function(req,response){
	console.log("i received a get request");

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        response.json(fbResponse.resultSet.vehicle);

    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
});
app.get('/locations',function(req,response){
	console.log("i received a get request");

http.get(url2, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        response.json(fbResponse.resultSet.location);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
});
app.post('/stops',function (req,res){
   routenumber=0;
   routenumber=req.body.routeNumber;
app.get('/stop',function(req,response){
if(routenumber!=0){
http.get('https://developer.trimet.org/ws/V1/routeConfig/route/'+routenumber+'/dir/1/tp/true/json/true/appid/B9704D175B3AE9A6657DD9129', function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        response.json(fbResponse.resultSet.route[0].dir[0].stop);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
}
});
});
app.listen(3000);
console.log("server running on 3000");