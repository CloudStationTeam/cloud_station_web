var browserSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/flightmonitor/');
document.querySelector('#telemetry-log').value += ('Successfully connected to server.\n');

var droneMap = new Map(); // initialize an empty map

browserSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    document.querySelector('#telemetry-log').value += (message + '\n');
    var temp = JSON.parse(data['message']);
    var droneID = temp["droneid"];
    let drone;
    if (!droneMap.has(droneID)) {
        drone = new Drone(droneID);
        droneMap.set(droneID, drone); //add new drone to the map
        storeTodroneMap(temp);
        if (temp["type"] == "location") {//create html element for the new marker [only initialize if the first data has location]
            var el = document.createElement('div');
            el.className = 'marker';
            drone.createPopup(new mapboxgl.Popup({offset: 25}));
            drone.createMarker(new mapboxgl.Marker(el)
                .setLngLat(drone.getLocation())
                .setPopup(drone.getPopup()
                    .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat() + "</p>")
                )
                .addTo(map));
        }
        var dytable = document.getElementById("dyTable");
        var row = dytable.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = "ID: " + droneID;
        addTab(droneID); // add a new tab
    } else {
        storeTodroneMap(temp);
        drone = droneMap.get(droneID);
        if (drone.hasMarker()) { // update on the previous marker
            drone.getMarker().setLngLat(drone.getLocation()).setPopup(drone.getPopup()
                .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat() + "</p>")
            );
        } else {
            if (drone.getLocation() != null) { // make a new marker if the location has real data
                var el = document.createElement('div');
                el.className = 'marker';
                drone.createPopup(new mapboxgl.Popup({offset: 25}));
                drone.createMarker(new mapboxgl.Marker(el)
                    .setLngLat(drone.getLocation())
                    .setPopup(drone.getPopup()
                        .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat() + "</p>")
                    )
                    .addTo(map));
            }
        }
    }


    if (drone.getLocation() != null) {
        updateDroneLoactionGeoJson(drone.getLong(), drone.getLat());
    }
    updateInfo(droneID);
};


function storeTodroneMap(tempPack) {
    let droneID = tempPack["droneid"];
    let storeStruct = droneMap.get(droneID);
    if (tempPack["type"] == "location") {
        storeStruct.updateLocation(tempPack["longitude"], tempPack["latitude"]);
        storeStruct.updateAlt(tempPack["altitude"]);
    } else if (tempPack["type"] == "altitude") {
        storeStruct.updateYaw(tempPack["yaw"]);
        storeStruct.updateRoll(tempPack["roll"]);
        storeStruct.updatePitch(tempPack["pitch"]);
    }
}


function updateInfo(droneID) {
    let drone = droneMap.get(droneID);
    updateLocations(drone.getAltitude(), drone.getLong(), drone.getLat(), droneID);
    updateTel(drone.getYaw(), drone.getRoll(), drone.getPitch(), droneID)


}

function updateLocations(al, long, lat, droneID) {
    let altitudeID = '#altitude' + droneID.toString();
    let longitudeID = '#longitude' + droneID.toString();
    let latitudeID = '#latitude' + droneID.toString();

    $(altitudeID).text(al);
    $(longitudeID).text(long);
    $(latitudeID).text(lat);

}

function updateTel(yaw, roll, pit, droneID) {
    let yawID = '#Yaw' + droneID.toString();
    let rollID = '#Roll' + droneID.toString();
    let pitchID = '#Pitch' + droneID.toString();
    $(yawID).text(yaw);
    $(rollID).text(roll);
    $(pitchID).text(pit);
}

browserSocket.onclose = function (e) {
    document.querySelector('#telemetry-log').value += ('Error: connection to server has been disconnected\n');
};


document.querySelector('#vehicleID').focus();
document.querySelector('#vehicleID').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#connectbtn').click();
    }
};

function connectVehicle() {
    var message = document.getElementById("vehicleID").value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    var url = '/flight_data_collect/connect/' + message + '/';
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function disconnectVehicle() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    var url = '/flight_data_collect/disconnect/';
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}


