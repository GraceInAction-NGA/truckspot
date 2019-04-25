polygon1.bindPopup("<h4>Main Focus of TruckSpot</h4><p>This is where we are mainly focusing to collect truck data.</p>")

polygon2.bindPopup("<h4>Train-Truck Intermodal</h4><p>This is where several freight companies load and unload cargo from train to truck and vice versa. As well as the main area that is affected by the pollution this creates.</p>");
polygon2.setStyle({
    fillColor:'green',
    color:'green'
});

polygon3.bindPopup("<h4>Truck HotSpot</h4><p>This is where a freight company loand and unload cargo from train to truck and viceversa. As well as the main area that is affected by the pollution this creates.</p>");
polygon3.setStyle({
    fillColor:'purple',
    color:'purple'
});

circle.bindPopup("<h4>Zug Island</h4><p> This is a heavily industrialized island that causes a lot pollution.</p>");

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);
