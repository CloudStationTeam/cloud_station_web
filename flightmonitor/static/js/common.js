var browserSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/flightmonitor/');
document.querySelector('#telemetry-log').value += ('Successfully connected to server.\n');

var drones = new Map(); // initialize an empty map

browserSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    document.querySelector('#telemetry-log').value += (message + '\n');
    var msg = JSON.parse(data['message']);
    if (!msg.hasOwnProperty("droneid"))
        return;
    let droneid = msg['droneid'];
    if (!drones.has(droneid)) {
        var tempInfo = {
            "longitude": null,
            "latitude": null,
            "yaw": null,
            "pitch": null,
            "roll": null,
            "speed": null, 
            "markerTracker": null,
            "markerPopup": null
        };
        drones.set(droneid, tempInfo);
        updateDroneIdTable(droneid)
        addTab(droneid);
    }
    updateDrones(msg);
    updateDroneLocation(droneid);
    updateDroneTelemetry(droneid);
}

function updateDroneLocation(droneid) {
    let droneProperty = drones.get(droneid);
    if (droneProperty["latitude"]!=null && droneProperty["longitude"]!=null) {
        if (!droneProperty["markerTracker"]) {
            var el = document.createElement('div');
            el.className = 'marker';
            droneProperty.markerPopup = new mapboxgl.Popup({ offset: 25 });
            droneProperty.markerTracker = new mapboxgl.Marker(el)
                .setLngLat([droneProperty["longitude"], droneProperty["latitude"]])
                .setPopup(droneProperty.markerPopup
                    .setHTML('<h3>' + droneid + "</h3><p>" + "Longitude: " + droneProperty["longitude"] + " Latitude: " + droneProperty["latitude"] + "</p>")
                )
                .addTo(map);
        } else {
            droneProperty.markerPopup.setHTML('<h3>' + droneid + "</h3><p>" + "Longitude: " + droneProperty["longitude"] + " Latitude: " + droneProperty["latitude"] + "</p>");
        }
    }
}
        
function updateDroneIdTable(droneid) {
    var dytable = document.getElementById("dyTable");
    var row = dytable.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML = "ID: " + droneid;
    // addTab(droneid);
}

function genearteGeoJson(lng, lat) {
    return {
        "geojson": {
            "type": "Feature",
            "properties": {
                "Name": msg["droneid"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
        }
    }
}

function updateDrones(msg) {
    var droneid = msg["droneid"];
    let droneProperty = drones.get(droneid);
    if (msg["type"] == "location") {
        // console.log(droneMap.get(droneid));
        if (droneProperty["latitude"] == null)
            droneProperty["latitude"] = msg["latitude"];
        else {
            var difference = droneProperty["latitude"] - msg["latitude"];
            if (Math.abs(difference) <= 1)
                droneProperty["latitude"] = msg["latitude"];
            else
                document.querySelector('#telemetry-log').value += "error in latitude.\n";
        }
        if (droneProperty["longitude"] == null)
            droneProperty["longitude"] = msg["longitude"];
        else {
            var difference = droneProperty["longitude"] - msg["longitude"];
            if (Math.abs(difference) < 1)
                droneProperty["longitude"] = msg["longitude"];
            else
                document.querySelector('#telemetry-log').value += "error in longitude.\n";
        }
        droneProperty["altitude"] = msg["altitude"];
    } else if (msg["type"] == "altitude") {
        droneProperty["yaw"] = msg["yaw"];
        droneProperty["roll"] = msg["roll"];
        droneProperty["pitch"] = msg["pitch"];
    }
}


function updateDroneTelemetry(droneid) {
    let droneProperty = drones.get(droneid);
    updateLocations(droneProperty['altitude'], droneProperty['longitude'], droneProperty['latitude'], droneid);
    updateTel(droneProperty['yaw'], droneProperty['roll'], droneProperty['pitch'], droneid)
}
function updateLocations(al, long, lat, droneID){
    var altitudeID = '#altitude' + droneID.toString();
    var longitudeID = '#longitude' + droneID.toString();
    var latitudeID = '#latitude' + droneID.toString();
    // var groundID = '#GroundSpeed' + droneID.toString();
    // var distanceID = '#Distance' + droneID.toString();

    $(altitudeID).text(al);
    $(longitudeID).text(long);
    $(latitudeID).text(lat);
    // console.log(long);

}
function updateTel(yaw, roll, pit, droneID){
    var yawID = '#Yaw'  + droneID.toString();
    var rollID = '#Roll' + droneID.toString();
    var pitchID ='#Pitch'  + droneID.toString();
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


