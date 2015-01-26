var map;
var service;
var placesTypes = ['bar']; 

function initialize(position) {

  var userLatitude = position.coords.latitude;
  var userLongitude = position.coords.longitude;

  var mapOptions = {
    zoom: 19,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  service = new google.maps.places.PlacesService(map);

  var currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: map,
  });

  google.maps.event.addListener(map, 'idle', performSearch);
}

function performSearch() {
  var bounds = map.getBounds();
  placesSearch(bounds);
  tweetSearch(bounds);
}

function placesSearch(bounds) {
  var request = {
    bounds: bounds,
    types: placesTypes 
  };
  console.log(bounds);
  service.radarSearch(request, callback);  
}

function tweetSearch(bounds) {
  $.post('/tweetinfo', { neLatitude: bounds.getNorthEast().lat(),
                         neLongitude: bounds.getNorthEast().lng(),
                         swLatitude: bounds.getSouthWest().lat(),
                         swLongitude: bounds.getSouthWest().lng()
                       }, function(data) { 
    getTweetData(data) 
  });
}

function getTweetData(data) {
  var tweetsArray = [];
  data.forEach(function(tweet){
    tweetsArray.push(new google.maps.LatLng(tweet.latitude, tweet.longitude))
  });
  var pointArray = new google.maps.MVCArray(tweetsArray);
  heatmap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
  heatmap.set('radius', 16);
  heatmap.set('opacity', 1);
  // heatmap.set('dissipating', true);
  heatmap.setMap(map);
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0; i < results.length; i++) {
      var marker = new google.maps.Marker({ 
        map: map, 
        position: results[i].geometry.location
    });
  }
}

function error(err) {
  alert('Error(' + err.code + '): ' + err.message);
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

navigator.geolocation.getCurrentPosition(initialize, error, options);
