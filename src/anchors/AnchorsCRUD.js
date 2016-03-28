var express = require('express'),
  http = require('http'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  logger = require('morgan');

var app = express();

var session = require('express-session');

var auth = require('./../server/auth.js');
// var user = require('./users.js');

var Anchors = require('./Anchors');
var AnchorTypes = require('./AnchorTypes');
var AnchorsConfig = require('./AnchorsConfig');

var anchorsObj = new Anchors();
var anchorTypesObj = new AnchorTypes();
anchorsObj.getDB(AnchorsConfig.DBUrl);

app.set('port', AnchorsConfig.ServicePort);

app.use(bodyParser.json());
app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(function(req, res, next) {
  if (!anchorsObj.collections.anchors) return next(new Error("No anchor collections."))
  req.collections = anchorsObj.collections;
  return next();
});

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

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./../server/validateRequest')]);

app.post('/login', auth.login);
app.get('/api/v1/listAnchors', anchorsObj.findAnchors);
app.get('/api/v1/getAnchor/:id', anchorsObj.getAnchor);
app.get('/api/v1/findAnchors', anchorsObj.findAnchors);
app.post('/api/v1/addAnchor', anchorsObj.addAnchor);
app.put('/api/v1/editAnchor/:id', anchorsObj.editAnchor);
app.delete('/api/v1/delAnchor/:id', anchorsObj.delAnchor);

app.get('/api/v1/getAnchorType/:id', anchorTypesObj.getRecord);
app.get('/api/v1/findAnchorTypes', anchorTypesObj.findRecords);
app.get('/api/v1/listAnchorTypes', anchorTypesObj.findRecords);
app.post('/api/v1/addAnchorType', anchorTypesObj.addRecord);
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
