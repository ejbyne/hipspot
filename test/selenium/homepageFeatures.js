var expect = require('chai').expect;
var webdriverio = require('webdriverio');

describe('Visiting the homepage', function() {

  var client = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome'}   });
    client.init(done);
  });

  after(function(done) {
    client.end(done);
  });

  beforeEach(function(done) {
    client
      .url('http://localhost:4000')
      .call(done);
  });

  it('has a title', function(done) {
    client
      .getTitle(function(err, title) {
        expect(err).to.not.be.true;
        expect(title).to.eql('hipSpot');
      })
      .call(done);
  });

  it('contains a map element', function(done) {
    client
      .elementIdDisplayed('map-canvas', function(err, result) {
         expect(err).to.not.be.true;
         expect(result).to.be.true;
      })
      .call(done);
  });

  it('loads jQuery Javascript library', function(done) {
    client
      .call(done);
  });

  it('loads Google Maps API Javascript Library', function(done) {
    client
      .call(done);
  });

  it('loads application Javascript files', function(done) {
    client
      .call(done);
  });

});

