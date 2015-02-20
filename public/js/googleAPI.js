var GoogleAPI = function() {};

// googleAPI.prototype.STYLES = []

googleAPI.prototype.mapOptions = function(userLatitude, userLongitude) {
	return {
    zoom: 17,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true,
    styles: styles,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    }
  };
};

googleAPI.prototype.createMap = function(userLatitude, userLongitude) {
	this.googleMap = new google.maps.Map(
		document.getElementById('map-canvas'),
		this.mapOptions(userLatitude, userLongitude)
	);
};

googleAPI.prototype.addPlacesService = function() {
	this.placesService = new google.maps.places.PlacesService(this.googleMap);
};

googleAPI.prototype.addListener = function(performSearch) {
	google.maps.event.addListener(this.googleMap, 'idle', performSearch);
};

googleAPI.prototype.getMapBounds = function() {
	return this.googleMap.getBounds();
};

googleAPI.prototype.createCurrentPositionMarker = function(userLatitude, userLongitude) {
  this.currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: this.googleMap,
    icon: new google.maps.MarkerImage('img/man.svg', null, null, null, new google.maps.Size(36, 36))
  });
};

googleAPI.prototype.deleteCurrentPositionMarker = function() {
	this.currentPositionMarker.setMap(null);
};
