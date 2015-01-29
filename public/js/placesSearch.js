function placesSearch(bounds) {
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

function processPlacesSearch(results, status) {
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

function createMarkers(results, callback) {
  for (var i = 0; i < results.length; i++) {
    createMarker(results[i]);
  }
  callback();
}

function createMarker(place) {
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
      var closeModal = '<div id="closeModal">✕</div>';

      var name = '<strong>' + result.name + '</strong><br>';

      var address = result.vicinity + ' ' + result.address_components[result.address_components.length-1].long_name + '<br>';

      var website = function() {
        if(result.website) {
          var text = '<a href="' + result.website + '">' + result.website + '</a>';
          return text;
        } else {
          return '';
        }
      };
      var openingHours = function() {
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
      var details = closeModal +
                    name +
                    address +
                    website() +
                    openingHours();
      $('#infoModal').html(details).show();
      $('#closeModal').on('click', function() {
        $('#infoModal').hide();
      });
    });
  });
}
