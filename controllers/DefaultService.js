'use strict';

var accuracy = 4;

var locations = [];

function blur(n, digits) {

  if (!digits)
    digits = accuracy;


  if(n>0)
    var roundFunction = Math.floor;
  else
    var roundFunction = Math.ceil;
  

  return roundFunction(n * Math.pow(10, digits)) / Math.pow(10, digits);

}

function blurLocation(location) {
  return {
    latitude: blur(location.latitude),
    longitude: blur(location.longitude),
    timestamp: location.timestamp
  }
}


function toRadians(n) {
    return n * (Math.PI / 180.0);
}

function toDegrees(n) {
    return n * (180.0 / Math.PI);
}

function calculateDerivedPosition(location, radius, bearing) {
    var EarthRadius = 6371000; // m

    var latA = toRadians(location.latitude);
    var lonA = toRadians(location.longitude);
    var angularDistance = radius / EarthRadius;
    var trueCourse = toRadians(bearing);

    var lat = Math.asin(
        Math.sin(latA) * Math.cos(angularDistance) +
        Math.cos(latA) * Math.sin(angularDistance) *
        Math.cos(trueCourse));

    var dlon = Math.atan2(
        Math.sin(trueCourse) * Math.sin(angularDistance) *
        Math.cos(latA),
        Math.cos(angularDistance) - Math.sin(latA) * Math.sin(lat));

    var lon = ((lonA + dlon + Math.PI) % (Math.PI * 2)) - Math.PI;

    lat = toDegrees(lat);
    lon = toDegrees(lon);


    return {
        latitude: lat,
        longitude: lon
    };
}


exports.buildHeatMap = function(args, res, next) {
  console.log("GET /heatmaps");
  console.log(JSON.stringify(args, null, 2));

  var period = {
    from: args["period.from"].value,
    to: args["period.to"].value,
  }

  var area = {
    center: {
      latitude: args["area.center.latitude"].value,
      longitude: args["area.center.longitude"].value
    },
    radius: args["area.radius"].value
  }

  console.log("From: " + period.from);
  console.log("To: " + period.to);
  console.log("Latitude: " + area.center.latitude);
  console.log("Longitude: " + area.center.longitude);
  console.log("Radius: " + area.radius);


  if(locations.length == 0){
     res.end();
     return;
  }
  
  var north = calculateDerivedPosition(area.center, area.radius, 0);
  var east = calculateDerivedPosition(area.center, area.radius, 90);
  var south = calculateDerivedPosition(area.center, area.radius, 180);
  var west = calculateDerivedPosition(area.center, area.radius, 270);

 // filter by area
  var filteredlocations = locations.filter((location)=>{
    return (location.latitude>south.latitude && location.latitude<north.latitude
                    && location.longitude>west.longitude && location.longitude<east.longitude);
  });

  // filter by time
  filteredlocations = filteredlocations.filter((location)=>{
    return ( (new Date(period.from).getTime() < new Date(location.timestamp).getTime()) 
                    && (new Date(location.timestamp).getTime() < new Date(period.to).getTime() ));
  });

  var hmm = new Map(); // HeatMapMatrix[latitude][longitude]

  filteredlocations.map(blurLocation).forEach((location) => {
    if (hmm.has(location.latitude)) {
      if (hmm.get(location.latitude).has(location.longitude)) {
        hmm.get(location.latitude).set(location.longitude,
          hmm.get(location.latitude).get(location.longitude) + 1);
      } else {
        hmm.get(location.latitude).set(location.longitude,1);
      }
    } else {
      hmm.set(location.latitude,new Map([[location.longitude,1]]));
    }
  });

  var heatmap = [];
  
  hmm.forEach((latitudeMap, latitude) => {
    latitudeMap.forEach((frequency, longitude) => {
      heatmap.push({
        "frequency": frequency,
        "latitude": latitude,
        "longitude": longitude
      });
    });
  });

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(heatmap));

}

exports.registerLocation = function(args, res, next) {
  /**
   * parameters expected in the args:
   * body (Body)
   **/
  // no response value expected for this operation
  console.log("POST /locations");
  //console.log(JSON.stringify(args, null, 2));

  var location = {
    latitude: args.body.value.latitude,
    longitude: args.body.value.longitude,
    timestamp: args.body.value.timestamp
  };

  locations.push(location);

  console.log("Latitude: " + location.latitude);
  console.log("Longitude: " + location.longitude);
  console.log("Timestamp: " + location.timestamp);

  res.end();
}


exports.deleteLocations = function(args, res, next) {
  locations = [];
  res.end();
}
