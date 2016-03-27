var express = require('express'),
  http = require('http'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

var app = express();

var session = require('express-session');

var Anchors = require('./Anchors');
var AnchorsConfig = require('./AnchorsConfig');

var anchorsObj = new Anchors();
anchorsObj.getDB(AnchorsConfig.DBUrl);

app.set('port', AnchorsConfig.ServicePort);

app.use(function(req, res, next) {
  if (!anchorsObj.collections.anchors) return next(new Error("No anchor collections."))
  req.collections = anchorsObj.collections;
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.get('/listAnchors', anchorsObj.findAnchors);
app.get('/getAnchor/:id', anchorsObj.getAnchor);
app.get('/findAnchors', anchorsObj.findAnchors);
app.post('/addAnchor', anchorsObj.addAnchor);
app.put('/editAnchor/:id', anchorsObj.editAnchor);
app.delete('/delAnchor/:id', anchorsObj.delAnchor);

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
