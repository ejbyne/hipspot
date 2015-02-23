var GoogleAPI = function() {};

GoogleAPI.prototype.mapOptions = function(userLatitude, userLongitude) {
	var center = new google.maps.LatLng(userLatitude, userLongitude);
  var styles = this.STYLES;
  var position = google.maps.ControlPosition.LEFT_TOP;
  return {
    zoom: 17,
    center: center,
    scaleControl: true,
    styles: styles,
    zoomControlOptions: {
      position: position
    }
  };
};

GoogleAPI.prototype.createMap = function(userLatitude, userLongitude) {
	var mapOptions = this.mapOptions(userLatitude, userLongitude);
  this.googleMap = new google.maps.Map(
		document.getElementById('map-canvas'),
		mapOptions
	);
};

GoogleAPI.prototype.addPlacesService = function() {
	this.placesService = new google.maps.places.PlacesService(this.googleMap);
};

GoogleAPI.prototype.addMapListener = function(mapController) {
	google.maps.event.addListener(this.googleMap, 'idle', mapController.performSearch(mapController));
};

GoogleAPI.prototype.getMapBounds = function() {
	return this.googleMap.getBounds();
};

GoogleAPI.prototype.getMapCoords = function() {
  this.getMapBounds(function(bounds) {
    return { neLatitude: bounds.getNorthEast().lat(),
             neLongitude: bounds.getNorthEast().lng(),
             swLatitude: bounds.getSouthWest().lat(),
             swLongitude: bounds.getSouthWest().lng()
           };
  });
};

GoogleAPI.prototype.createCurrentPositionMarker = function(userLatitude, userLongitude) {
  return new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: this.googleMap,
    icon: new google.maps.MarkerImage(
      'img/location.svg', null, null, null, new google.maps.Size(36, 36)
    )
  });
};

GoogleAPI.prototype.createPlacesMarker = function(place) {
	var placesMarker = new google.maps.Marker({
    placeId: place.place_id,
    map: this.googleMap,
    position: place.geometry.location,
    icon: new google.maps.MarkerImage(this.placesImage)
  });
	this.addMarkerListener(place, placesMarker);
  return placesMarker;
};

GoogleAPI.prototype.addMarkerListener = function(place, placesMarker) {
	var _this = this;
  google.maps.event.addListener(placesMarker, 'click', function() {
    _this.placesService.getDetails(place, function(result, status) {
      var details = _this.closeModal +
                    _this.placeName(result) +
                    _this.placeAddress(result) +
                    _this.placeWebsite(result) +
                    _this.placeOpeningHours(result);
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

GoogleAPI.prototype.createClusterer = function(placesMarkerArray) {
	var mkOptions = {
		maxZoom: 16,
    styles: [{
              height: 50,
              url: this.placesImage,
              width: 50,
              textSize: 10
            }]
  };
	return new MarkerClusterer(this.googleMap, placesMarkerArray, mkOptions);
};

GoogleAPI.prototype.clearClusterer = function(clusterer) {
	clusterer.clearMarkers();
};

GoogleAPI.prototype.drawHeatMap = function(data) {
  if (data) {
  	var tweetsArray = [];
  	data.forEach(function(tweet) {
  	  tweetsArray.push(new google.maps.LatLng(tweet.latitude, tweet.longitude));
  	});
  	var pointArray = new google.maps.MVCArray(tweetsArray);
    var heatMap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
    heatMap.set('radius', 16);
    heatMap.set('opacity', 1);
    heatMap.setMap(this.googleMap);
    return heatMap;
  }
};

GoogleAPI.prototype.clearHeatMap = function(heatMap) {
  heatMap.setMap(null);
};

GoogleAPI.prototype.searchPlaces = function() {
  this.getMapBounds(function(bounds) {
    var request = {
      bounds: bounds,
      types: this.chosenPlacesFilter
    };
    this.placesService.radarSearch(request); 
  });
};

GoogleAPI.prototype.resetMarkerIcon = function(marker) {
	marker.setIcon(new google.maps.MarkerImage(this.placesImage));
};

GoogleAPI.prototype.changeMarkerIcon = function(marker) {
	marker.setIcon(new google.maps.MarkerImage(
		'img/star-'+ this.chosenPlacesFilter + '.svg',
		null, null, null, new google.maps.Size(36,36))
	);
};

GoogleAPI.prototype.addSearchBox = function() {
  var _this = this;
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
        map: _this.googleMap,
        icon: image,
        title: places[j].name,
        position: places[j].geometry.location
      });
      searchMarkers.push(searchMarker);
      bounds.extend(places[j].geometry.location);
    }
    _this.googleMap.fitBounds(bounds);
    _this.googleMap.setZoom(17);
    $("#pac-input").attr("placeholder", $("#pac-input").val() || "Find location");
    $("#pac-input").val('');
  });
  google.maps.event.addListener(this.googleMap, 'bounds_changed', function() {
    var bounds = _this.googleMap.getBounds();
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

GoogleAPI.prototype.STYLES = function() {
  return [
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
};
