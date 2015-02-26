describe('mapController', function() {

  var googleMap, googleSearchBox, placesFinder, tweetsFinder, eventHandler;

  beforeEach(function() {
    googleMap = jasmine.createSpyObj(
      'googleMap',
      ['createMap', 'addPlacesService', 'addMapListener', 'clearMarker', 'createCurrentPositionMarker']
    );
    googleSearchBox = jasmine.createSpyObj(
      'googleSearchBox', ['addSearchBox']
    );
    placesFinder = jasmine.createSpyObj(
      'placesFinder', ['placesSearch']
    );
    tweetsFinder = jasmine.createSpyObj(
      'tweetsFinder', ['tweetsSearch']
    );
    eventHandler = jasmine.createSpyObj(
      'eventHandler', ['resetSearchBoxValue', 'showMap']
    );
    mapController = new MapController(googleMap, googleSearchBox, placesFinder, tweetsFinder);
    mapController.eventHandler = eventHandler;
  });

  describe('searches', function() {
    it('searches for tweets and places', function() {
      mapController.performSearch();
      expect(placesFinder.placesSearch).toHaveBeenCalled();
      expect(tweetsFinder.tweetsSearch).toHaveBeenCalled();
      expect(eventHandler.resetSearchBoxValue).toHaveBeenCalled();
    });
  });

  describe('loading the map', function() {
    it('initializes the map', function() {
      var firstPosition = {
        coords: { latitude: 0, longitude: 0 }
      };
      mapController.loadMap(firstPosition);
      expect(mapController.userLatitude).toEqual(0);
      expect(mapController.userLongitude).toEqual(0);
      expect(googleMap.createMap).toHaveBeenCalledWith(0, 0);
      expect(googleMap.addPlacesService).toHaveBeenCalled();
      expect(googleMap.createCurrentPositionMarker).toHaveBeenCalledWith(0, 0);
      expect(googleSearchBox.addSearchBox).toHaveBeenCalledWith(googleMap.map);
      expect(eventHandler.showMap).toHaveBeenCalled();
    });
  });

  describe('updating the map', function() {
    it('updates the map according to the user\'s position', function() {
      var secondPosition = {
        coords: { latitude: 1, longitude: 1 }
      };
      mapController.currentPositionMarker = {};
      mapController.updatePosition(secondPosition);
      expect(googleMap.clearMarker).toHaveBeenCalledWith(mapController.currentPositionMarker);
      expect(mapController.userLatitude).toEqual(1);
      expect(mapController.userLongitude).toEqual(1);
      expect(googleMap.createCurrentPositionMarker).toHaveBeenCalledWith(1, 1);
    });
  });

});