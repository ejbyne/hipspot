function initialize(position) {

  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(latitude, longitude),
    scaleControl: true
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude, longitude),
    map: map,
  });
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
