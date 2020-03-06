mapboxgl.accessToken = 'pk.eyJ1IjoidG9tYXRvYm9iY2F0IiwiYSI6ImNqejhveTZzNzFubzkzY20ya2ZlbHB0azEifQ.DB5so0XX0ddlaYkEVF0zSg';  // TODO add your API public access token to .env

var temparary_pin = null; // may be change to Array later
var temparay_pop = new mapboxgl.Popup({offset: 40});
var geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
});

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


map.addControl(geocoder);

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

// map.on('mousemove', function (e) {
//     document.getElementById('info').innerHTML =
// // e.point is the x, y coordinates of the mousemove event relative
// // to the top-left corner of the map
//         JSON.stringify(e.point) +
//         '<br />' +
//         // e.lngLat is the longitude, latitude geographical position of the event
//         JSON.stringify(e.lngLat.wrap());
//
// });


map.on('contextmenu', function (e) { //right click
    if (tempPop.size > 0) {
        let longitude = e.lngLat["lng"].toFixed(2);
        let latitude = e.lngLat["lat"].toFixed(2);
        // alert(JSON.stringify(e.lngLat));

        if (!tempPin.has(currDrone)) {
            tempPin.set(currDrone, new mapboxgl.Marker().setLngLat(e.lngLat).setPopup(tempPop.get(currDrone)).addTo(map));
        } else
            tempPin.get(currDrone).setLngLat(e.lngLat);
        tempPop.get(currDrone).setHTML(currDrone.toString() + '<br>Longitude: ' + longitude + '<br>Latitude: ' + latitude +
            '<br><button onclick="clearPin()">clear pin</button> <button onclick="flyTo(' + currDrone + ',' + longitude + ',' + latitude + ',' + 0 + ')">Fly To</button>');
    }
})

geocoder.on('result', function (e) {
    if (tempPop.size > 0) {
        let coordinates = e.result.geometry["coordinates"];
        if (!tempPin.has(currDrone)) {
            tempPin.set(currDrone, new mapboxgl.Marker().setLngLat(coordinates).setPopup(tempPop.get(currDrone)).addTo(map));
        } else {
            tempPin.get(currDrone).setLngLat(coordinates);
        }
        let longitude = coordinates[0];
        let latitude = coordinates[1];
        tempPop.get(currDrone).setHTML('Longitude: ' + longitude + '<br>Latitude: ' + latitude +
            '<br><button onclick="clearPin()">clear pin</button> <button>Fly To</button>');
        // console.log(coordinates);
        // let longitude = e.lngLat["lng"].toFixed(2);
        // let latitude = e.lngLat["lat"].toFixed(2);
    }

});

function clearPin() {
    if (tempPin.size > 0) {
        if (tempPin.has(currDrone)) {
            tempPin.get(currDrone).remove();
            tempPin.delete(currDrone);
        }
    }
}

function flyTo(droneID, long, lat, alt) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    let url = '/flight_data_collect/control/setwaypoint/' + droneID.toString() + '/' + lat.toString() + '/' + long.toString() + '/' + alt.toString() + '/'; // for demo, hard coded drone id and mode type
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
    console.log(url);
    return false;
}

