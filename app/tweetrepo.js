var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({

  tweetId: Number, 
  createdAt: Date, 
  tweetContent: Text, 
  longitude: Number, 
  latitude: Number, 
  userId: Number, 
  username: Text, 

});

module.exports = mongoose.model('Tweet', TweetSchema);
