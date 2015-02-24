$(function() {

  var googleMap = new GoogleMap();
  var googleSearchBox = new GoogleSearchBox();
  var placesFinder = new PlacesFinder(googleMap);
  var tweetsFinder = new TweetsFinder(googleMap, placesFinder);
  var mapController = new MapController(googleMap, googleSearchBox, placesFinder, tweetsFinder);
  var eventHandler = new EventHandler(googleMap, placesFinder, tweetsFinder, mapController);

  var loadMap = function(position) {
  	mapController.loadMap(position);
  };

  var updatePosition = function(position) {
  	mapController.updatePosition(position);
  };

  var error = function(error) {
    return false;
  };

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  mapController.eventHandler = eventHandler;
  googleMap.eventHandler = eventHandler;
  googleSearchBox.eventHandler = eventHandler;
  placesFinder.tweetsFinder = tweetsFinder;
  eventHandler.initialize();
  navigator.geolocation.getCurrentPosition(loadMap, error, options);
  navigator.geolocation.watchPosition(updatePosition, error, options);

});
