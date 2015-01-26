var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Tweet = require('./app/tweetrepo.js');
var database = require('./config/database.js');
var bodyParser = require('body-parser');

app.set('dburl', database.db[app.settings.env]);
mongoose.connect(app.get('dburl'));

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log("Connected to " + app.settings.env + " database");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/views/index.html');
});

app.post('/tweetinfo', function(request, response) {
  Tweet.find({ longitude: { $gt: request.body.swLongitude , $lt: request.body.neLongitude }, latitude: { $gt: request.body.swLatitude , $lt: request.body.neLatitude } }, { longitude: 1, latitude: 1, _id: 0 }, function(err, tweets) {
    if (err)
      response.send(err);
    response.json(tweets);
  });
});

server.listen(port, function() {
  console.log('Server listening on port ' + port);
});

// app.get('/tweetinfo', function(request, response) {
//   var tweetsArray = [];
//   var stream = Tweet.find().stream();
//   stream.on('data', function(tweet) {
//     tweetsArray.push([tweet.longitude, tweet.latitude])
//   }).on('close', function() {
//     response.json(tweetsArray);
//   });
// });
