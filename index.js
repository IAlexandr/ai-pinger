var api = require('./lib/api');
var wsServer = require('./lib/wserver');

var app = api.listen();
wsServer.listen(app);