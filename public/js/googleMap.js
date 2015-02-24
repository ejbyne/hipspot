var GoogleMap = function() {};

GoogleMap.prototype.createMap = function(userLatitude, userLongitude) {
  this.map = new google.maps.Map(
    document.getElementById('map-canvas'),
    this.mapOptions(userLatitude, userLongitude)
  );
};

GoogleMap.prototype.showCurrentLocation = function(userLatitude, userLongitude) {
  var currentLocation = new google.maps.LatLng(userLatitude, userLongitude);
  this.map.setCenter(currentLocation);
};

GoogleMap.prototype.addPlacesService = function() {
  this.placesService = new google.maps.places.PlacesService(this.map);
};

GoogleMap.prototype.addMapListener = function(mapController) {
  google.maps.event.addListener(this.map, 'idle', function() {
    mapController.performSearch();
  });
};

GoogleMap.prototype.searchPlaces = function(placesFinder) {
  var request = {
    bounds: this.getMapBounds(),
    types: placesFinder.chosenPlacesFilter
  };
  this.placesService.radarSearch(request, function(searchResults) {
    placesFinder.processSearch(searchResults);
  });
};

GoogleMap.prototype.getMapBounds = function() {
  return this.map.getBounds();
};

GoogleMap.prototype.getMapCoords = function() {
  var bounds = this.getMapBounds();
  return { neLatitude: bounds.getNorthEast().lat(),
           neLongitude: bounds.getNorthEast().lng(),
           swLatitude: bounds.getSouthWest().lat(),
           swLongitude: bounds.getSouthWest().lng()
         };
};

GoogleMap.prototype.createCurrentPositionMarker = function(userLatitude, userLongitude) {
  return new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: this.map,
    icon: new google.maps.MarkerImage(
      'img/location.svg', null, null, null, new google.maps.Size(36, 36)
    )
  });
};

GoogleMap.prototype.createPlacesMarker = function(place, chosenPlacesFilter) {
  var placesMarker = new google.maps.Marker({
    placeId: place.place_id,
    map: this.map,
    position: place.geometry.location,
    icon: new google.maps.MarkerImage('img/'+ chosenPlacesFilter + '.svg')
  });
  this.addMarkerListener(place, placesMarker);
  return placesMarker;
};

GoogleMap.prototype.addMarkerListener = function(place, placesMarker) {
  var _this = this;
  google.maps.event.addListener(placesMarker, 'click', function() {
    _this.placesService.getDetails(place, function(result) {
      _this.eventHandler.renderInfoModal(result);
    });
  });
};

GoogleMap.prototype.clearMarker = function(marker) {
  marker.setMap(null);
};

GoogleMap.prototype.resetMarkerIcon = function(marker, chosenPlacesFilter) {
	marker.setIcon(new google.maps.MarkerImage('img/'+ chosenPlacesFilter + '.svg'));
};

GoogleMap.prototype.changeMarkerIcon = function(marker, chosenPlacesFilter) {
	marker.setIcon(new google.maps.MarkerImage(
		'img/star-'+ chosenPlacesFilter + '.svg',
		null, null, null, new google.maps.Size(36,36))
	);
};

GoogleMap.prototype.createClusterer = function(placesMarkerArray, chosenPlacesFilter) {
  return new MarkerClusterer(this.map, placesMarkerArray, this.clustererOptions(chosenPlacesFilter));
};

GoogleMap.prototype.clearClusterer = function(clusterer) {
  clusterer.clearMarkers();
};

GoogleMap.prototype.drawHeatMap = function(data) {
  var tweetsArray = [];
  data.forEach(function(tweet) {
    tweetsArray.push(new google.maps.LatLng(tweet.latitude, tweet.longitude));
  });
  var pointArray = new google.maps.MVCArray(tweetsArray);
  var heatMap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
  heatMap.set('radius', 16);
  heatMap.set('opacity', 1);
  heatMap.setMap(this.map);
  return heatMap;
};

GoogleMap.prototype.clearHeatMap = function(heatMap) {
  heatMap.setMap(null);
};

GoogleMap.prototype.mapOptions = function(userLatitude, userLongitude) {
  return {
    zoom: 17,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true,
    styles: this.styles,
    zoomControlOptions: { position: google.maps.ControlPosition.LEFT_TOP }
  };
};

GoogleMap.prototype.clustererOptions = function(chosenPlacesFilter) {
  return {
    maxZoom: 16,
    styles: [{ height: 50, url: 'img/'+ chosenPlacesFilter + '.svg', width: 50, textSize: 10 }]
  };
};

GoogleMap.prototype.styles = function() {
  return [
    {
      "featureType": "road",
      "stylers": [ { "color": "#ffffff" }, { "visibility": "simplified" }]
    }, {
      "featureType": "road",
      "elementType": "labels.text",
      "stylers": [ { "color": "#0e1310" } ]
    }, {
      "stylers": [ { "visibility": "simplified" }, { "lightness": 5 }, { "saturation": 38 }]
    }, {
      "featureType": "administrative",
      "elementType": "labels",
      "stylers": [ { "visibility": "simplified" }, { "color": "#161615" } ]
    }, {
      "featureType": "transit.line",
      "stylers": [ { "visibility": "off" } ]
    }
  ];
};
