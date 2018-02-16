var RouteBoxer = require('../lib/geojson.lib.routeboxer');
var exec       = require('child_process').exec;
var fs         = require('fs');

var template   = fs.readFileSync(__dirname + '/GeoJSONViewer.tmpl').toString();

var route1 = require('./route.json');
var route2 = {
  "type": "LineString",
  "coordinates": [
    [-101.65109000000001,41.12041000000001],
    [-101.65109000000001,41.120500000000004],
    [-94.71475000000001,41.496790000000004],
    [-94.69688000000001,41.49682000000001]
  ]};
var route3 = {
  "type": "LineString",
  "coordinates": [
    [-3.62, 1.96],
    [2.84, 2.65],
    [1.40, -2.65],
    [-2.84, -3.36],
    [-4.09, 1.09]
  ]};


var path  = route2;

var range = 20;
var boxer = new RouteBoxer();
var boxes = boxer.box(path, range);

boxes.unshift(boxer.getIntersectingCells());
boxes.unshift(boxer.getGrid());
boxes.push(path);
boxes.push(boxer.getIntersectionPoints());

generateHtml(boxes);

function generateHtml (geojson) {
  var pageCode = template.replace('###LINES###', JSON.stringify(geojson));

  fs.writeFileSync(__dirname + '/GeoJSONViewer.html', pageCode);

  openBrowser();
}
function openBrowser () {
  var opener;

  switch (process.platform) {
    case 'linux':
      opener = 'xdg-open';
      break;
    case 'darwin':
      opener = 'open';
      break;
    case 'win32':
      opener = 'start ""';
      break;
  }

  return exec(opener + ' "file://' + __dirname + '/GeoJSONViewer.html"');
}
