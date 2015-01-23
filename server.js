var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
// var Tweet = require('./app/tweetrepo.js');

mongoose.connect("mongodb://localhost:27017/tweets_development");

app.use(express.static(__dirname + '/public'));

app.get('*', function(request, response) {
  response.sendFile(__dirname + '/public/views/index.html');
})

server.listen(port, function() {
  console.log('Server listening on port ' + port);
});
