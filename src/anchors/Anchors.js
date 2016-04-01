var mongoskin = require('mongoskin');
var SystemConfig = require('common-artifacts').systemConfig;
var CommonCRUD = require('common-artifacts').commonCRUD;

function Anchors() {
}

Anchors.prototype = CommonCRUD;

module.exports = Anchors;
