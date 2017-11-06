'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.buildHeatMap = function buildHeatMap (req, res, next) {
  Default.buildHeatMap(req.swagger.params, res, next);
};

module.exports.registerLocation = function registerLocation (req, res, next) {
  Default.registerLocation(req.swagger.params, res, next);
};
