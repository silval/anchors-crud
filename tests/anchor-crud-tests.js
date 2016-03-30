var chai = require('chai');
var expect = chai.expect
  , should = chai.should();
var Anchors = require(__dirname+'/../src/anchors/Anchors');
// var Messages = require(__dirname+'/../src/nls/NLS');

describe('Anchors CRUD Unit tests', function() {

  var anchorsObj = new Anchors();
  // var nls = new Messages();

  // GET
  it('getAnchor() should return NO_RECORD_ID_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.getAnchor({ "params" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_ID_PROVIDED");
  });

  // FIND
  it('findAnchors() should return PAGE_NUMBER_INVALID error if pageNumber is lower than 1', function() {
    expect(anchorsObj.findAnchors({ "query" : { "page" : "0", "q" : "{}" }},null,function(msg){ return msg})).to.be.equal("PAGE_NUMBER_INVALID");
  });

  it('findAnchors() should return JSON_PARSING_ERROR error if if malformed query json object is in request', function() {
    expect(anchorsObj.findAnchors({ "query" : { "page" : "0", "q" : "{ 'hello' }"}},null,function(msg){ return msg})).to.have.string("JSON_PARSING_ERROR");
  });

  // ADD
  it('addAnchor() should return NO_RECORD_PAYLOAD_PROVIDED error if no anchor json object is in request', function() {
    expect(anchorsObj.addAnchor({ "body" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_PAYLOAD_PROVIDED");
  });

  // DELETE
  it('delAnchor() should return NO_RECORD_ID_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.delAnchor({ "params" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_ID_PROVIDED");
  });

  // EDIT
  it('editAnchor() should return NO_RECORD_ID_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.editAnchor({ "params" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_ID_PROVIDED");
  });

  it('editAnchor() should return NO_RECORD_PAYLOAD_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.editAnchor({ "body" : {}, "params" : { "id" : "1"} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_PAYLOAD_PROVIDED");
  });

});
