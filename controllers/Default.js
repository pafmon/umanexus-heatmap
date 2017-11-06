'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.buildHeatMap = function buildHeatMap (req, res, next) {
  Default.buildHeatMap(req.swagger.params, res, next);
};

module.exports.registerPosition = function registerPosition (req, res, next) {
  Default.registerPosition(req.swagger.params, res, next);
};
