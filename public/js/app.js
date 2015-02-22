var googleAPI = new GoogleAPI();
var placesFinder = new PlacesFinder(googleAPI);
var tweetsFinder = new TweetsFinder(googleAPI);
var mapController = new MapController(googleAPI, placesFinder, tweetsFinder);

// var chosenTimeSlot;
// var chosenPlacesFilter = [''];
// var heatmap;
// var currentPositionMarker;
// var userLatitude;
// var userLongitude;
// var placesImage;
// var placesMarkerArray = [];
// var markerClusterer;
// var placesArray = [];
// var tweetData = [];
// var zoomSize = 17;
// var hipSpots;
// var currentPositionMarkerImage = 'img/location.svg';

// var initialize = function(position) {
//   defineUserPosition(position);

//   var mapOptions = {
//     zoom: zoomSize,
//     center: new google.maps.LatLng(userLatitude, userLongitude),
//     scaleControl: true,
//     styles: styles,
//     zoomControlOptions: {
//       position: google.maps.ControlPosition.LEFT_TOP
//     },
//   };

//   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//   service = new google.maps.places.PlacesService(map);
//   infoWindow = new google.maps.InfoWindow({ disableAutoPan: true });
//   createUserMarker();
//   $('#map-canvas').show();
//   $('.sticky').show();
//   $('footer').show();
//   $('.splashScreen').hide();
//   google.maps.event.addListener(map, 'idle', performSearch);
//   addSearchBox();
// };

// var defineUserPosition = function (position) {
//   userLatitude = position.coords.latitude;
//   userLongitude = position.coords.longitude;
// };

// var createUserMarker = function() {
//   currentPositionMarker = new google.maps.Marker({
//     position: new google.maps.LatLng(userLatitude, userLongitude),
//     map: map,
//     icon: new google.maps.MarkerImage(currentPositionMarkerImage, null, null, null, new google.maps.Size(36, 36))
//   });
// };

// var updatePosition = function(position) {
//   if (currentPositionMarker) {
//     currentPositionMarker.setMap(null);
//   }
//   defineUserPosition(position);
//   createUserMarker();
// };

// var performSearch = function() {
//   var bounds = map.getBounds();
//   placesSearch(bounds);
//   tweetSearch(bounds);
//   $("#pac-input").val('');
// };

var loadMap = function(position) {
	mapController.initialize(position);
};

var updatePosition = function(position) {
	mapController.updatePosition(position);
};

var error = function(err) {
  return false;
};

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

navigator.geolocation.getCurrentPosition(loadMap, error, options);
navigator.geolocation.watchPosition(updatePosition, error, options);
