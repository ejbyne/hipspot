var PlacesFinder = function(googleAPI) {
  this.googleAPI = googleAPI;
  this.placesMarkerArray = [];
  this.placesArray = [];
};

PlacesFinder.prototype.placesSearch = function() {
  var _this = this;
  for (var i = 0; i < _this.placesMarkerArray.length; i++) {
    _this.googleAPI.clearMarker(_this.placesMarkerArray[i]);
  }
  this.placesMarkerArray = [];
  this.googleAPI.searchPlaces();
  // this.googleAPI.searchPlaces(this.processSearch);
};

PlacesFinder.prototype.processSearch = function(searchResults) {
  this.createPlacesMarkers(searchResults);
  if (this.markerClusterer) {
    this.googleAPI.clearClusterer(this.markerClusterer);
  }
  this.markerClusterer = this.googleAPI.createClusterer(this.placesMarkerArray);
};

PlacesFinder.prototype.createPlacesMarkers = function(searchResults) {
  var _this = this;
  for (var i = 0; i < searchResults.length; i++) {
    _this.createPlacesMarker(searchResults[i]);
  }
}

PlacesFinder.prototype.createPlacesMarker = function(place) {
  var placesMarker = this.googleAPI.createPlacesMarker(place);
  this.placesArray.push(place);
  this.placesMarkerArray.push(placesMarker);
};
