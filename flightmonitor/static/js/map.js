mapboxgl.accessToken = document.getElementById("mapboxId").value;  // TODO add your API public access token to .env



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


// fly to code start
// thanks chatgpt
// chatgpt prompt:
// javascript mapbox code to create popup when user clicks on map, then enter a number into the popup, then call a function with entered number and the lat lon location  as argument; add cancel button to popup; make pointer an arrow on mapbox
var popup;

map.on('click', function(e) {
  // Create a popup with a form to enter a number
  popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(e.lngLat)
    .setHTML('<form id="numberForm"><label for="number">Altitude:</label><br><input type="number" id="number" name="number"><br><br><button type="button" onclick="submitNumber(' + e.lngLat.lng + ',' + e.lngLat.lat + ')">Fly to</button> <button type="button" onclick="cancelPopup()">Cancel</button></form>')
    .addTo(map);
});

function submitNumber(lon, lat) {
  // Get the entered number from the form
  var enteredNumber = parseInt(document.getElementById('number').value);

  // Call your function with the entered number and coordinates as arguments
  yourFunction(enteredNumber, lon, lat);

  // Close the popup
  popup.remove();
}

function cancelPopup() {
  // Close the popup without submitting
  popup.remove();
}

// Replace this function with your actual function
function yourFunction(number, lon, lat) {
  // console.log('Entered number:', number);
  // console.log('Coordinates:', { longitude: lon, latitude: lat });
  // Do something with the entered number and coordinates
  FlyVehicleTo(lat,lon,number);
}
// fly to code end


geocoder.on('result', function (e) {
    if (tempPop.size > 0) {
        let coordinates = e.result.geometry["coordinates"];
        if (!tempPin.has(currSelectedDroneId)) {
            tempPin.set(currSelectedDroneId, new mapboxgl.Marker().setLngLat(coordinates).setPopup(tempPop.get(currSelectedDroneId)).addTo(map));
        } else {
            tempPin.get(currSelectedDroneId).setLngLat(coordinates);
        }
        let longitude = coordinates[0];
        let latitude = coordinates[1];
        tempPop.get(currSelectedDroneId).setHTML('Longitude: ' + longitude + '<br>Latitude: ' + latitude +
            '<br><button onclick="clearPin()">clear pin</button> <button>Fly To</button>');
    }

});

function clearPin() {
    if (tempPin.size > 0) {
        if (tempPin.has(currSelectedDroneId)) {
            tempPin.get(currSelectedDroneId).remove();
            tempPin.delete(currSelectedDroneId);
        }
    }
}

// CS 2.0
function flyTo_old(droneID, long, lat, alt) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    let url = '/flight_data_collect/control/flyto/' + droneID.toString() + '/' + lat.toString() + '/' + long.toString() + '/' + alt.toString() + '/';
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
    console.log(xmlHttp);

    return false;
}

// CS 4.0
function flyTo(droneID, long, lat, alt) {
    alert("flyTo callsed for droneID, long, lat, alt = ", droneID, long, lat, alt);
    return false; // why return false???
}
