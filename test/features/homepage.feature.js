describe('Homepage', function() {

  before(function() {
    casper.start('http://localhost:4000/');
  });

  it('displays the title', function() {
    casper.then(function() {
      expect('hipSpot').to.matchTitle;
    });
  });

  it('contains a map element', function() {
    casper.then(function() {
      expect('#map-canvas').to.be.inDOM;
    });
  });

  it('loads jQuery JavaScript library', function() {
    casper.then(function() {
      expect('https://code.jquery.com/jquery-2.1.1.min.js').to.be.loaded;
    });
  });

  it('loads Google Maps API JavaScript library', function() {
    casper.then(function() {
      expect('http://maps.googleapis.com/maps/api/js').to.be.loaded;
    });
  });
 
  it('loads application JavaScript file', function() {
    casper.then(function() {
      expect('/js/app.js').to.be.loaded;
    });
  });
});
