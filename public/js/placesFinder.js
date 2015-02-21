var PlacesFinder = function(googleAPI) {
  this.googleAPI = googleAPI;
  this.placesMarkerArray = [];
  this.chosenPlacesFilter = [''];
};

PlacesFinder.prototype.search = function(bounds) {
  for (var i = 0; i < this.placesMarkerArray.length; i++) {
    this.googleAPI.clearMarker(this.placesMarkerArray[i]);
  }
  this.placesMarkerArray = [];
  this.googleAPI.searchPlaces(this.chosenPlacesFilter, this.processSearch);
};

PlacesFinder.prototype.processSearch = function(searchResults, status) {
  this.createPlacesMarkers(searchResults, findHipSpots); /* ??? */
  if (this.markerClusterer) {
    this.googleAPI.clearClusterer(this.markerClusterer);
  }
  this.markerClusterer = this.googleAPI.createClusterer();
};

PlacesFinder.prototype.createPlacesMarkers = function(searchResults) {
  for (var i = 0; i < searchResults.length; i++) {
    this.createPlacesMarker(searchResults[i]);
  }
  // findHipSpots();
}

PlacesFinder.prototype.createPlacesMarker = function(place) {
  var placesMarker = this.googleAPI.createPlacesMarker(place);
  this.placesMarkerArray.push(placesMarker);
};
