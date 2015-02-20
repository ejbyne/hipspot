var map = function(googleAPI) {
	this.googleAPI = googleAPI;
};

var chosenTimeSlot;
var chosenPlacesFilter = [''];
var heatmap;
var currentPositionMarker;
var userLatitude;
var userLongitude;
var placesImage;
var placesMarkerArray = [];
var markerClusterer;
var placesArray = [];
var tweetData;

Map.prototype.defineUserPosition = function(position) {
  this.userLatitude = position.coords.latitude;
  this.userLongitude = position.coords.longitude;
};

Map.prototype.createUserMarker = function() {

};

  currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: map,
    icon: new google.maps.MarkerImage('img/man.svg', null, null, null, new google.maps.Size(36, 36))
  });

Map.prototype.initialize = function(position) {
  this.defineUserPosition(position);
  this.createUserMarker();
  this.googleMap = this.googleAPI.createMap(this.userLatitude, this.userLongitude);
  this.googleService = this.googleAPI.addPlacesService(this.map);
  this.googleAPI.addListener(this.googleMap, 'idle', this.performSearch);
  this.searchBox.addSearchBox();
  $('#map-canvas').show();
  $('.sticky').show();
  $('footer').show();
  $('.splashScreen').hide();
};

var updatePosition = function(position) {
  if (currentPositionMarker) {
    currentPositionMarker.setMap(null);
  }
  defineUserPosition(position);
  createUserMarker();
};

var performSearch = function() {
  var bounds = map.getBounds();
  placesSearch(bounds);
  tweetSearch(bounds, chosenTimeSlot);
};

function defaultTimeSlot() {
  return Math.floor(new Date().getHours()/4) + 1;
}

function tweetSearch(bounds, timeSlot) {
  timeSlot = timeSlot || defaultTimeSlot();
  $.post('/tweetinfo', { neLatitude: bounds.getNorthEast().lat(),
                         neLongitude: bounds.getNorthEast().lng(),
                         swLatitude: bounds.getSouthWest().lat(),
                         swLongitude: bounds.getSouthWest().lng(),
                         timeSlot: timeSlot
                       }, function(data) {
    showTweetData(data);
    tweetData = data;
    findHipSpots();
  });
}

function showTweetData(data) {
  if (heatmap)
    heatmap.setMap(null);
  var tweetsArray = [];
  data.forEach(function(tweet){
    tweetsArray.push(new google.maps.LatLng(tweet.latitude, tweet.longitude));
  });
  var pointArray = new google.maps.MVCArray(tweetsArray);
  heatmap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
  heatmap.set('radius', 16);
  heatmap.set('opacity', 1);
  heatmap.setMap(map);
}

function findHipSpots() {
  var hipSpots = {};
  for (var i = 0; i < placesArray.length; i++) {
    placesMarkerArray[i].setIcon(new google.maps.MarkerImage(placesImage));
    for (var j = 0; j < tweetData.length; j++) {
      if (Math.abs(placesArray[i].geometry.location.lat() - tweetData[j].latitude) < 0.0001 &&
          Math.abs(placesArray[i].geometry.location.lng() - tweetData[j].longitude) < 0.0001) {
        if (hipSpots[placesArray[i].place_id]) {
          hipSpots[placesArray[i].place_id] = hipSpots[placesArray[i].place_id] += 1;
        } else {
          hipSpots[placesArray[i].place_id] = 1;
        }
        if (hipSpots[placesArray[i].place_id] > 3)
          changeMarkerIcon(placesArray[i]);
      }
    }
  }
}

function changeMarkerIcon(place) {
  for (var i = 0; i < placesMarkerArray.length; i++) {
    if (placesMarkerArray[i].placeId === place.place_id) {
      placesMarkerArray[i].setIcon(new google.maps.MarkerImage('img/star-'+ chosenPlacesFilter +'.svg', null, null, null, new google.maps.Size(36,36)));
    }
  }
}
