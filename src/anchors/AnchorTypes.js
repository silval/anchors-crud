var mongoskin = require('mongoskin');
var SystemConfig = require('./SystemConfig');
var CommonCRUD = require('./CommonCRUD.js');

function AnchorTypes() {
}

AnchorTypes.prototype = CommonCRUD;

//
// AnchorTypes.prototype.addRecord = CommonCRUD.addRecord;
// AnchorTypes.prototype.delRecord = CommonCRUD.delRecord;
// AnchorTypes.prototype.editRecord = CommonCRUD.editRecord;
// AnchorTypes.prototype.getRecord = CommonCRUD.getRecord;
// AnchorTypes.prototype.findRecords = CommonCRUD.findRecords;

module.exports = AnchorTypes;
