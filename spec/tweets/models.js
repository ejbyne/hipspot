'use strict';

var utils = require('../utils.js');
var expect = require('chai').expect;
var Tweet = require('../../app/tweetrepo.js');

var tweet = {
  _id: "1",
  content: "test tweet",
  longitude: -51.00,
  latitude: 3.00,
  userId: "123",
  username: "ving"
};

describe('Tweet: models', function () {

  describe('#create()', function () {
    it('should create a new Tweet', function (done) {
      Tweet.create(tweet, function (err, createdTweet) {
        expect(err).to.not.exist;
        expect(createdTweet._id).to.equal('1');
        expect(createdTweet.content).to.equal('test tweet');
        expect(createdTweet.longitude).to.equal(-51.00);
        expect(createdTweet.latitude).to.equal(3.00);
        expect(createdTweet.userId).to.equal("123");
        expect(createdTweet.username).to.equal("ving");
        done();
      });
    });

    it('should find all tweets in the db', function(done) {
      Tweet.create(tweet, function(err, createdTweet) {
        Tweet.find(function (err, tweets) {
          expect(tweets[0].username).to.equal("ving"); 
          done();
        });
      });
    });
  });
});
