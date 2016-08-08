var url = 'https://developer.trimet.org/ws/v2/vehicles?appID=B9704D175B3AE9A6657DD9129';
var http=require('https');
var express=require('express');
var app=express();
app.use(express.static(__dirname));

app.get('/vehicles',function(req,response){
	console.log("i received a get request");

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        console.log("Got a response: ", fbResponse.resultSet.vehicle[1].type);
        response.json(fbResponse.resultSet.vehicle);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
});
app.listen(3000);
console.log("server running on 3000");