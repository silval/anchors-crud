var chai = require('chai');
var expect = chai.expect
  , should = chai.should();

var Messages = require(__dirname+'/../src/nls/NLS');
var nls_strings = require(__dirname+'/../src/nls/messages_en_US');

describe('NLS Messages tests', function() {

  var messages = new Messages();

  it('getMessage should return null when no key is passed as a parameter', function() {
    expect(messages.getMessage()).to.be.null;
  });

  it('getMessage should return null when an empty key is passed as a parameter', function() {
    expect(messages.getMessage("")).to.be.null;
  });

  it('getMessage should return the key when an unknown key is passed as a parameter', function() {
    expect(messages.getMessage("blabla")).to.be.equal("blabla");
  });

  it('getMessage should return a translated message for an existing key', function() {
    expect(messages.getMessage("PAGE_NUMBER_INVALID")).to.be.equal(nls_strings["PAGE_NUMBER_INVALID"]);
  });

});
