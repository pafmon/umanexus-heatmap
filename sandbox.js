"use strict";

function blur(n, digits, roundFunction) {
    /*
    var m1 = n * Math.pow(10,digits);
    console.log(m1);
    var m2 = roundFunction(m1);
    console.log(m2);
    var m3 = m2 / Math.pow(10,digits);
    console.log(m3);
    */
    var m = roundFunction(n * Math.pow(10, digits)) / Math.pow(10, digits);

    return m;
}
/*
var n_before = -12.234567890;

var n_after = blur(n_before,7,Math.floor);

console.log("n = "+n_before);
console.log("n = "+n_after);

var lat =37.39253;
var lon = -5.99407;

var hmm = [];

hmm[lat] = [];

hmm[lat][lon] = 1;

var hmm = new Map();
hmm.set("pepe",12);



hmm.forEach(function(value, key) {
  console.log(key + ' = ' + value);
});

var d1 = new Date('2017-11-02T10:00:00.000Z');
var d2 = new Date('2017-11-02T11:00:00.000Z');
var d3 = new Date('2017-11-02T12:00:00.000Z');
var d4 = new Date('2017-11-02T13:00:00.000Z');

console.log(d1.getTime() < d2.getTime() );

console.log(new Date('2017-11-02T13:00:00.000Z').getTime() < new Date('2017-11-02T14:00:00.000Z').getTime());


*/

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


//37.39253,-5.99407

var radius = 1000;

var origin = {
    latitude: 37.39253,
    longitude: -5.99407
};
/*
var north = calculateDerivedPosition(origin, radius, 0);
var east = calculateDerivedPosition(origin, radius, 90);
var south = calculateDerivedPosition(origin, radius, 180);
var west = calculateDerivedPosition(origin, radius, 270);
*/
function p(s,p){
    console.log(s+":"+p.latitude+","+p.longitude);    
}


p("north",calculateDerivedPosition(origin, radius, 0));
p("east",calculateDerivedPosition(origin, radius, 90));
p("south",calculateDerivedPosition(origin, radius, 180));
p("west",calculateDerivedPosition(origin, radius, 270));


