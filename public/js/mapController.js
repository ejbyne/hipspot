var MapController = function(googleMap, placesFinder, tweetsFinder) {
	this.googleMap = googleMap;
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
  $("#pac-input").val('');
};

MapController.prototype.showMap = function() {
  $('#map-canvas').show();
  $('.sticky').show();
  $('footer').show();
  $('.splashScreen').hide();
};

MapController.prototype.initialize = function(position) {
  this.setCurrentPosition(position);
  this.googleMap.createMap(this.userLatitude, this.userLongitude);
  this.googleMap.addPlacesService();
  this.googleMap.addMapListener(this);
  this.currentPositionMarker = this.googleMap.createCurrentPositionMarker(
    this.userLatitude, this.userLongitude
  );
  this.googleMap.addSearchBox();
  this.showMap();
  this.googleMap.placesFinder = this.placesFinder;
  this.googleMap.tweetsFinder = this.tweetsFinder;
  this.placesFinder.tweetsFinder = this.tweetsFinder;
};

MapController.prototype.updatePosition = function(position) {
  if (this.currentPositionMarker) {
    this.googleMap.clearMarker(this.currentPositionMarker);
  }
  this.setCurrentPosition(position);
  this.googleMap.createCurrentPositionMarker(this.userLatitude, this.userLongitude);
};
