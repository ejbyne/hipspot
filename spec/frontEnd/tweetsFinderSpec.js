describe('TweetsFinder', function() {

  var googleMap, placesFinder, tweetsFinder;

  beforeEach(function() {
    googleMap = jasmine.createSpyObj(
      'googleMap',
      ['clearHeatMap', 'drawHeatMap', 'resetMarkerIcon', 'changeMarkerIcon']
    );
    googleMap.getMapCoords = function() { return true; }
    spyOn(googleMap, 'getMapCoords').and.returnValue({});
    placesFinder = {
      placesMarkerArray:
        [{
          position: { k: 0, D: 0 },
          placeId: 'aBar'
        }],
        chosenPlacesFilter: 'bar'
    };
    tweetsFinder = new TweetsFinder(googleMap, placesFinder);
    tweetsFinder.tweetData = [
      { latitude: 0, longitude: 0 }
    ];
    tweetsFinder.heatMap = 'heatmap';
    $ = jasmine.createSpyObj(
      '$', ['post']
    );
  });

  describe('timeslot', function() {
    it('finds the current timeslot', function() {
      expect(tweetsFinder.defaultTimeSlot()).toBeGreaterThan(0);
      expect(tweetsFinder.defaultTimeSlot()).toBeLessThan(7);
    });
  });

  describe('tweets search', function() {
    it('requests tweet data', function() {
      tweetsFinder.tweetsSearch();
      expect(googleMap.getMapCoords).toHaveBeenCalled();
      expect($.post).toHaveBeenCalled();
    });
  });

  describe('tweet data', function() {
    it('redraws the heat map', function() {
      tweetsFinder.showTweetData();
      expect(googleMap.clearHeatMap).toHaveBeenCalledWith('heatmap');
      expect(googleMap.drawHeatMap).toHaveBeenCalledWith(tweetsFinder.tweetData);
    });
  });

  describe('hipSpots', function() {
    it('searches for hipSpots', function() {
      tweetsFinder.findHipSpots();
      expect(googleMap.resetMarkerIcon).toHaveBeenCalledWith(placesFinder.placesMarkerArray[0], 'bar');
      expect(tweetsFinder.hipSpots.aBar).toEqual(1);
      expect(tweetsFinder.isPopularPlace(placesFinder.placesMarkerArray[0])).toEqual(false);
      tweetsFinder.hipSpots.aBar = 4;
      expect(tweetsFinder.isPopularPlace(placesFinder.placesMarkerArray[0])).toEqual(true);
    });
  });

});
