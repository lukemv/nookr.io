const lib = require('../src/libnook');
const chai = require('chai');
chai.should();

describe('googleVolumeSearch', () => {
  // Long running test..
  it('should return a list of titles given a query', (done) => {
    lib.googleVolumeSearch('foo').then((res) => {
      res.kind.should.equal('books#volumes');
      res.totalItems.should.be.above(10);
      res.items.should.be.an('Array');
      done();
    });
  });
});
