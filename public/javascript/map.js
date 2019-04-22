let mymap = L.map('mapid').setView([42.30791, -83.13578], 12);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(mymap);

let polygon1 = L.polygon([
    [42.276321, -83.155054],
    [42.329253, -83.195649],
    [42.331381, -83.095079],
    [42.316513, -83.077132],
    [42.273419, -83.134356]
]).addTo(mymap);

let polygon2 = L.polygon([
    [42.31661, -83.13447],
    [42.33041, -83.14445],
    [42.33088, -83.11998],
    [42.30943, -83.10222],
]).addTo(mymap);

let polygon3 = L.polygon([
    [42.29858, -83.12256],
    [42.30294, -83.12671],
    [42.30643, -83.11593],
    [42.30243, -83.11267],
]).addTo(mymap);

let circle = L.circle([42.28315, -83.11226], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 1050
}).addTo(mymap);

let redIcon = L.icon({
    iconUrl: '../images/RedIcon.png',
    iconSize:     [32, 45],
    iconAnchor:   [22, 94],})
let redIconMarker = L.marker([42.305597, -83.130343], {icon: redIcon}).addTo(mymap);
redIconMarker.bindPopup("Grace In Action");

let greenIcon = L.icon({
    iconUrl: '../images/Greenicon.png',
    iconSize:     [32, 45],
    iconAnchor:   [22, 94],})
let greenMarker = L.marker([42.326561, -83.063704], {icon: greenIcon}).addTo(mymap);
greenMarker.bindPopup("Detroit Hispanic Development Corporation");

let blueIcon = L.icon({
    iconUrl: '../images/BlueIcon.png',
    iconSize:     [32, 45],
    iconAnchor:   [22, 94],})
let marker = L.marker([42.290376, -83.128845], {icon: blueIcon}).addTo(mymap);
marker.bindPopup("Southwest Detroit Community Benefits Coalition");
let popup = L.popup();
