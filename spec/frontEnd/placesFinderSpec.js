describe('PlacesFinder', function() {

  var googleMap, tweetsFinder, placesFinder;

  beforeEach(function() {
    googleMap = jasmine.createSpyObj(
      'googleMap',
      ['clearMarker', 'searchPlaces', 'clearClusterer', 'createClusterer']
    );
    googleMap.createPlacesMarker = function() { return true; }
    spyOn(googleMap, 'createPlacesMarker').and.returnValue('marker');
    tweetsFinder = jasmine.createSpyObj(
      'tweetsFinder',
      ['findHipSpots']
    );
    placesFinder = new PlacesFinder(googleMap);
    placesFinder.tweetsFinder = tweetsFinder;
    placesFinder.chosenPlacesFilter = 'bar';
    placesFinder.placesMarkerArray = ['marker'];
    placesFinder.markerClusterer = 'clusterer';
  });

  describe('places search', function() {
    it('clears existing markers and requests a google search', function() {
      placesFinder.placesSearch();
      expect(googleMap.clearMarker).toHaveBeenCalledWith('marker');
      expect(placesFinder.placesMarkerArray).toEqual([]);
      expect(googleMap.searchPlaces).toHaveBeenCalledWith(placesFinder);
    });
  });

  describe('process search', function() {
    it('creates new markers, updates the clustering and searches for hipspots', function() {
      placesFinder.placesMarkerArray = [];
      placesFinder.processSearch(['place']);
      expect(googleMap.createPlacesMarker).toHaveBeenCalledWith('place', 'bar');
      expect(placesFinder.placesMarkerArray).toEqual(['marker']);
      expect(tweetsFinder.findHipSpots).toHaveBeenCalled();
      expect(googleMap.clearClusterer).toHaveBeenCalledWith('clusterer');
      expect(googleMap.createClusterer).toHaveBeenCalledWith(['marker'], 'bar');
    });
  });

});

