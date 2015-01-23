describe('Homepage', function() {

  before(function() {
    casper.start('http://localhost:3000/');
  });

  it('displays the title', function() {
    casper.then(function() {
      expect('hipSpot').to.matchTitle;
    });
  });

});