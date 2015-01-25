var map;
var service;
var placesTypes = ['bar']; 

function initialize(position) {
  var userLatitude = position.coords.latitude;
  var userLongitude = position.coords.longitude;

  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true,
    styles: styles
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  service = new google.maps.places.PlacesService(map);

  var currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: map,
    icon: new google.maps.MarkerImage('img/man.svg', null, null, null, new google.maps.Size(36, 36))
  });
  $('#map-canvas').show();
  $('.sticky').show();

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
  });
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0; i < results.length; i++) {
      var marker = new google.maps.Marker({ 
        map: map, 
        position: results[i].geometry.location,
        icon: new google.maps.MarkerImage('img/glass.svg', null, null, null, new google.maps.Size(24,24))
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


