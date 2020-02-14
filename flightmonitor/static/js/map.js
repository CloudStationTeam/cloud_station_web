mapboxgl.accessToken = 'pk.eyJ1IjoidG9tYXRvYm9iY2F0IiwiYSI6ImNqejhveTZzNzFubzkzY20ya2ZlbHB0azEifQ.DB5so0XX0ddlaYkEVF0zSg';  // TODO add your API public access token to .env

var temparary_pin = null; // may be change to Array later
var temparay_pop = new mapboxgl.Popup({offset: 40});

function openNav() {
    document.getElementById("mySidebar").style.width = "275px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

var droneLocation = [-117.842816, 33.646050];
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: droneLocation, // starting position [lng, lat]
    zoom: 13// starting zoom
});

var droneLocationGeoJson = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Point",
        "coordinates": droneLocation
    }
};

function updateDroneLoactionGeoJson(longitude, latitude) {
    droneLocationGeoJson["geometry"]["coordinates"] = [longitude, latitude];

}

map.addControl(new mapboxgl.NavigationControl());
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

map.on('mousemove', function (e) {
    document.getElementById('info').innerHTML =
// e.point is the x, y coordinates of the mousemove event relative
// to the top-left corner of the map
        JSON.stringify(e.point) +
        '<br />' +
        // e.lngLat is the longitude, latitude geographical position of the event
        JSON.stringify(e.lngLat.wrap());

});


map.on('contextmenu', function(e){ //right click
    if (tempPop.size>0) {
        let longitude = e.lngLat["lng"].toFixed(2);
        let latitude = e.lngLat["lat"].toFixed(2);
        // alert(JSON.stringify(e.lngLat));

        if(!tempPin.has(currDrone)){
            tempPin.set(currDrone, new mapboxgl.Marker().setLngLat(e.lngLat).setPopup(tempPop.get(currDrone)).addTo(map));
        }
        else
           tempPin.get(currDrone).setLngLat(e.lngLat);
        tempPop.get(currDrone).setHTML('Longitude: ' + longitude + '<br>Latitude: ' + latitude +
            '<br><button onclick="clearPin()">clear pin</button> <button>Fly To</button>');
    }
})


function clearPin() {
    if (tempPin.size>0) {
        if(tempPin.has(currDrone)) {
            tempPin.get(currDrone).remove();
            tempPin.delete(currDrone);
        }
    }
}