$(function() {

  var googleAPI = new GoogleAPI();
  var placesFinder = new PlacesFinder(googleAPI);
  var tweetsFinder = new TweetsFinder(googleAPI, placesFinder);
  var mapController = new MapController(googleAPI, placesFinder, tweetsFinder);

  var loadMap = function(position) {
  	mapController.initialize(position);
  };

  var updatePosition = function(position) {
  	mapController.updatePosition(position);
  };

  var error = function(err) {
    return false;
  };

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(loadMap, error, options);
  navigator.geolocation.watchPosition(updatePosition, error, options);
  
  $('.tlt').textillate({
    in: { effect: 'splat', delay: 20 },
    out: { effect: 'bounceOut', delay: 20 },
    loop: true,
  });

  $('.button-group').find("[data-pick='" + tweetsFinder.defaultTimeSlot() + "']").css("background-color", "#007095");

  $('.button').on('click', function(event) {
    event.preventDefault();
    $(this).parent().siblings().find('a').css("background-color", "#00aced");
    $(this).css("background-color", "#007095");
    tweetsFinder.chosenTimeSlot = $(this).data('pick');
    tweetsFinder.tweetsSearch();
  });

  setTimeout(function() {
    $('#legend').fadeIn();
    setTimeout(function() {
      $('#legend').fadeOut();
    }, 5000);
  }, 5000);

  $('.placesFilter').on('click', function(event) {
    event.preventDefault();
    googleAPI.chosenPlacesFilter = [$(this).data('filter')];
    googleAPI.placesImage = "img/" + $(this).data('filter') + ".svg";
    placesFinder.placesSearch();
  });

  $('.current-location').on('click', function(event) {
    event.preventDefault();
    var currentLocation = new google.maps.LatLng(mapController.userLatitude, mapController.userLongitude);
    googleAPI.googleMap.setCenter(currentLocation);
    $("#pac-input").attr("placeholder", "Find location");
    $("#pac-input").val('');
  });
});

