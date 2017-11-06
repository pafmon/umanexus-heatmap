'use strict';

exports.buildHeatMap = function(args, res, next) {
  /**
   * parameters expected in the args:
  * period.from (Date)
  * period.to (Date)
  * area.center.latitude (BigDecimal)
  * area.center.longitude (BigDecimal)
  * area.radius (BigDecimal)
  **/
    var examples = {};
  examples['application/json'] = [ {
  "intensity" : "",
  "longitud" : -5.99407,
  "latitude" : 37.39253
} ];
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.registerLocation = function(args, res, next) {
  /**
   * parameters expected in the args:
  * body (Body)
  **/
  // no response value expected for this operation
  res.end();
}

