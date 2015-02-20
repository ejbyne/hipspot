var Map = function(googleAPI, placesFinder, tweetsFinder) {
	this.googleAPI = googleAPI;
  this.placesFinder = placesFinder;
  this.tweetsFinder = tweetsFinder;
};

// var chosenTimeSlot;
// var chosenPlacesFilter = [''];
// var heatmap;
// var placesImage;
// var placesMarkerArray = [];
// var markerClusterer;
// var placesArray = [];
// var tweetData;

Map.prototype.setCurrentPosition = function(position) {
  this.userLatitude = position.coords.latitude;
  this.userLongitude = position.coords.longitude;
};

Map.prototype.performSearch = function() {
  var bounds = this.googleAPI.getMapBounds();
  this.placesFinder.placesSearch(bounds);
  this.tweetsFinder.tweetSearch(bounds, chosenTimeSlot);
  $("#pac-input").val('');
};

Map.prototype.showMap = function() {
  $('#map-canvas').show();
  $('.sticky').show();
  $('footer').show();
  $('.splashScreen').hide();
};

Map.prototype.initialize = function(position) {
  this.setCurrentPosition(position);
  this.googleAPI.createMap(this.userLatitude, this.userLongitude);
  this.googleAPI.createCurrentPositionMarker(this.userLatitude, this.userLongitude);
  this.googleAPI.addPlacesService();
  this.googleAPI.addListener(this.performSearch);
  this.searchBox.addSearchBox();
  this.showMap();
};

Map.prototype.updatePosition = function(position) {
  this.googleAPI.deleteCurrentPositionMarker;
  this.setCurrentPosition(position);
  this.googleAPI.createCurrentPositionMarker(this.userLatitude, this.userLongitude);
};
