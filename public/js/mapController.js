var MapController = function(googleAPI, placesFinder, tweetsFinder) {
	this.googleAPI = googleAPI;
  this.placesFinder = placesFinder;
  this.tweetsFinder = tweetsFinder;
};

MapController.prototype.setCurrentPosition = function(position) {
  this.userLatitude = position.coords.latitude;
  this.userLongitude = position.coords.longitude;
};

MapController.prototype.performSearch = function(_this) {
  console.log(this);
  _this.placesFinder.placesSearch();
  _this.tweetsFinder.tweetsSearch();
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
  this.googleAPI.createMap(this.userLatitude, this.userLongitude);
  this.googleAPI.addPlacesService();
  this.googleAPI.addMapListener(this);
  this.currentPositionMarker = this.googleAPI.createCurrentPositionMarker(
    this.userLatitude, this.userLongitude
  );
  this.googleAPI.addSearchBox();
  this.showMap();
};

MapController.prototype.updatePosition = function(position) {
  if (this.currentPositionMarker) {
    this.googleAPI.clearMarker(this.currentPositionMarker);
  }
  this.setCurrentPosition(position);
  this.googleAPI.createCurrentPositionMarker(this.userLatitude, this.userLongitude);
};
