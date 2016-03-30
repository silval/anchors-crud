var SystemConfig = require('./SystemConfig');

var CommonCRUD = {
  //
  // addRecord: adds a new anchor type record to the DB.
  // Returns a JSON object  - see example further below
  //
  addRecord: function (req, res, next) {

    // curl --data 'record={ "description" : "Bandeija", "icon" : "rack01.png", "cost" : 100}' http://127.0.0.1:8085/addAnchorType
    if (!req.body.record) return next('NO_RECORD_PAYLOAD_PROVIDED');

    var record = {};

    try {
      record = (typeof req.body.record == 'string')? JSON.parse(req.body.record):req.body.record;
    } catch (exc) {
      return next("JSON_PARSING_ERROR"+" "+exc);
    }

    // TBD validate anchor type data fields
    // Required: loc, type

    req.collections[req.collectionId].insert(record, function(error, recordResponse) {
      if (error) return next(error);
      res.sendStatus(JSON.stringify(recordResponse));
      // example of return object
      // {"result":{"ok":1,"n":1},"ops":[{"description":"Bandeija","icon":"rack01.png","cost":100,"_id":"56f85e6fba8e4152542811a2"}],"insertedCount":1,"insertedIds":["56f85e6fba8e4152542811a2"]}
    });
  },
  //
  // delRecord: deletes an existing record from the DB.
  // Returns a JSON object  - see example further below
  //
  delRecord : function (req, res, next) {

    // curl -X DELETE http://127.0.0.1:8085/delAnchorType/56f85f0d93b0c267540526bb
    if (!req.params.id) return next("NO_RECORD_ID_PROVIDED");

    req.collections[req.collectionId].removeById(req.params.id, function(error, count) {
      if (error) return next(error);
      res.sendStatus(JSON.stringify({affectedCount: count}));
      // example of return: {"affectedCount":1}
    });
  },
  //
  // editRecord: updates an existing record in the DB.
  // Returns a JSON object  - see example further below
  //
  editRecord : function (req, res, next) {

    // curl -X PUT -d 'record={"cost":50}' http://127.0.0.1:8085/editAnchorType/100000003
    if (!req.params.id) return next("NO_RECORD_ID_PROVIDED");
    if (!req.body.record) return next("NO_RECORD_PAYLOAD_PROVIDED");

    var record = {};

    try {
      record = (typeof req.body.record == 'string')? JSON.parse(req.body.record):req.body.record;
    } catch (exc) {
      return next("JSON_PARSING_ERROR"+" "+exc);
    }

    // TBD validate record data fields
    // Required: loc, type

    req.collections[req.collectionId].updateById(req.params.id, {$set: record}, function(error, count) {
      if (error) return next(error);
      res.sendStatus(JSON.stringify({affectedCount: count}));
      // example of return: {"affectedCount":{"ok":1,"nModified":1,"n":1}}
    });
  },
  //
  // getRecord: get one single existing record from the DB.
  // Parameter required in the URL: object ID of record. Example: /getAnchorType/100000002
  // Returns a JSON object  - see example further below
  //
  getRecord: function (req, res, next) {

    // curl -X GET http://127.0.0.1:8085/getAnchorType/100000002
    if (!req.params.id) return next("NO_RECORD_ID_PROVIDED");
    req.collections[req.collectionId].findById(req.params.id, function(error, recordResponse) {
      if (error) return next(error);
      res.sendStatus(JSON.stringify({ "data" : recordResponse}));
      // example of return: { "data": { "_id": "100000002", "description": "Cordoalha", ...}}
      // example of not found returned: { "data": null )
    });
  },
  //
  // findAnchors: get existing records in the DB based on a query object.
  // Optional parameterURL: q: query string, p (page number), ps (pageSize)
  // Returns a JSON object  - see example further below
  //
  findRecords: function (req, res, next) {

    // curl -X GET http://127.0.0.1:8085/findAnchorTypes
    // curl -X GET http://127.0.0.1:8085/findAnchorTypes?q={"description" : "Rack"}
    var query = {};

    if (req.query && req.query.q && req.query.q!="") {
      try {
        query = JSON.parse(req.query.q);
      } catch (exc) {
        return next("JSON_PARSING_ERROR"+" "+exc);
      }

    };

    var pageNumber = req.query.p || "1";
    var pageSize = req.query.ps || SystemConfig.PageSize;
    if (parseInt(pageNumber)<=0) {
       return next("PAGE_NUMBER_INVALID");
    }

    req.collections[req.collectionId].find(query).skip((parseInt(pageNumber)-1)*parseInt(pageSize)).limit(parseInt(pageSize)).toArray(function(error, records) {
      if (error) return next(error);
      res.sendStatus( JSON.stringify({ "data" : records, "page" : pageNumber, "pageSize" : pageSize }) );
    });

  }
};

module.exports = CommonCRUD;