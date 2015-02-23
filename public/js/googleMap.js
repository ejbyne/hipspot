var GoogleMap = function() {};

GoogleMap.prototype.createMap = function(userLatitude, userLongitude) {
  this.map = new google.maps.Map(
    document.getElementById('map-canvas'),
    this.mapOptions(userLatitude, userLongitude)
  );
};

GoogleMap.prototype.addPlacesService = function() {
  this.placesService = new google.maps.places.PlacesService(this.map);
};

GoogleMap.prototype.addMapListener = function(mapController) {
  google.maps.event.addListener(this.map, 'idle', function() {
    mapController.performSearch();
  });
};

GoogleMap.prototype.searchPlaces = function() {
  var _this = this;
  var request = {
    bounds: this.getMapBounds(),
    types: this.placesFinder.chosenPlacesFilter
  };
  this.placesService.radarSearch(request, function(searchResults) {
    _this.placesFinder.processSearch(searchResults, _this.tweetsFinder.findHipSpots);
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

GoogleMap.prototype.createPlacesMarker = function(place) {
  var placesMarker = new google.maps.Marker({
    placeId: place.place_id,
    map: this.map,
    position: place.geometry.location,
    icon: new google.maps.MarkerImage(this.placesFinder.placesImage)
  });
  this.addMarkerListener(place, placesMarker);
  return placesMarker;
};

GoogleMap.prototype.addMarkerListener = function(place, placesMarker) {
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

GoogleMap.prototype.clearMarker = function(marker) {
  marker.setMap(null);
};

GoogleMap.prototype.createClusterer = function() {
  return new MarkerClusterer(this.map, this.placesFinder.placesMarkerArray, this.clustererOptions());
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

GoogleMap.prototype.resetMarkerIcon = function(marker) {
	marker.setIcon(new google.maps.MarkerImage(this.placesFinder.placesImage));
};

GoogleMap.prototype.changeMarkerIcon = function(marker) {
	marker.setIcon(new google.maps.MarkerImage(
		'img/star-'+ this.placesFinder.chosenPlacesFilter + '.svg',
		null, null, null, new google.maps.Size(36,36))
	);
};

GoogleMap.prototype.addSearchBox = function() {
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
        map: _this.map,
        icon: image,
        title: places[j].name,
        position: places[j].geometry.location
      });
      searchMarkers.push(searchMarker);
      bounds.extend(places[j].geometry.location);
    }
    _this.map.fitBounds(bounds);
    _this.map.setZoom(17);
    $("#pac-input").attr("placeholder", $("#pac-input").val() || "Find location");
    $("#pac-input").val('');
  });
  google.maps.event.addListener(this.map, 'bounds_changed', function() {
    var bounds = _this.map.getBounds();
    searchBox.setBounds(bounds);
  });
};

GoogleMap.prototype.closeModal = function() {
	return '<div id="closeModal">✕</div>';
};

GoogleMap.prototype.placeName = function(result) {
  return '<strong>' + result.name + '</strong><br>';
};

GoogleMap.prototype.placeAddress = function(result) {
  return result.vicinity + ' ' + result.address_components[result.address_components.length-1].long_name + '<br>';
};

GoogleMap.prototype.placeWebsite = function(result) {
  if(result.website) {
    var text = '<a href="' + result.website + '">' + result.website + '</a>';
    return text;
  } else {
    return '';
  }
};

GoogleMap.prototype.placeOpeningHours = function(result) {
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

GoogleMap.prototype.mapOptions = function(userLatitude, userLongitude) {
  return {
    zoom: 17,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true,
    styles: this.styles,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    }
  };
};

GoogleMap.prototype.clustererOptions = function() {
  return {
    maxZoom: 16,
    styles: [{
              height: 50,
              url: this.placesFinder.placesImage,
              width: 50,
              textSize: 10
            }]
  };
};

GoogleMap.prototype.styles = function() {
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
