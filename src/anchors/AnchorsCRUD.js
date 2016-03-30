var express = require('express'),
  http = require('http'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  logger = require('morgan'),
  mongoskin = require('mongoskin');

var app = express();

var session = require('express-session');

var user_auth = require('user-auth');

var Anchors = require('./Anchors');
var AnchorTypes = require('./AnchorTypes');
var AnchorsConfig = require('./AnchorsConfig');

var auth = new user_auth();
var anchorsObj = new Anchors();
var anchorTypesObj = new AnchorTypes();

// TBD How to check if DB or collection does not exist?

var dbObj = mongoskin.db(AnchorsConfig.DBUrl, {safe: true});

var collectionsObj = {
  "anchors" : dbObj.collection('anchors'),
  "anchor_types" : dbObj.collection('anchor_types')
 };


app.set('port', AnchorsConfig.ServicePort);

app.use(bodyParser.json());
app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if (!collectionsObj.anchors) return next(new Error("No anchor collection."))
  if (!collectionsObj.anchor_types) return next(new Error("No anchor types collection."))
  req.collections = collectionsObj;
  return next();
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/v1/*', auth.validateRequest);

app.post('/login', auth.login);

app.use(function(req, res, next) {
   req.collectionId="anchors";
   return next();
});
app.get('/api/v1/listAnchors', anchorsObj.findRecords);
app.get('/api/v1/findAnchors', anchorsObj.findRecords);
app.post('/api/v1/addAnchor', anchorsObj.addRecord);
app.get('/api/v1/getAnchor/:id', anchorsObj.getRecord);
app.put('/api/v1/editAnchor/:id', anchorsObj.editRecord);
app.delete('/api/v1/delAnchor/:id', anchorsObj.delRecord);

app.use(function(req, res, next) {
   req.collectionId="anchor_types";
   return next();
});
app.get('/api/v1/findAnchorTypes', anchorTypesObj.findRecords);
app.get('/api/v1/listAnchorTypes', anchorTypesObj.findRecords);
app.post('/api/v1/addAnchorType', anchorTypesObj.addRecord);
app.get('/api/v1/getAnchorType/:id', anchorTypesObj.getRecord);
app.delete('/api/v1/delAnchorType/:id', anchorTypesObj.delRecord);
app.put('/api/v1/editAnchorType/:id', anchorTypesObj.editRecord);

app.all('*', function(req, res) {
  res.sendStatus(404);
});

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function(){
    console.info('Anchors CRUD server listening on port ' + app.get('port'));
  });
}
var shutdown = function() {
  server.close();
}
if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
// sample query URLs
// curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://127.0.0.1:8085/login
// curl -H "Content-Type: application/json" -X GET -d '{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTk4OTA1NTkzMDksInVzZXJuYW1lIjoiam9lQGRvZS5jb20ifQ.X6JygHAmqZj1UbmI_mUWoPJ4jVadiz76PgChVMqj53I","x_key":"joe@doe.com"}' http://127.0.0.1:8085/api/v1/listAnchorTypes
// curl ...  --data 'anchor={"type":{"object_id":"100000001","description":"Poste","cost":1,"allow_box":false},"loc":{"type":"Point","coordinates":[-22.3364,-47.274]},"obs":"Try 1","buffer":0}' http://127.0.0.1:8085/api/v1/addAnchor
