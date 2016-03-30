var mongoskin = require('mongoskin');
var SystemConfig = require('./SystemConfig');
var CommonCRUD = require('./CommonCRUD.js');

function Anchors() {
}

Anchors.prototype = CommonCRUD;

// Anchors.prototype.addRecord = CommonCRUD.addRecord;
// Anchors.prototype.delRecord = CommonCRUD.delRecord;
// Anchors.prototype.editRecord = CommonCRUD.editRecord;
// Anchors.prototype.getRecord = CommonCRUD.getRecord;
// Anchors.prototype.findRecords = CommonCRUD.findRecords;

module.exports = Anchors;
