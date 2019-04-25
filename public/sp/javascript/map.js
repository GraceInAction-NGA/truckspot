polygon1.bindPopup("<h4>Foco principal de truckSPOT.</h4><p>Esto es el enfoque principal para coleccionar datos de camiones.</p>")

polygon2.bindPopup("<h4>Tren-a-camion Intermodal</h4><p>Esto es donde varias compañías de mercancía cargan y descargan de tren a camión y viceversa. También es la área que es más afectada por la contaminación que es creada por la carga y descarga. </p>");
polygon2.setStyle({
    fillColor:'green',
    color:'green'
});

polygon3.bindPopup("<h4>Truck HotSpot</h4><p>Aquí es donde una empresa de carga carga y descarga carga de tren a camión y viceversa. Además del área principal que se ve afectada por la contaminación, esto crea.</p>");
polygon3.setStyle({
    fillColor:'purple',
    color:'purple'
});

circle.bindPopup("<h4>Isla Zug</h4><p> Esto es una isla que está fuertemente industrializada y causa mucha contaminación.</p>");

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);
