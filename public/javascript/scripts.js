var mymap = L.map('mapid').setView([42.300292, -83.137200], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);

var polygon = L.polygon([
    [42.276321, -83.155054],
    [42.329253, -83.195649],
    [42.331381, -83.095079],
    [42.316513, -83.077132],
    [42.273419, -83.134356]
]).addTo(mymap);

var circle = L.circle([42.325853, -83.134617], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);
circle.bindPopup("CSX Intermodal");

var redIcon = L.icon({
    iconUrl: 'images/RedIcon.png',
    iconSize:     [32, 45], 
    iconAnchor:   [22, 94],})
var redIconMarker = L.marker([42.305597, -83.130343], {icon: redIcon}).addTo(mymap);
redIconMarker.bindPopup("Grace In Action");

var greenIcon = L.icon({
    iconUrl: 'images/Greenicon.png',
    iconSize:     [32, 45], 
    iconAnchor:   [22, 94],})
var greenMarker = L.marker([42.326561, -83.063704], {icon: greenIcon}).addTo(mymap);
greenMarker.bindPopup("Detroit Hispanic Development Corporation");

var blueIcon = L.icon({
    iconUrl: 'images/BlueIcon.png',
    iconSize:     [32, 45], 
    iconAnchor:   [22, 94],})
var marker = L.marker([42.290376, -83.128845], {icon: blueIcon}).addTo(mymap);
marker.bindPopup("Southwest Detroit Community Benefits Coalition");

