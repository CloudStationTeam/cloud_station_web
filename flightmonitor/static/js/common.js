var SETMODE_CONST = '<select id = "mode">' +
    '<option value="MANUAL">MANUAL</option>' +
    '<option value="ACRO">ACRO</option>' +
    '<option value="LEARNING">LEARNING</option>' +
    '<option value="STEERING">STEERING</option>' +
    '<option value="HOLD">HOLD</option>' +
    '<option value="LOITER">LOITER</option>' +
    '<option value="FOLLOW">FOLLOW</option>' +
    '<option value="SIMPLE">SIMPLE</option>' +
    '<option value="AUTO">AUTO</option>' +
    '<option value="RTL">RTL</option>' +
    '<option value="SMART_RTL">SMART_RTL</option>' +
    '<option value="GUIDED">GUIDED</option>' +
    '<option value="INITIALISING">INITIALISING</option>' +
    '</select>' +
    '<input type="submit" value="SET MODE">' +
    '</form>';

var browserSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/flightmonitor/');
document.querySelector('#telemetry-log').value += ('Successfully connected to server.\n');


var tempPin = new Map();
var tempPop = new Map();
var currDrone;
var droneMap = new Map(); // initialize an empty map

browserSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    document.querySelector('#telemetry-log').value += (message + '\n');
    var temp = JSON.parse(data['message']);
    console.log(temp);
    var droneID = temp["droneid"];
    currDrone = droneID;
    let drone;
    if (!droneMap.has(droneID)) {
        drone = new Drone(droneID);

        tempPop.set(droneID, new mapboxgl.Popup({offset: 40}));

        droneMap.set(droneID, drone); //add new drone to the map
        storeTodroneMap(temp);
        if (temp["mavpackettype"] == "GLOBAL_POSITION_INT") {//create html element for the new marker [only initialize if the first data has location]
            var el = document.createElement('div');
            el.className = 'marker';
            drone.createPopup(new mapboxgl.Popup({offset: 25}));
            drone.createMarker(new mapboxgl.Marker(el)
                .setLngLat(drone.getLocation())
                .setPopup(drone.getPopup()
                    .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat() + "</p>" + '<form action="javascript:set_mode(' + droneID + ',mode.value)">' + SETMODE_CONST))
                .addTo(map));
        }
        var dytable = document.getElementById("dyTable");
        var row = dytable.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = "<div id = 'dyTableID" + droneID.toString()+ "'>ID: " + droneID +"</div>";
        addTab(droneID); // add a new tab
    } else {
        storeTodroneMap(temp);
        drone = droneMap.get(droneID);
        if (drone.hasMarker()) { // update on the previous marker
            drone.getMarker().setLngLat(drone.getLocation());
            drone.getPopup()
                .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat() + '<form action="javascript:set_mode(' + droneID + ',mode.value)">' + SETMODE_CONST)
        } else {
            if (drone.getLocation() != null) { // make a new marker if the location has real data
                var el = document.createElement('div');
                el.className = 'marker';
                drone.createPopup(new mapboxgl.Popup({offset: 25}));
                drone.createMarker(new mapboxgl.Marker(el)
                    .setLngLat(drone.getLocation())
                    .setPopup(drone.getPopup()
                        .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat() + "</p>" + '<form action="javascript:set_mode(' + droneID + ',mode.value)">' + SETMODE_CONST)
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
    if (tempPack["mavpackettype"] == "GLOBAL_POSITION_INT") {
        storeStruct.updateLocation(tempPack["lon"], tempPack["lat"]);
        storeStruct.updateAlt(tempPack["alt"]);
    }
    else if (tempPack["mavpackettype"] == "ATTITUDE") {
        storeStruct.updateYaw(tempPack["yaw"]);
        storeStruct.updateRoll(tempPack["roll"]);
        storeStruct.updatePitch(tempPack["pitch"]);
    }
    else if (tempPack["mavpackettype"] == "HEARTBEAT"){
        storeStruct.updateType(tempPack["type"]);
        storeStruct.updateFlyMode(tempPack["flightmode"]);
    }
    else if(tempPack["mavpackettype"] == "GPS_RAW_INT"){
        storeStruct.updateFixType(tempPack["fix_type"]);
        storeStruct.updateSatellitesVisible(tempPack["satellites_visible"]);
    }
    else if(tempPack["mavpackettype"] == "POWER_STATUS"){
        storeStruct.updateVcc(tempPack["Vcc"]);
        storeStruct.updateVservo(tempPack["Vservo"]);
    }
}


function updateInfo(droneID) {
    let drone = droneMap.get(droneID);
    updateLocations(drone.getAltitude(), drone.getLong(), drone.getLat(), droneID);
    updateTel(drone.getYaw(), drone.getRoll(), drone.getPitch(), droneID);
    updateHeartBeat(drone.getType(), drone.getFlyMode(), droneID);
    updateGPS(drone.getFixType(), drone.getSatellitesVisible(), droneID);
    updatePower(drone.getVcc(), drone.getVservo(), droneID);

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

function updateHeartBeat(type, flyMode, droneID){
    let typeID = '#Type' + droneID.toString();
    let flyModeID = '#FlyModeID' + droneID.toString();
    $(typeID).text(type);
    $(flyModeID).text(flyMode);
}

function updateGPS(fixType, sat, droneID){
    let fixTypeID = '#FixTypeID' + droneID.toString();
    let satellitesID = '#SatellitesID' + droneID.toString();
    $(fixTypeID).text(fixType);
    $(satellitesID).text(sat);
}

function updatePower(vcc, vservo, droneID){
    let vccID = '#VccID' + droneID.toString();
    let vservoID = '#VservoID' + droneID.toString();
    $(vccID).text(vcc);
    $(vservoID).text(vservo);
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
    var message = document.getElementById("disVID").value;
    let removeId = parseInt(message);
    if (droneMap.has(removeId)) {
        droneMap.get(removeId).getMarker().remove();
        droneMap.delete(removeId);
        // remove tablist on the right and set another drone info if delete the current displayed drone
        var titleID = document.getElementById('title'+message);
        var contentID = document.getElementById('content'+message);
        $(titleID).parents('li').remove();
        $(contentID).remove();
        setDefaultTab(removeId);
        // remove the connected ID list left bottom
        let dyID = document.getElementById('dyTableID'+message);
        $(dyID).remove();
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
        };
        let url = '/flight_data_collect/disconnect/' + message + '/';
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    } else {
        alert("The drone " + message + " has not been connected!")
    }
    return false;


}

function set_mode(droneID, mode) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    let url = '/flight_data_collect/control/setmode/' + droneID.toString() + '/' + mode + '/'; // for demo, hard coded drone id and mode type
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
    return false;
}


function set_mode_test(id, value) {
    alert(id + value);
    return false;
}