var map = new Map();
var error = function(err) {
  return false;
}
var options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

navigator.geolocation.watchPosition(map.updatePosition, error, options);
navigator.geolocation.getCurrentPosition(map.initialize, error, options);
