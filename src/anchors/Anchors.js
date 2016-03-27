var mongoskin = require('mongoskin');
var AnchorsConfig = require('./AnchorsConfig');

function Anchors() {
   this.db = null;
   this.collectons=[];
}

Anchors.prototype.getDB = function(dbUrl) {
  if (typeof dbUrl == 'undefined' || dbUrl=="") {
    return false;
  }
  this.dbUrl=dbUrl;

  // console.log("In getDB, initiating DB  "+this.dbUrl);
  this.db = mongoskin.db(dbUrl, {safe: true});
  this.collections = {
     "anchors" : this.db.collection('anchors')
   };

  // TBD How to check if DB or collection does not exist?

  return true;
};

// listAnchors: retrieves anchor records from the DB.
// URL parameters allowed:
//   page: page number to retrieve. Default: 1
//   pageSize: number of records retrieved per page. Default defined by AnchorsConfig.PageSize.
// Example: /listAnchors?page=2&pageSize=7
// Returns a JSON object containing attributes "data", "page" and "pageSize"
//
Anchors.prototype.listAnchors = function (req, res, next) {
  // console.log("in listAnchors. Collections=",this.collections);
  // console.log("req=",req);
  var pageNumber = req.query.page || "1";
  var pageSize = req.query.pageSize || AnchorsConfig.PageSize;

  if (pageNumber<=0) {
     return next("Page number must be higher than 0");
  }

  req.collections.anchors.find({}).skip((parseInt(pageNumber)-1)*parseInt(pageSize)).limit(parseInt(pageSize)).toArray(function(error, anchors) {
    if (error) return next(error);
    res.sendStatus( JSON.stringify({ "data" : anchors, "page" : pageNumber, "pageSize" : pageSize }) );
  });

}

//
// addAnchor: adds a new anchor record to the DB.
// Returns a JSON object  - see example further below
//
Anchors.prototype.addAnchor = function (req, res, next) {

  // curl --data 'anchor={"type":{"object_id":"100000001","description":"Poste","cost":1,"allow_box":false},"loc":{"type":"Point","coordinates":[-22.3364,-47.274]},"obs":"Try 1","buffer":0}' http://127.0.0.1:8085/addAnchor
  // var newAnchor= {type : {object_id : '100000001',description : 'Poste',cost : 1,allow_box : false}, loc : { type: 'Point', coordinates: [ -22.336400, -47.27400]},obs : 'Try 1',buffer : 0};
  if (!req.body.anchor) return next(new Error('No anchor payload provided.'));

  var anchor = req.body.anchor;

  try {
    anchor = JSON.parse(anchor);
  } catch (exc) {
    return next("Error parsing input JSON object. "+exc);
  }

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
  if (!req.params.id) return next(new Error('No anchor ID provided.'));
  // console.log("req.params.id="+req.params.id);

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
  if (!req.params.id) return next(new Error('No anchor ID provided.'));
  if (!req.body.anchor) return next(new Error('No updated anchor payload provided.'));
  console.log("req.params.id="+req.params.id);

  var anchor = req.body.anchor;

  try {
    anchor = JSON.parse(anchor);
  } catch (exc) {
    return next("Error parsing input JSON object. "+exc);
  }

  // TBD validate anchor data fields
  // Required: loc, type

  console.log("req.body.anchor=",anchor);

  req.collections.anchors.updateById(req.params.id, {$set: anchor}, function(error, count) {
    if (error) return next(error);
    res.sendStatus(JSON.stringify({affectedCount: count}));
    // example of return: {"affectedCount":{"ok":1,"nModified":1,"n":1}}
  });
};

Anchors.prototype.findAnchor = function(anchorID) {
  if (typeof anchorID == 'undefined') {
    return null;
  }

  return "";
};

module.exports = Anchors;
