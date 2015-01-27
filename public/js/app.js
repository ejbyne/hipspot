var map;
var service;
var infoWindow;
var chosenTimeSlot;
var chosenPlacesFilter;
var heatmap;
var currentPositionMarker;
var userLatitude;
var userLongitude;
var placesImage;
var placesMarkerArray = [];
var choice;
var markerArray;
var markerClusterer;

$(function() {
  $('.tlt').textillate({
    in: { effect: 'splat', delay: 20 },
    out: { effect: 'bounceOut', delay: 20 },
    loop: true,
  });
});

function initialize(position) {
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;

  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true,
    styles: styles,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    },
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  service = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow();

  currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: map,
    icon: new google.maps.MarkerImage('img/man.svg', null, null, null, new google.maps.Size(36, 36))
  });

  $('#map-canvas').show();
  $('.sticky').show();
  $('.range-slider').show();
  $('.tlt').hide();
  $('#logo').hide();
  $('footer').show();
  $('.button').on('click', function(event) {
    event.preventDefault();
    chosenTimeSlot = $(this).data('pick');
    tweetSearch(map.getBounds(), chosenTimeSlot);
  });

  $('.placesFilter').on('click', function(event) {
    event.preventDefault();
    for (var i = 0; i < placesMarkerArray.length; i++) {
      placesMarkerArray[i].setMap(null);
    }
    placesMarkerArray.length = 0;
    choice = $(this).data('filter')
    chosenPlacesFilter = [$(this).data('filter')];
    placesImage = "img/" + $(this).data('filter') + ".svg";
    placesSearch(map.getBounds());
  });

  google.maps.event.addListener(map, 'idle', performSearch);
  addSearchBox();
}

function addSearchBox() {
  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
    var searchMarkers = [];
    if (places.length == 0) {
      return;
    }
    for (var i = 0, searchMarker; searchMarker = searchMarkers[i]; i++) {
      searchMarker.setMap(null);
    }
    // For each place, get the icon, place name, and location.
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      var searchMarker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });
      searchMarkers.push(searchMarker);
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
    map.setZoom(17);
  });
  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

function pageLoadSearch() {
  var bounds = map.getBounds();
  tweetSearch(bounds, chosenTimeSlot);
}

function performSearch() {
  var bounds = map.getBounds();
  placesSearch(bounds);
  tweetSearch(bounds, chosenTimeSlot);
}

function placesSearch(bounds) {
  var request = {
    bounds: bounds,
    types: chosenPlacesFilter
  };
  service.radarSearch(request, callback);
}

function defaultTimeSlot() {
  return Math.floor(new Date().getHours()/4) + 1;
}

function tweetSearch(bounds, timeSlot) {
  timeSlot = timeSlot || defaultTimeSlot();
  $.post('/tweetinfo', { neLatitude: bounds.getNorthEast().lat(),
                         neLongitude: bounds.getNorthEast().lng(),
                         swLatitude: bounds.getSouthWest().lat(),
                         swLongitude: bounds.getSouthWest().lng(),
                         timeSlot: timeSlot
                       }, function(data) {
    showTweetData(data);
  });
}

function showTweetData(data) {
  if (heatmap)
    heatmap.setMap(null);
  var tweetsArray = [];
  data.forEach(function(tweet){
    tweetsArray.push(new google.maps.LatLng(tweet.latitude, tweet.longitude));
  });
  var pointArray = new google.maps.MVCArray(tweetsArray);
  heatmap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
  heatmap.set('radius', 16);
  heatmap.set('opacity', 1);
  heatmap.setMap(map);
}

function callback(results, status) {
  createMarkers(results);
  var placesClusterImage = "img/" + choice + ".png"
  if (markerClusterer) {
    markerClusterer.clearMarkers();
  }
  var mkOptions = {maxZoom: 16,
                   styles: [{
                            height: 50,
                            url: placesClusterImage,
                            width: 50,
                            textSize: 10
                    }]
  };
  markerClusterer = new MarkerClusterer(map, placesMarkerArray, mkOptions);
}

function createMarkers(results) {
  for (var i = 0; i < results.length; i++) {
    createMarker(results[i]);
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var placesMarker = new google.maps.Marker({
    map: map,
    position: placeLoc,

    icon: new google.maps.MarkerImage(placesImage, null, null, null, new google.maps.Size(24,24))
  }
  );

  placesMarkerArray.push(placesMarker);

  google.maps.event.addListener(placesMarker, 'click', function() {
    service.getDetails(place, function(result, status) {
      var name = result.name + '<br>';

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
          var text = '<br>Opening Hours:<br>';
          result.opening_hours.weekday_text.forEach(function(day) {
            text += day + '<br>';
          });
          return text;
        } else {
          return '';
        }
      };
      var details = name +
                    address +
                    website() +
                    openingHours();
      infoWindow.setContent(details);
      infoWindow.open(map, placesMarker);
    });
  });
}

function error(err) {
  return false;
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function updatePosition(position) {
  if (currentPositionMarker) {
    currentPositionMarker.setMap(null);
  }

  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;

  currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: map,
    icon: new google.maps.MarkerImage('img/man.svg', null, null, null, new google.maps.Size(36, 36))
  });
}

navigator.geolocation.watchPosition(updatePosition, error, options);
navigator.geolocation.getCurrentPosition(initialize, error, options);
