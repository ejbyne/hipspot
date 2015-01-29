var addSearchBox = function() {
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
    map.setZoom(17);
  });

  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
};

