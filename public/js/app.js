var map;
var service;
var placesTypes = ['bar'];
var infoWindow;

$(function() {
  $('.tlt').textillate({ 
    in: { effect: 'splat', delay: 20 },
    out: { effect: 'bounceOut', delay: 20 },
    loop: true,
  });
});

function initialize(position) {
  var userLatitude = position.coords.latitude;
  var userLongitude = position.coords.longitude;

  var mapOptions = {
    zoom: 19,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    scaleControl: true,
    styles: styles
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  service = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow();

  var currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(userLatitude, userLongitude),
    map: map,
    icon: new google.maps.MarkerImage('img/man.svg', null, null, null, new google.maps.Size(36, 36))
  });

  $('#map-canvas').show();
  $('.sticky').show();
  $('.tlt').hide();

  google.maps.event.addListener(map, 'idle', performSearch);

}

function performSearch() {
  var bounds = map.getBounds();
  placesSearch(bounds);
  tweetSearch(bounds);
}

function placesSearch(bounds) {
  var request = {
    bounds: bounds,
    types: placesTypes 
  };
  service.radarSearch(request, callback);  
}

function tweetSearch(bounds) {
  $.post('/tweetinfo', { neLatitude: bounds.getNorthEast().lat(),
                         neLongitude: bounds.getNorthEast().lng(),
                         swLatitude: bounds.getSouthWest().lat(),
                         swLongitude: bounds.getSouthWest().lng()
                       }, function(data) { 
    getTweetData(data);
  });
}

function getTweetData(data) {
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
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0; i < results.length; i++) {
    createMarker(results[i]);
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc,
    icon: new google.maps.MarkerImage('img/glass.svg', null, null, null, new google.maps.Size(24,24))
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
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
          var text = '<br>Opening Hours:<br>'
          result.opening_hours.weekday_text.forEach(function(day) {
            text += day + '<br>'
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
      infoWindow.open(map, marker)
    })
  });
}

function error(err) {
  alert('Error(' + err.code + '): ' + err.message);
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

navigator.geolocation.getCurrentPosition(initialize, error, options);