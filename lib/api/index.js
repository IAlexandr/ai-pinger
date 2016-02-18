var express = require('express');
var routes = require('./routes');
var config = require('./../../config');
var l = require('./../logger');

module.exports = {
  listen: function () {
    var app = express();

    app.set('json spaces', 2);
    routes.forEach(function (route) {
      app.use(route.mountPoint, route.router);
    });

    app.listen(config.about.apiPort);
    l.log('HTTP API listening on port: ' + config.about.apiPort);
  }
};
