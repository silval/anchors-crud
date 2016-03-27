var chai = require('chai');
var expect = chai.expect
  , should = chai.should();

process.env.ANCHORS_SERVICE_PORT=10000
process.env.MONGOHQ_URL='mongodb://test.com:27000/mydb'

var AnchorsConfig = require(__dirname+'/../src/anchors/AnchorsConfig');

describe('Anchors Config Unit tests', function() {

  it('AnchorsConfig should set DB Url the same as MONGOHQ_URL env variable', function() {
    expect(AnchorsConfig.DBUrl).to.equal(process.env.MONGOHQ_URL);
  });

  it('AnchorsConfig should set service port number same as ANCHORS_SERVICE_PORT env variable', function() {
    expect(AnchorsConfig.ServicePort).to.equal(process.env.ANCHORS_SERVICE_PORT);
  });

});
