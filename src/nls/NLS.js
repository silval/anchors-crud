// TBD add logic to get current language and select appropriate NLS file here
var nls_strings = require('./messages_en_US');

function NLS() {
}

NLS.prototype.getMessage = function(key) {
  if (typeof key == 'undefined' || key=="") {
    return null;
  }

  if (! nls_strings[key]) {
    return key;
  }

  return nls_strings[key];
};

module.exports = NLS;
