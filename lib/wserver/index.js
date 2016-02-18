var ws = require('ws');
var config = require('./../../config');

module.exports = {
  wsServer: null,
  listen: function (app) {
    this.wsServer = new ws.Server({ server: app, path: '/server' });
    this.wsServer.on('connection', function connection(ws) {
      ws.send('hello!');
    });
  }
};
