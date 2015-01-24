'use strict';

// import the moongoose helper utilities
var utils = require('../utils.js');
var expect = require('chai').expect;
// import our User mongoose model
var Tweet = require('../../app/tweetrepo.js');

describe('Tweet: models', function () {

  describe('#create()', function () {
    it('should create a new Tweet', function (done) {
      var tweet = {
        _id: "1",
        content: "test tweet",
        longitude: -51.00,
        latitude: 3.00,
        userId: "123",
        username: "ving"
      };
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
  });
});
