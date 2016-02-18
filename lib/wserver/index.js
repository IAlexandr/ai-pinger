var ws = require('ws');
var config = require('./../../config');

module.exports = {
  wsServer: null,
  listen: function (app) {
    this.wsServer = new ws.Server(config.about.wsPort);
  }
};
