var EventHandler = function(googleMap, placesFinder, tweetsFinder, mapController) {
  this.googleMap = googleMap;
  this.placesFinder = placesFinder;
  this.tweetsFinder = tweetsFinder;
  this.mapController = mapController;
};

EventHandler.prototype.initialize = function() {
  this.animateLogo();
  this.showLegend();
  this.highlightCurrentTimeSlot();
  this.listenForTimeSlotChoice();
  this.listenForPlacesChoice();
  this.listenForCurrentLocationChoice();
};

EventHandler.prototype.animateLogo = function() {
  $('.tlt').textillate({
    in: { effect: 'splat', delay: 20 },
    out: { effect: 'bounceOut', delay: 20 },
    loop: true,
  });
};

EventHandler.prototype.showLegend = function() {
  setTimeout(function() {
    $('#legend').fadeIn();
    setTimeout(function() {
      $('#legend').fadeOut();
    }, 5000);
  }, 5000);
};

EventHandler.prototype.highlightCurrentTimeSlot = function() {
  $('.button-group').find("[data-pick='" + this.tweetsFinder.defaultTimeSlot() +
    "']").css("background-color", "#007095");
};

EventHandler.prototype.listenForTimeSlotChoice = function() {
  var _this = this;
  $('.button').on('click', function(event) {
    event.preventDefault();
    $(this).parent().siblings().find('a').css("background-color", "#00aced");
    $(this).css("background-color", "#007095");
    _this.tweetsFinder.chosenTimeSlot = $(this).data('pick');
    _this.tweetsFinder.tweetsSearch();
  });  
};

EventHandler.prototype.listenForPlacesChoice = function() {
  var _this = this;
  $('.placesFilter').on('click', function(event) {
    event.preventDefault();
    _this.placesFinder.chosenPlacesFilter = [$(this).data('filter')];
    _this.placesFinder.placesSearch();
  });
};

EventHandler.prototype.listenForCurrentLocationChoice = function() {
  var _this = this;
  $('.current-location').on('click', function(event) {
    event.preventDefault();
    _this.googleMap.showCurrentLocation(
      _this.mapController.userLatitude,
      _this.mapController.userLongitude
    );
    $("#pac-input").attr("placeholder", "Find location");
    $("#pac-input").val('');
  });
};

EventHandler.prototype.showMap = function() {
  $('#map-canvas').show();
  $('.sticky').show();
  $('footer').show();
  $('.splashScreen').hide();
};

EventHandler.prototype.resetSearchBoxValue = function() {
  $("#pac-input").val('');
};

EventHandler.prototype.setSearchBoxPlaceholder = function() {
  $("#pac-input").attr("placeholder", $("#pac-input").val() || "Find location");
};

EventHandler.prototype.renderInfoModal = function(result) {
  var rendered = Mustache.render($('#infoModalContent').html(), { result: result });
  $('#infoModal').html(rendered).show();
  $('#closeModal').on('click', function() {
    $('#infoModal').hide();
  });
};
