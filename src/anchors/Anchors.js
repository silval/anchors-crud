var mongoskin = require('mongoskin');
var AnchorsConfig = require('./AnchorsConfig');
// var Messages = require('./../nls/NLS');

function Anchors() {
   this.db = null;
   this.collectons=[];
}

//
// addAnchor: adds a new anchor record to the DB.
// Returns a JSON object  - see example further below
//
Anchors.prototype.addAnchor = function (req, res, next) {

  if (!req.body.anchor) return next('NO_RECORD_PAYLOAD_PROVIDED');

  var anchor = req.body.anchor;

  // TBD validate anchor data fields
  // Required: loc, type

  req.collections.anchors.insert(anchor, function(error, anchorResponse) {
    // console.log("error="+error);
    if (error) return next(error);
    // console.log("anchorResponse=",anchorResponse)
    res.sendStatus(JSON.stringify(anchorResponse));
    // example of return object
    // {"result":{"ok":1,"n":1},"ops":[{"type":{"object_id":"100000001","description":"Poste","cost":1,"allow_box":false},"loc":{"type":"Point","coordinates":[-22.3364,-47.274]},"obs":"Try 2","buffer":0,"_id":"56f7674bd7de3e933efd4f97"}],"insertedCount":1,"insertedIds":["56f7674bd7de3e933efd4f97"]}
  });

}

//
// delAnchor: deletes an existing anchor record from the DB.
// Returns a JSON object  - see example further below
//
Anchors.prototype.delAnchor = function (req, res, next) {

  // curl -X DELETE http://127.0.0.1:8085/delAnchor/56f71173fbef73c13744f91b
  if (!req.params.id) return next("NO_RECORD_ID_PROVIDED");

  req.collections.anchors.removeById(req.params.id, function(error, count) {
    if (error) return next(error);
    res.sendStatus(JSON.stringify({affectedCount: count}));
    // example of return: {"affectedCount":1}
  });
};

//
// editAnchor: updates an existing anchor record in the DB.
// Returns a JSON object  - see example further below
//
Anchors.prototype.editAnchor = function (req, res, next) {

  // curl -X PUT -d 'anchor={"buffer":30}' http://127.0.0.1:8085/editAnchor/56f71579e3093b1539f5bb80
  if (!req.params.id) return next("NO_RECORD_ID_PROVIDED");
  if (!req.body.anchor) return next("NO_RECORD_PAYLOAD_PROVIDED");

  var anchor = req.body.anchor;

  // TBD validate anchor data fields
  // Required: loc, type

  // console.log("req.body.anchor=",anchor);

  req.collections.anchors.updateById(req.params.id, {$set: anchor}, function(error, count) {
    if (error) return next(error);
    res.sendStatus(JSON.stringify({affectedCount: count}));
    // example of return: {"affectedCount":{"ok":1,"nModified":1,"n":1}}
  });
};

//
// getAnchor: get one single record of an existing anchor in the DB.
// Parameter required in the URL: object ID of record. Example: /getAnchor/56f709379a96f6580174f7cd
// Returns a JSON object  - see example further below
//
Anchors.prototype.getAnchor = function (req, res, next) {

  // curl -X GET http://127.0.0.1:8085/getAnchor/56f709379a96f6580174f7cd
  if (!req.params.id) return next("NO_RECORD_ID_PROVIDED");
  // console.log("req.body.anchor=",anchor);

  req.collections.anchors.findById(req.params.id, function(error, recordResponse) {
    if (error) return next(error);
    res.sendStatus(JSON.stringify({ "data" : recordResponse}));
    // example of return: { "data": { "_id": "56f709379a96f6580174f7cd", "type": { ... } )
    // example of not found returned: { "data": null )
  });
};

//
// findAnchors: get existing records of anchors in the DB based on a query object.
// Optional parameterURL: q: query string, page, pageSize
// Returns a JSON object  - see example further below
//
Anchors.prototype.findAnchors = function (req, res, next) {

  // curl -X GET http://127.0.0.1:8085/findAnchors
  // curl -X GET http://127.0.0.1:8085/findAnchors?q={"type.description" : "Rack"}
  var query = {};

  if (req.query && req.query.q && req.query.q!="") {
    try {
      query = JSON.parse(req.query.q);
    } catch (exc) {
      return next("JSON_PARSING_ERROR"+" "+exc);
    }

  };

  var pageNumber = req.query.page || "1";
  var pageSize = req.query.pageSize || AnchorsConfig.PageSize;

  if (pageNumber<=0) {
     return next("PAGE_NUMBER_INVALID");
  }

  req.collections.anchors.find(query).skip((parseInt(pageNumber)-1)*parseInt(pageSize)).limit(parseInt(pageSize)).toArray(function(error, anchors) {
    if (error) return next(error);
    res.sendStatus( JSON.stringify({ "data" : anchors, "page" : pageNumber, "pageSize" : pageSize }) );
  });

}

module.exports = Anchors;
