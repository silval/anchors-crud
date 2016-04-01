var mongoskin = require('mongoskin');
var SystemConfig = require('common-artifacts').systemConfig;
var CommonCRUD = require('common-artifacts').commonCRUD;

function AnchorTypes() {
}

AnchorTypes.prototype = CommonCRUD;

module.exports = AnchorTypes;
