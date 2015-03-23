var MapController = function(googleMap, googleSearchBox, placesFinder, tweetsFinder) {
  this.googleMap = googleMap;
  this.googleSearchBox = googleSearchBox;
  this.placesFinder = placesFinder;
  this.tweetsFinder = tweetsFinder;
};

MapController.prototype.setCurrentPosition = function(position) {
  this.userLatitude = position.coords.latitude;
  this.userLongitude = position.coords.longitude;
};

MapController.prototype.performSearch = function() {
  this.placesFinder.placesSearch();
  this.tweetsFinder.tweetsSearch();
  this.eventHandler.resetSearchBoxValue();
};

MapController.prototype.loadMap = function(position) {
  this.setCurrentPosition(position);
  this.googleMap.createMap(this.userLatitude, this.userLongitude);
  this.googleMap.addPlacesService();
  this.googleMap.addMapListener(this);
  this.currentPositionMarker = this.googleMap.createCurrentPositionMarker(
    this.userLatitude, this.userLongitude
  );
  this.googleSearchBox.addSearchBox(this.googleMap.map);
  this.eventHandler.showMap();
};

MapController.prototype.updatePosition = function(position) {
  if (this.currentPositionMarker) {
    this.googleMap.clearMarker(this.currentPositionMarker);
  }
  this.setCurrentPosition(position);
  this.currentPositionMarker = this.googleMap.createCurrentPositionMarker(
    this.userLatitude, this.userLongitude
  );
};
