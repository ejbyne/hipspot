$(function() {

  $('.tlt').textillate({
    in: { effect: 'splat', delay: 20 },
    out: { effect: 'bounceOut', delay: 20 },
    loop: true,
  });

  $('.button-group').find("[data-pick='" + defaultTimeSlot() + "']").css("background-color", "#007095");

  $('.button').on('click', function(event) {
    event.preventDefault();
    $(this).parent().siblings().find('a').css("background-color", "#00aced");
    $(this).css("background-color", "#007095");
    chosenTimeSlot = $(this).data('pick');
    tweetSearch(map.getBounds(), chosenTimeSlot);
  });

  setTimeout(function() {
    $('#legend').fadeIn();
    setTimeout(function() {
      $('#legend').fadeOut();
    }, 5000);
  }, 5000);

  $('.placesFilter').on('click', function(event) {
    event.preventDefault();
    chosenPlacesFilter = [$(this).data('filter')];
    placesImage = "img/" + $(this).data('filter') + ".svg";
    placesSearch(map.getBounds());
  });

  $('.current-location').on('click', function(event) {
    event.preventDefault();
    var currentLocation = new google.maps.LatLng(userLatitude, userLongitude);
    map.setCenter(currentLocation);
    $("#pac-input").attr("placeholder", "Find location");
    $("#pac-input").val('');
  });
});
