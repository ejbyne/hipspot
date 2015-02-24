var PlacesFinder = function(googleMap) {
  this.googleMap = googleMap;
  this.placesMarkerArray = [];
  this.tweetsFinder = null;
  this.chosenPlacesFilter = null;
  this.placesImage = null;
};

PlacesFinder.prototype.placesSearch = function() {
  var _this = this;
  this.placesMarkerArray.forEach(function(marker) {
    _this.googleMap.clearMarker(marker);
  });
  this.placesMarkerArray = [];
  if (this.chosenPlacesFilter) {
    this.googleMap.searchPlaces(this);
  }
};

PlacesFinder.prototype.processSearch = function(searchResults) {
  this._createPlacesMarkers(searchResults);
  if (this.markerClusterer) {
    this.googleMap.clearClusterer(this.markerClusterer);
  }
  this.markerClusterer = this.googleMap.createClusterer(this.placesMarkerArray, this.placesImage);
};

PlacesFinder.prototype._createPlacesMarkers = function(searchResults) {
  for (var i = 0; i < searchResults.length; i++) {
    this._createPlacesMarker(searchResults[i]);
    if (i === searchResults.length-1) {
      this.tweetsFinder.findHipSpots();
    }
  }
};

PlacesFinder.prototype._createPlacesMarker = function(place) {
  var placesMarker = this.googleMap.createPlacesMarker(place, this.placesImage);
  this.placesMarkerArray.push(placesMarker);
};
