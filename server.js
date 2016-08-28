var url = 'https://developer.trimet.org/ws/v2/vehicles?appID=';
var url2= 'https://developer.trimet.org/ws/V1/stops?bbox=-123,45,-122,46&json=true&appID=';
var key;
var http=require('https');
var express=require('express');
var app=express();
var access=
{"access":[0,1]};
var routenumber=0;
var bodyparser=require('body-parser');
app.use(express.static(__dirname));
app.use(bodyparser.json());
app.post('/key',function (req,res){
   key="";
   key=req.body.key;
app.get('/access',function(req,response){
http.get('https://developer.trimet.org/ws/V1/trips/tripplanner/fromplace/pdx/toplace/zoo/appId/'+key, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        if(body.length>50){
        response.json(access.access[1]);
    } else{
        response.json(access.access[0]);
    }
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
});
});
app.get('/vehicles',function(req,response){
	console.log("i received a get request for vehicle locations");

http.get(url+key, function(res){
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
	console.log("i received a get for locations");
http.get(url2+key, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        if(body.length>50){
        var fbResponse = JSON.parse(body);
        response.json(fbResponse.resultSet.location);
    } else{console.log("wrong api key")}
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
http.get('https://developer.trimet.org/ws/V1/routeConfig/route/'+routenumber+'/dir/1/tp/true/json/true/appid/'+key, function(res){
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