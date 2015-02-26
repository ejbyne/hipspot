var TweetsFinder = function(googleMap, placesFinder) {
  this.googleMap = googleMap;
  this.placesFinder = placesFinder;
};

TweetsFinder.prototype.defaultTimeSlot = function() {
  return Math.floor(new Date().getHours()/4) + 1;
};

TweetsFinder.prototype.tweetsSearch = function() {
  var _this = this;
  var searchParams = this.googleMap.getMapCoords();
  searchParams.timeSlot = this.chosenTimeSlot || this.defaultTimeSlot();
  $.post('/tweetinfo', searchParams, function(data) {
      _this.tweetData = data;
      _this.showTweetData();
  });
};

TweetsFinder.prototype.showTweetData = function() {
  if (this.heatMap) {
    this.googleMap.clearHeatMap(this.heatMap);
  }
  this.heatMap = this.googleMap.drawHeatMap(this.tweetData);
};

TweetsFinder.prototype.findHipSpots = function() {
  var _this = this;
  this.hipSpots = {};
  this.placesFinder.placesMarkerArray.forEach(function(marker) {
    _this.googleMap.resetMarkerIcon(marker, _this.placesFinder.chosenPlacesFilter);
    _this.compareTweetData(marker, _this);
    if (_this.isPopularPlace(marker)) {
      _this.googleMap.changeMarkerIcon(marker, _this.placesFinder.chosenPlacesFilter);
    }
  });
};

TweetsFinder.prototype.compareTweetData = function(marker, _this) {
  _this.tweetData.forEach(function(tweet) {
    if (_this.isTweetFromPlace(marker, tweet)) {
      _this.recordHipSpot(marker);
    }
  });
};

TweetsFinder.prototype.isTweetFromPlace = function(marker, tweet) {
  return (Math.abs(marker.position.k - tweet.latitude) < 0.0001 &&
    Math.abs(marker.position.D - tweet.longitude) < 0.0001);
};

TweetsFinder.prototype.recordHipSpot = function(marker) {
  if (this.hipSpots[marker.placeId]) {
    this.hipSpots[marker.placeId] = this.hipSpots[marker.placeId] += 1;
  } else {
    this.hipSpots[marker.placeId] = 1;
  }
};

TweetsFinder.prototype.isPopularPlace = function(marker) {
  return this.hipSpots[marker.placeId] > 3;
};
