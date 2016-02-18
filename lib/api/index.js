var express = require('express');
var routes = require('./routes');
var l = require('./../logger');

module.exports = function () {
  var app = express();

  app.set('json spaces', 2);
  routes.forEach(function (route) {
    app.use(route.mountPoint, route.router);
  });
  return app;
};
