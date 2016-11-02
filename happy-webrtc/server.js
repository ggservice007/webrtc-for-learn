var fs = require('fs');
var express = require('express');
var url = require('url');
var https = require('https');
var app = express();

var log = require('./log').log;
var requestHandlers = require('./serverXHRSignalingChannel');

function getInfo(req, res) {
  var urldata = url.parse(req.url, true);
  var info = {
    "res": res,
    "query": urldata.query,
    "postData": ""
  };

  return info;
}

app.get('/', function(req, res) {
  res.send('Hello WebRTC');
});

app.post('/get', function(req, res) {
  var info = getInfo(req, res);
  var bodyStr = '';
  req.setEncoding("utf8");
  req.on("data", function(chunk) {
    bodyStr += chunk.toString();
    info.postData = bodyStr;
  });

  req.on("end", function() {
    requestHandlers.get(info);
  });
});

app.post('/send', function(req, res) {
  var info = getInfo(req, res);
  var bodyStr = '';
  req.setEncoding("utf8");
  req.on("data", function(chunk) {
    bodyStr += chunk.toString();
    info.postData = bodyStr;
  });

  req.on("end", function() {
    requestHandlers.send(info);
  });
});

app.post('/connect', function(req, res) {
  var info = getInfo(req, res);
  requestHandlers.connect(info);
});

app.use(express.static('public'));

https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
  }, app).listen(5001, () => {
      console.log('Server app listening at port 5001');
  });
