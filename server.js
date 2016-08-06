var url = 'https://developer.trimet.org/ws/v2/vehicles?appID=B9704D175B3AE9A6657DD9129';
var http=require('https');

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        console.log("Got a response: ", fbResponse.resultSet.queryTime);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});