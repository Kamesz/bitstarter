var fs = require('fs');

var text = fs.readFileSync("index.html");
var buffer = new Buffer( text, 'utf-8');

var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    response.send(buffer.toString('utf-8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});