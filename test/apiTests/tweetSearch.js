var config = require('../../config/database.js');
var mongoose = require('mongoose');
var Tweet = require('../../app/tweetrepo.js');
var api = require('hippie');
api.assert.showDiff = true;

if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db.test, function (err) {
      if (err) {
        throw err;
      }
      createTweets(runTests);
    });
} else {
  createTweets(runTests);
}

// It retrieves tweet data from the server

function createTweets(callback) {
  Tweet.create({ _id: '1', longitude: -0.070, latitude: 51.516, timeSlot: 4 });
  Tweet.create({ _id: '2', longitude: 0.000, latitude: 51.516, timeSlot: 4 });
  Tweet.create({ _id: '3', longitude: -0.075, latitude: 51.516, timeSlot: 3 });
  callback();
}

function runTests() {
  boundsTest();
  timeslotTest();
};

function boundsTest() {
  api()
    .json()
    .post('http://localhost:3000/tweetinfo')
    .send( {  neLatitude:   51.5189,
              neLongitude:  -0.0664,
              swLatitude:   51.5157,
              swLongitude:  -0.0804,
              timeSlot: 4
    })
    .expectStatus(200)
    .expectBody([{
      longitude: -0.07,
      latitude: 51.516
    }])
    .end(function(err, res, body) {
      if (err) { throw err; }
    });
}


function timeslotTest() {
  api()
    .json()
    .post('http://localhost:3000/tweetinfo')
    .send( {  neLatitude:   51.5189,
              neLongitude:  -0.0664,
              swLatitude:   51.5157,
              swLongitude:  -0.0804,
              timeSlot: 3
    })
    .expectStatus(200)
    .expectBody([{
      longitude: -0.075,
      latitude: 51.516
    }])
    .end(function(err, res, body) {
      if (err) { throw err; }
      process.exit(0);
    });
}

