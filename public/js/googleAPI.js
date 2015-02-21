var GoogleAPI = function() {};

GoogleAPI.prototype.mapOptions = function(userLatitude, userLongitude) {
	return {
    zoom: 17,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true,
    styles: this.STYLES,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    }
  };
};

GoogleAPI.prototype.createMap = function(userLatitude, userLongitude) {
	this.googleMap = new google.maps.Map(
		document.getElementById('map-canvas'),
		this.mapOptions(userLatitude, userLongitude)
	);
};

GoogleAPI.prototype.addPlacesService = function() {
	this.placesService = new google.maps.places.PlacesService(this.googleMap);
};

GoogleAPI.prototype.addMapListener = function(performSearch) {
	google.maps.event.addListener(this.googleMap, 'idle', performSearch);
};

GoogleAPI.prototype.getMapBounds = function() {
	return this.googleMap.getBounds();
};

GoogleAPI.prototype.getMapCoords = function(bounds) {
{ neLatitude: bounds.getNorthEast().lat(),
                         neLongitude: bounds.getNorthEast().lng(),
                         swLatitude: bounds.getSouthWest().lat(),
                         swLongitude: bounds.getSouthWest().lng(),
                         timeSlot: chosenTimeSlot
                       }
};

GoogleAPI.prototype.createCurrentPositionMarker = function(userLatitude, userLongitude) {
  return this.currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: this.googleMap,
    icon: new google.maps.MarkerImage('img/location.svg', null, null, null, new google.maps.Size(36, 36))
  });
};

GoogleAPI.prototype.clearCurrentPositionMarker = function() {
	this.currentPositionMarker.setMap(null);
};

GoogleAPI.prototype.createPlacesMarker = function(place) {
	var placesMarker = new google.maps.Marker({
    placeId: place.place_id,
    map: map,
    position: place.geometry.location,
    icon: new google.maps.MarkerImage(placesImage)
  });
	this.addMarkerListener(place, placesMarker);
  return placesMarker;
};

GoogleAPI.prototype.addMarkerListener = function(place, placesMarker) {
	google.maps.event.addListener(placesMarker, 'click', function() {
    this.placesService.getDetails(place, function(result, status) {
      var details = this.closeModal +
                    this.placeName(result) +
                    this.placeAddress(result) +
                    this.placeWebsite(result) +
                    this.placeOpeningHours(result);
      $('#infoModal').html(details).show();
      $('#closeModal').on('click', function() {
        $('#infoModal').hide();
      });
    });
  });
};

GoogleAPI.prototype.clearMarker = function(marker) {
	marker.setMap(null);
};

GoogleAPI.prototype.createClusterer = function() {
	var mkOptions = {
		maxZoom: 16,
    styles: [{
              height: 50,
              url: placesImage,
              width: 50,
              textSize: 10
            }]
  };
	return new MarkerClusterer(this.googleMap, placesMarkerArray, mkOptions);
}

GoogleAPI.prototype.clearClusterer = function(clusterer) {
	clusterer.clearMarkers();
};

GoogleAPI.prototype.drawHeatMap = function(data) {
	var tweetsArray = [];
	data.forEach(function(tweet){
	  tweetsArray.push(new google.maps.LatLng(tweet.latitude, tweet.longitude));
	});
	var pointArray = new google.maps.MVCArray(tweetsArray);
  var heatMap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
  heatMap.set('radius', 16);
  heatMap.set('opacity', 1);
  heatMap.setMap(this.googleMap);
  return heatMap;
};

GoogleAPI.prototype.clearHeatMap = function(heatMap) {
  heatmap.setMap(null);
};

GoogleAPI.prototype.searchPlaces = function(chosenPlacesFilter) {
  var request = {
    bounds: this.getMapBounds(),
    types: chosenPlacesFilter
  };
  this.placesSearch.radarSearch(request);
};

GoogleAPI.prototype.resetMarkerIcon = function(marker) {
	marker.setIcon(new google.maps.MarkerImage(placesImage));
}

GoogleAPI.prototype.changeMarkerIcon = function(marker) {
	marker.setIcon(new google.maps.MarkerImage(
		'img/star-'+ chosenPlacesFilter + '.svg',
		null, null, null, new google.maps.Size(36,36))
	);
};

GoogleAPI.prototype.addSearchBox = function() {
  var input =  document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
    var searchMarkers = [];
    if (places.length === 0) {
      return;
    }
    for (var i = 0; i < searchMarkers.length; i++) {
      searchMarker.setMap(null);
    }
    var bounds = new google.maps.LatLngBounds();
    for (var j = 0; j < places.length; j++) {
      var image = {
        url: places[j].icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      var searchMarker = new google.maps.Marker({
        map: map,
        icon: image,
        title: places[j].name,
        position: places[j].geometry.location
      });
      searchMarkers.push(searchMarker);
      bounds.extend(places[j].geometry.location);
    }
    map.fitBounds(bounds);
    map.setZoom(zoomSize);
    $("#pac-input").attr("placeholder", $("#pac-input").val() || "Find location");
    $("#pac-input").val('');
  });
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
};

GoogleAPI.prototype.closeModal = function() {
	return '<div id="closeModal">✕</div>';
};

GoogleAPI.prototype.placeName = function(result) {
  return '<strong>' + result.name + '</strong><br>';
};

GoogleAPI.prototype.placeAddress = function(result) {
  return result.vicinity + ' ' + result.address_components[result.address_components.length-1].long_name + '<br>';
};

GoogleAPI.prototype.placeWebsite = function(result) {
  if(result.website) {
    var text = '<a href="' + result.website + '">' + result.website + '</a>';
    return text;
  } else {
    return '';
  }
};

GoogleAPI.prototype.placeOpeningHours = function(result) {
  if(result.opening_hours) {
    var text = '<br><strong>Opening Hours:</strong><br>';
    result.opening_hours.weekday_text.forEach(function(day) {
      text += day + '<br>';
    });
    return text;
  } else {
    return '';
  }
};

GoogleAPI.prototype.STYLES = [
  {
    "featureType": "road",
    "stylers": [
      { "color": "#ffffff" },
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.text",
    "stylers": [
      { "color": "#0e1310" }
    ]
  },{
    "stylers": [
      { "visibility": "simplified" },
      { "lightness": 5 },
      { "saturation": 38 }
    ]
  },{
    "featureType": "administrative",
    "elementType": "labels",
    "stylers": [
      { "visibility": "simplified" },
      { "color": "#161615" }
    ]
  },{
    "featureType": "transit.line",
    "stylers": [
      { "visibility": "off" }
    ]
  }
];
