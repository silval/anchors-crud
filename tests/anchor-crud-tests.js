var chai = require('chai');
var expect = chai.expect
  , should = chai.should();
var Anchors = require(__dirname+'/../src/anchors/Anchors');

describe('Anchors CRUD Unit tests', function() {

  var anchorsObj = new Anchors();

  it('getDB() should return false if dbUrl parameter is not passed it', function() {
    expect(anchorsObj.getDB()).to.be.false;
  });

  it('getDB() should return false if dbUrl parameter is an empty string', function() {
    expect(anchorsObj.getDB("")).to.be.false;
  });

  // it('getDB() should throw an exception if incorrect dbUrl parameter is provided', function() {
  //   expect(anchorsObj.getDB("mongodb://@localhost:27017/booboo")).to.be.false;
  // });

  it('findAnchor() should return null if no anchor key is passed in', function() {
    expect(anchorsObj.findAnchor()).to.be.null;
  });

  it('findAnchor() should NOT return null if an anchor key is passed in', function() {
    expect(anchorsObj.findAnchor(10)).not.to.be.null;
  });

});
