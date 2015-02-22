var TweetsFinder = function(googleAPI, placesFinder) {
  this.googleAPI = googleAPI;
  this.placesFinder = placesFinder;
};

TweetsFinder.prototype.defaultTimeSlot = function() {
  return Math.floor(new Date().getHours()/4) + 1;
};

TweetsFinder.prototype.tweetsSearch = function() {
  var _this = this;
  this.chosenTimeSlot = this.chosenTimeSlot || this.defaultTimeSlot();
  var mapCoords = this.googleAPI.getMapCoords(this.chosenTimeSlot);
  $.post('/tweetinfo', mapCoords, function(data) {
    if (Array.isArray(data)) {
      _this.showTweetData(data);
      _this.tweetData = data;
      _this.findHipSpots();
    }
  });
};

TweetsFinder.prototype.showTweetData = function(data) {
  if (this.heatMap) {
    this.googleAPI.clearHeatMap(this.heatMap);
  }
  this.heatMap = this.googleAPI.drawHeatMap(data);
};

TweetsFinder.prototype.findHipSpots = function() {
  this.hipSpots = {};
  for (var i = 0; i < this.placesFinder.placesMarkerArray.length; i++) {
    this.googleAPI.resetMarkerIcon(this.placesFinder.placesMarkerArray[i]);
    for (var j = 0; j < this.tweetData.length; j++) {
      if (this.isTweetFromPlace(i, j)) {
        this.recordHipSpot(i);
        if (this.isPopularPlace(i))
          this.changeMarkerIcon(placesArray[i]);
      }
    }
  }
};

TweetsFinder.prototype.changeMarkerIcon = function(place) {
  for (var i = 0; i < this.placesFinder.placesMarkerArray.length; i++) {
    if (this.placesFinder.placesMarkerArray[i].placeId === place.place_id) {
      this.googleAPI.changeMarkerIcon(this.placesFinder.placesMarkerArray[i]);
    }
  }
};

TweetsFinder.prototype.isTweetFromPlace = function(i, j) {
  return (Math.abs(this.placesFinder.placesArray[i].geometry.location.lat() - this.tweetData[j].latitude) < 0.0001 &&
  Math.abs(this.placesFinder.placesArray[i].geometry.location.lng() - this.tweetData[j].longitude) < 0.0001);
};

TweetsFinder.prototype.isPopularPlace = function(i) {
  return this.hipSpots[this.placesFinder.placesArray[i].place_id] > 3;
};

TweetsFinder.prototype.recordHipSpot = function(i) {
  if (this.hipSpots[this.placesFinder.placesArray[i].place_id]) {
    this.hipSpots[this.placesFinder.placesArray[i].place_id] = this.hipSpots[this.placesFinder.placesArray[i].place_id] += 1;
  } else {
    this.hipSpots[this.placesFinder.placesArray[i].place_id] = 1;
  }
};
