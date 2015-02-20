var placesSearch = function(bounds) {
  for (var i = 0; i < placesMarkerArray.length; i++) {
    placesMarkerArray[i].setMap(null);
  }
  placesMarkerArray = [];
  var request = {
    bounds: bounds,
    types: chosenPlacesFilter
  };
  service.radarSearch(request, processPlacesSearch);
}

var processPlacesSearch = function(results, status) {
  placesArray = results;
  createMarkers(results, findHipSpots);
  if (markerClusterer) {
    markerClusterer.clearMarkers();
  }
  var mkOptions = {maxZoom: 16,
                  styles: [{
                            height: 50,
                            url: placesImage,
                            width: 50,
                            textSize: 10
                          }]
  };
  markerClusterer = new MarkerClusterer(map, placesMarkerArray, mkOptions);
}

var createMarkers = function(results, callback) {
  for (var i = 0; i < results.length; i++) {
    createMarker(results[i]);
  }
  callback();
}

var createMarker = function(place) {
  var placeLoc = place.geometry.location;
  var placesMarker = new google.maps.Marker({
    placeId: place.place_id,
    map: map,
    position: placeLoc,
    icon: new google.maps.MarkerImage(placesImage)
  });

  placesMarkerArray.push(placesMarker);

  google.maps.event.addListener(placesMarker, 'click', function() {
    service.getDetails(place, function(result, status) {
      var details = closeModal +
                    placeName(result) +
                    placeAddress(result) +
                    placeWebsite(result) +
                    placeOpeningHours(result);
      $('#infoModal').html(details).show();
      $('#closeModal').on('click', function() {
        $('#infoModal').hide();
      });
    });
  });
};

var closeModal = '<div id="closeModal">✕</div>';

var placeName = function(result) {
  return '<strong>' + result.name + '</strong><br>';
};

var placeAddress = function(result) {
  return result.vicinity + ' ' + result.address_components[result.address_components.length-1].long_name + '<br>';
};

var placeWebsite = function(result) {
  if(result.website) {
    var text = '<a href="' + result.website + '">' + result.website + '</a>';
    return text;
  } else {
    return '';
  }
};

var placeOpeningHours = function(result) {
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
