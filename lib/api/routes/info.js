var express = require('express');
var version = require('./../../../package.json').version;
var config = require('./../../../config');
var router = express.Router();

module.exports = router;

router.get('/', function (req, res) {
  res.json({
    appName: config.about.name,
    description: config.about.description,
    version: version
  });
});
