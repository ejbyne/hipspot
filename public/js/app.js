var map;
var service;
var placesTypes = ['bar']; 

function initialize(position) {

  var userLatitude = position.coords.latitude;
  var userLongitude = position.coords.longitude;

  var mapOptions = {
    zoom: 17,
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
  var request = {
    bounds: map.getBounds(),
    types: placesTypes 
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0, results; result = results[i]; i++) {
      var marker = new google.maps.Marker({ 
        map: map, 
        position: result.geometry.location
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
