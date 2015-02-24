var GoogleSearchBox = function() {};

GoogleSearchBox.prototype.addSearchBox = function(map) {
  var input =  document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  this.addSearchBoxListener(searchBox, map);
  this.addMapListener(searchBox, map);
};

GoogleSearchBox.prototype.addSearchBoxListener = function(searchBox, map) {
  var _this = this;
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
    var searchMarkers = [];
    if (places.length === 0) { return; }
    _this.resetSearchMarkers(searchMarkers);
    var bounds = new google.maps.LatLngBounds();
    _this.createSearchMarkers(places, map, searchMarkers, bounds);
    map.fitBounds(bounds);
    map.setZoom(17);
    _this.eventHandler.setSearchBoxPlaceholder();
    _this.eventHandler.resetSearchBoxValue();
  });
};

GoogleSearchBox.prototype.addMapListener = function(searchBox, map) {
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
};

GoogleSearchBox.prototype.resetSearchMarkers = function(searchMarkers) {
  for (var i = 0; i < searchMarkers.length; i++) {
    searchMarker.setMap(null);
  }
};

GoogleSearchBox.prototype.createSearchMarkers = function(places, map, searchMarkers, bounds) {
  for (var j = 0; j < places.length; j++) {
    var searchMarker = new google.maps.Marker({
      map: map,
      icon: this.searchMarkerImage(places[j]),
      title: places[j].name,
      position: places[j].geometry.location
    });
    searchMarkers.push(searchMarker);
    bounds.extend(places[j].geometry.location);
  }
};

GoogleSearchBox.prototype.searchMarkerImage = function(place) {
  return {
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };
};
