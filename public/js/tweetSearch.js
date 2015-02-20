function defaultTimeSlot() {
  return Math.floor(new Date().getHours()/4) + 1;
}

var tweetSearch = function(bounds) {
  chosenTimeSlot = chosenTimeSlot || defaultTimeSlot();
  $.post('/tweetinfo', { neLatitude: bounds.getNorthEast().lat(),
                         neLongitude: bounds.getNorthEast().lng(),
                         swLatitude: bounds.getSouthWest().lat(),
                         swLongitude: bounds.getSouthWest().lng(),
                         timeSlot: chosenTimeSlot
                       }, function(data) {
    showTweetData(data);
    tweetData = data;
    findHipSpots();
  });
};

var showTweetData = function(data) {
  if (heatmap)
    heatmap.setMap(null);

  var tweetsArray = [];
  data.forEach(function(tweet){
    tweetsArray.push(new google.maps.LatLng(tweet.latitude, tweet.longitude));
  });

  drawHeatMap(tweetsArray);
};

var findHipSpots = function() {
  hipSpots = {};
  for (var i = 0; i < placesMarkerArray.length; i++) {
    placesMarkerArray[i].setIcon(new google.maps.MarkerImage(placesImage));
    for (var j = 0; j < tweetData.length; j++) {
      if (isTweetFromPlace(i, j)) {
        recordHipSpot(i);
        if (isPopularPlace(i))
          changeMarkerIcon(placesArray[i]);
      }
    }
  }
}

function changeMarkerIcon(place) {
  for (var i = 0; i < placesMarkerArray.length; i++) {
    if (placesMarkerArray[i].placeId === place.place_id) {
      placesMarkerArray[i].setIcon(new google.maps.MarkerImage('img/star-'+ chosenPlacesFilter +'.svg', null, null, null, new google.maps.Size(36,36)));
    }
  }
};

var isTweetFromPlace = function(i, j) {
  return (Math.abs(placesArray[i].geometry.location.lat() - tweetData[j].latitude) < 0.0001 &&
  Math.abs(placesArray[i].geometry.location.lng() - tweetData[j].longitude) < 0.0001);
};

var isPopularPlace = function(i) {
  return hipSpots[placesArray[i].place_id] > 3;
};

var recordHipSpot = function(i) {
  if (hipSpots[placesArray[i].place_id]) {
    hipSpots[placesArray[i].place_id] = hipSpots[placesArray[i].place_id] += 1;
  } else {
    hipSpots[placesArray[i].place_id] = 1;
  }
};

var changeMarkerIcon = function(place) {
  for (var i = 0; i < placesMarkerArray.length; i++) {
    if (placesMarkerArray[i].placeId === place.place_id) {
      placesMarkerArray[i].setIcon(new google.maps.MarkerImage('img/star-'+ chosenPlacesFilter +'.svg', null, null, null, new google.maps.Size(36, 36)));
    }
  }
};

var defaultTimeSlot = function() {
  return Math.floor(new Date().getHours()/4) + 1;
};

var drawHeatMap = function(tweetsArray) {
  var pointArray = new google.maps.MVCArray(tweetsArray);
  heatmap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
  heatmap.set('radius', 16);
  heatmap.set('opacity', 1);
  heatmap.setMap(map);
};
