var PlacesFinder = function(googleMap) {
  this.googleMap = googleMap;
  this.placesMarkerArray = [];
  this.placesArray = [];
};

PlacesFinder.prototype.placesSearch = function() {
  for (var i = 0; i < this.placesMarkerArray.length; i++) {
    this.googleMap.clearMarker(this.placesMarkerArray[i]);
  }
  this.placesMarkerArray = [];
  if (this.chosenPlacesFilter) {
    this.googleMap.searchPlaces();
  }
};

PlacesFinder.prototype.processSearch = function(searchResults) {
  this.createPlacesMarkers(searchResults);
  if (this.markerClusterer) {
    this.googleMap.clearClusterer(this.markerClusterer);
  }
  this.markerClusterer = this.googleMap.createClusterer();
};

PlacesFinder.prototype.createPlacesMarkers = function(searchResults) {
  for (var i = 0; i < searchResults.length; i++) {
    this.createPlacesMarker(searchResults[i]);
    if (i === searchResults.length-1) {
      this.tweetsFinder.findHipSpots();
    }
  }
}

PlacesFinder.prototype.createPlacesMarker = function(place) {
  var placesMarker = this.googleMap.createPlacesMarker(place, this.placesImage);
  this.placesArray.push(place);
  this.placesMarkerArray.push(placesMarker);
  console.log(placesMarker);
};
