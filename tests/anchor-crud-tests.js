var chai = require('chai');
var expect = chai.expect
  , should = chai.should();
var Anchors = require(__dirname+'/../src/anchors/Anchors');
// var Messages = require(__dirname+'/../src/nls/NLS');

describe('Anchors CRUD Unit tests', function() {

  var anchorsObj = new Anchors();
  // var nls = new Messages();

  // GET
  it('getRecord() should return NO_RECORD_ID_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.getRecord({ "params" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_ID_PROVIDED");
  });

  // FIND
  it('findRecords() should return PAGE_NUMBER_INVALID error if pageNumber is lower than 1', function() {
    expect(anchorsObj.findRecords({ "query" : { "p" : "0", "q" : "{}" }},null,function(msg){ return msg})).to.be.equal("PAGE_NUMBER_INVALID");
  });

  it('findRecords() should return JSON_PARSING_ERROR error if if malformed query json object is in request', function() {
    expect(anchorsObj.findRecords({ "query" : { "p" : "0", "q" : "{ 'hello' }"}},null,function(msg){ return msg})).to.have.string("JSON_PARSING_ERROR");
  });

  // ADD
  it('addRecord() should return NO_RECORD_PAYLOAD_PROVIDED error if no anchor json object is in request', function() {
    expect(anchorsObj.addRecord({ "body" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_PAYLOAD_PROVIDED");
  });

  // DELETE
  it('delRecord() should return NO_RECORD_ID_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.delRecord({ "params" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_ID_PROVIDED");
  });

  // EDIT
  it('editRecord() should return NO_RECORD_ID_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.editRecord({ "params" : {} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_ID_PROVIDED");
  });

  it('editRecord() should return NO_RECORD_PAYLOAD_PROVIDED error if no object ID is in request', function() {
    expect(anchorsObj.editRecord({ "body" : {}, "params" : { "id" : "1"} },null,function(msg){ return msg})).to.be.equal("NO_RECORD_PAYLOAD_PROVIDED");
  });

});
