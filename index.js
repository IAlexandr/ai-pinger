var http = require('http');
var api = require('./lib/api');
var config = require('./config');
var l = require('./lib/logger');

var wsServer = require('./lib/wserver');
var wsClient = require('./lib/wclient');

var httpServer = http.Server(api());
//wsServer.listen(httpServer);
wsClient.connect();
httpServer.listen(config.about.apiPort);
l.log('HTTP API listening on port: ' + config.about.apiPort);
