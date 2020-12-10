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
var AVAILABLE_TELEMETRY = {}

var browserSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/flightmonitor/');
document.querySelector('#telemetry-log').value += ('Successfully connected to server.\n');

var tempPin = new Map();
var tempPop = new Map();
var currSelectedDroneId;
var currDisplayedExtraData = {};
var droneMap = new Map(); // initialize an empty map
var disconnectedDrones = new Set(); //droneIds are text in this set

getAvailableTelemetry();

browserSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    document.querySelector('#telemetry-log').value += (data['message'] + '\n');
    var msg = JSON.parse(data['message']);

    // If logging message
    if ('log_output' in msg) {
        console.log(msg['log_output'])
        return
    }

    if(!('droneid' in msg) || disconnectedDrones.has(parseInt(msg['droneid']))) {
        return;
    }
    var droneId = msg["droneid"];
    if(currSelectedDroneId==null) {
        currSelectedDroneId = droneId;
    }
    
    let drone;
    if (!droneMap.has(droneId)) {
        if(droneMap.size>0 && currSelectedDroneId!=droneId) {
            document.getElementById("title" + currSelectedDroneId.toString()).style.background = "rgba(246, 91, 2, 0.5)";
            currSelectedDroneId = droneId;
        }
        drone = new Drone(droneId);
        tempPop.set(droneId, new mapboxgl.Popup({offset: 40}));
        droneMap.set(droneId, drone); //add new drone to the map
        storeTodroneMap(msg);
        if (msg["mavpackettype"] == "GLOBAL_POSITION_INT") {//create html element for the new marker [only initialize if the first data has location]
            var el = document.createElement('div');
            el.className = 'marker';
            drone.createPopup(new mapboxgl.Popup({offset: 25}));
            drone.createMarker(new mapboxgl.Marker(el)
                .setLngLat(drone.getLocation())
                .setPopup(drone.getPopup()
                    .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat() 
                    + "</p>" + '<form action="javascript:set_mode(' + droneId + ',mode.value)">' + SETMODE_CONST
                    + "</p>" + '<input type="button" value="arm" onclick="javascript:set_arm('+droneId+')">'
                    + '<input type="button" value="disarm" onclick="javascript:set_arm('+droneId+', true)">'))
                .addTo(map));
            map.flyTo({center: drone.getLocation()});
        }
        var dytable = document.getElementById("dyTable");
        var row = dytable.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = "<div id = 'dyTableID" + droneId+ "'>ID: " + droneId +"</div>";
        addTab(droneId); // add a new tab
        // Add extra data fields to new drone & new tab
	    drone.updateOtherFieldsKeys(currDisplayedExtraData)
	    updateExtraData(currDisplayedExtraData);
    } else {
        storeTodroneMap(msg);
        drone = droneMap.get(droneId);
        if (drone.hasMarker()) { // update on the previous marker
            drone.getMarker().setLngLat(drone.getLocation());
        } else {
            if (drone.getLocation() != null) { // make a new marker if the location has real data
                var el = document.createElement('div');
                el.className = 'marker';
                drone.createPopup(new mapboxgl.Popup({offset: 25}));
                drone.createMarker(new mapboxgl.Marker(el)
                    .setLngLat(drone.getLocation())
                    .setPopup(drone.getPopup()
                        .setHTML('<h3>' + drone.getID() + "</h3><p>" + "Longitude: " + drone.getLong() + " Latitude: " + drone.getLat()
                        + "</p>" + '<form action="javascript:set_mode(' + droneId + ',mode.value)">' + SETMODE_CONST
                        + "</p>" + '<input type="button" value="arm" onclick="javascript:set_arm('+droneId+')">'
                        + '<input type="button" value="disarm" onclick="javascript:set_arm('+droneId+', true)">')
                    )
                    .addTo(map));
                map.flyTo({center: drone.getLocation()});
            }
        }
    }


    if (drone.getLocation() != null) {
        updateDroneLoactionGeoJson(drone.getLong(), drone.getLat());
    }
    updateInfo(droneId);
};


