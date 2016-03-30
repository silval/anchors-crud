var chai = require('chai');
var expect = chai.expect
  , should = chai.should();

var SystemConfig = require(__dirname+'/../src/anchors/SystemConfig');


describe('SystemConfig Unit tests', function() {

  it('SystemConfig should set DB Url the same as MONGOHQ_URL env variable', function() {
    expect(SystemConfig.DBUrl).to.equal(process.env.MONGOHQ_URL);
  });

  it('SystemConfig should set service port number same as ANCHORS_SERVICE_PORT env variable', function() {
    expect(SystemConfig.ServicePort).to.equal(process.env.SERVICE_PORT);
  });

  it('SystemConfig should set PageSize number same as ANCHORS_PAGE_SIZE env variable', function() {
    expect(SystemConfig.PageSize).to.equal(process.env.PAGE_SIZE);
  });

});
