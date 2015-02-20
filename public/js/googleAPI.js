var googleAPI = function() {};

googleAPI.prototype.findMapCenter = function(userLatitude, userLongitude) {
	return new google.maps.LatLng(userLatitude, userLongitude);
};

googleAPI.prototype.setControlPosition = function() {
	return google.maps.ControlPosition.LEFT_TOP;
}

googleAPI.prototype.mapOptions = function(userLatitude, userLongitude) {
	return {
    zoom: 17,
    center: this.findMapCenter(userLatitude, userLongitude),
    scaleControl: true,
    styles: styles,
    zoomControlOptions: {
      position: this.setControlPosition()
    }
  };
};

googleAPI.prototype.createMap = function() {
	return new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
};

googleAPI.prototype.service = function(map) {
	return new google.maps.places.PlacesService(map);
};