function storeTodroneMap(tempPack) {
    let droneID = tempPack["droneid"];
    let storeStruct = droneMap.get(droneID);
    if (tempPack["mavpackettype"] == "GLOBAL_POSITION_INT") {
        storeStruct.updateLocation(tempPack["lon"].toFixed(5), tempPack["lat"].toFixed(5));
        storeStruct.updateAlt(tempPack["alt"].toFixed(2));
    }
    else if (tempPack["mavpackettype"] == "ATTITUDE") {
        storeStruct.updateYaw(tempPack["yaw"].toFixed(2));
        storeStruct.updateRoll(tempPack["roll"].toFixed(2));
        storeStruct.updatePitch(tempPack["pitch"].toFixed(2));
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
    storeStruct.updateOtherFieldsData(tempPack);
}


function updateInfo(droneID) {
    let drone = droneMap.get(droneID);
    updateLocations(drone.getAltitude(), drone.getLong(), drone.getLat(), droneID);
    updateTel(drone.getYaw(), drone.getRoll(), drone.getPitch(), droneID);
    updateHeartBeat(drone.getType(), drone.getFlyMode(), droneID);
    updateGPS(drone.getFixType(), drone.getSatellitesVisible(), droneID);
    updatePower(drone.getVcc(), drone.getVservo(), droneID);
    updateOther(drone.getOtherFields(), droneID)
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

function updateOther(data, droneID){
    for (const [category, values] of Object.entries(data)) {
        for (const [fieldname, value] of Object.entries(values)) {
            cellId = '#' + getExtraDataCellName(fieldname, category, droneID);
            $(cellId).text(value)
        }
    }
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

/* HTTP REQUESTS TO BACKEND */

function getAvailableTelemetry() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += ('Retrieved available telemetry options:' + xmlHttp.responseText + '\n');
            AVAILABLE_TELEMETRY = JSON.parse(xmlHttp.responseText);
    };
    var url = '/flight_data_collect/get-available-fields/';
    xmlHttp.open("GET", url, true); // asynchronous
    xmlHttp.send(null);
}

// param fields should be a JSON object representing the fields requested
function updateTelemetryFields(fields) {
    var xmlHttp = new XMLHttpRequest();
    var url = '/flight_data_collect/update-fields/';
    const csrftoken = getCookie('csrftoken')
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    xmlHttp.open("POST", url, true); // asynchronous
    xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(fields);
}

function connectVehicle() {
    var message = document.getElementById("vehicleID").value;
    var xmlHttp = new XMLHttpRequest();
    let droneId = parseInt(message);
    if(disconnectedDrones.has(droneId)) {
        disconnectedDrones.delete(droneId);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    var url = '/flight_data_collect/connect/' + message + '/';
    xmlHttp.open("GET", url, true); // asynchronous
    xmlHttp.send(null);
}

function disconnectVehicle() {
    var message = document.getElementById("disVID").value;
    let droneId = parseInt(message);
    if (droneMap.has(droneId)) {
        disconnectedDrones.add(droneId);

        if(droneMap.get(droneId).hasMarker())
            droneMap.get(droneId).getMarker().remove();
        droneMap.delete(droneId);
        // remove tablist on the right and set another drone info if delete the current displayed drone
        var titleID = document.getElementById('title'+message);
        var contentID = document.getElementById('content'+message);
        $(titleID).parents('li').remove();
        $(contentID).remove();
        setDefaultTab(droneId);
        // remove the connected ID list left bottom
        let dyID = document.getElementById('dyTableID'+message);
        $(dyID).remove();
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
        };
        let url = '/flight_data_collect/disconnect/' + message + '/';
        xmlHttp.open("GET", url, true); // asynchronize
        xmlHttp.send(null);
    } else {
        alert("Vehicle " + message + " does not exist!");
    }
    return false;
}

function set_mode(droneId, mode) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    let url = '/flight_data_collect/control/setmode/' + droneId.toString() + '/' + mode + '/';
    xmlHttp.open("GET", url, true); // asynchronous 
    xmlHttp.send(null);
    return false;
}

function set_arm(droneId, is_disarm=false) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    let url;
    if (is_disarm==true)
        url = '/flight_data_collect/control/arm/' + droneId.toString() + '/'
    else
        url = '/flight_data_collect/control/disarm/' + droneId.toString() + '/'
    xmlHttp.open("GET", url, true); // asynchronous 
    xmlHttp.send(null);
    return false;
}


function set_mode_test(id, value) {
    alert(id + value);
    return false;
}

/* CSRF COOKIE RETRIEVAL (FOR POST REQUESTS) */

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* TELEMETRY DISPLAY FORM */

// Get the modal
var modal = document.getElementById("myModal");

function openForm(){
	modal.style.display="block";
	document.getElementById('formBody').innerHTML = createForm(AVAILABLE_TELEMETRY);
}

function closeForm(){
	modal.style.display="none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Create JSON object using form data and send to Back-end
function submitTelemetry(){
	var dict = {};
	var categories = document.getElementsByClassName("categoryName");
	for (var i = 0; i < categories.length; ++i){
		var category = categories[i].innerHTML;
		var categoryCheckName = category+"Check";
		var fields =  getCheckedFromCategory(categoryCheckName);
		if(fields.length > 0){
			dict[category] = getCheckedFromCategory(categoryCheckName);	
		}	
	}
	currDisplayedExtraData = dict
	for (let [droneId, drone] of droneMap) {
	    drone.updateOtherFieldsKeys(dict)
	}
	updateExtraData(dict);
	updateTelemetryFields(JSON.stringify(dict));
	closeForm();
}

// Get value of checked inputs given Category check name 
function getCheckedFromCategory(categoryCheckName){
	var checkboxes = document.getElementsByName(categoryCheckName);
	var listOfChecked = [];

	for (var i=0; i < checkboxes.length; i++){
		if(checkboxes[i].checked){
			listOfChecked.push(checkboxes[i].value);
		}
	}	
	return listOfChecked;
}

function createForm(telemetryDict){
	var html = '<div class = "row">';
	for(let category in telemetryDict){
		html += '<div class="col">';
		html += '<h3 class="categoryName">'+category+'</h3>';
		html += '<ul>';
		telemetryDict[category].forEach(function (field, index){

			html += '<li><label for="'+field+'Check">'+field+'</label>';
			html += '<input type="checkBox" name="'+category+'Check" value="'+field+'"></li>';
		});
		html += '</ul>';
		html += '</div>';
	}
	html += '<div class="col">';
	html += '<p id="testText">Ready for Test</p>';
	html += '</div>';
	html += '</div>';
	html += '<button id="submitTelemetryBtn" onclick="submitTelemetry()">Submit</button>';

	return html;
}
