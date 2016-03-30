process.env.MONGOHQ_URL='mongodb://test.com:27000/mydb'
process.env.SERVICE_PORT=10000
process.env.PAGE_SIZE=50

var chai = require('chai');
var expect = chai.expect;

describe('Set environment variables', function() {

    it('set env variables', function() {
      expect(true).to.be.true;
    });
});
