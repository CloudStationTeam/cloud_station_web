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
    if (!droneMap.has(temp["droneid"])) {
        var tempInfo = {
            "longitude":"NULL",
            "latitude":"NULL",
            "yaw":"NULL",
            "pitch":"NULL",
            "roll":"NULL",
            "speed":"NULL",
            "geojson":{
            "type": "Feature",
                "properties": {},
              "geometry": {
                "type": "Point",
                "coordinates": ["NULL","NULL"]
            }
            }
        };
        droneMap.set(temp["droneid"],tempInfo);
        }
    storeTodroneMap(temp);

    try{
        updateDroneLoactionGeoJson(temp["longitude"], temp["latitude"]);
    }
    catch(e) {}
    try{
        updateInfo(temp);
    }
    catch (e) {
        console.log("info pack wrong");
    }
};

function storeTodroneMap(temp){
    var droneid = temp["droneid"];
    if (temp["type"] == "location"){
        console.log(droneMap.get(droneid));
        if (droneMap.get(droneid)["latitude"] == "NULL")
            droneMap.get(droneid)["latitude"] = temp["latitude"];
        else{
            var difference = droneMap.get(droneid)["latitude"]-temp["latitude"];
            if (Math.abs(difference)<= 1)
                droneMap.get(droneid)["latitude"] = temp["latitude"];
            else
                document.querySelector('#telemetry-log').value += "error in latitude.\n";
        }
        if (droneMap.get(droneid)["longitude"] == "NULL")
            droneMap.get(droneid)["longitude"] = temp["longitude"];
        else{
            var difference = droneMap.get(droneid)["longitude"] - temp["longitude"];
            if (Math.abs(difference) < 1)
                droneMap.get(droneid)["longitude"] = temp["longitude"];
            else
                document.querySelector('#telemetry-log').value += "error in longitude.\n";
        }
        droneMap.get(droneid)["altitude"]= temp["altitude"];
        droneMap.get(droneid)["geojson"]["coordinates"] = [droneMap.get(droneid)["longitude"], droneMap.get(droneid)["latitude"]];
    }
    if (temp["type"] == "altitude") {
        droneMap.get(droneid)["yaw"] = temp["yaw"];
        droneMap.get(droneid)["row"] = temp["row"];
        droneMap.get(droneid)["pitch"] = temp["pitch"];
    }


}

function newJSON(droneid){ // update geojson by using obj["geojson"]["coordinates"] = [long, lat]
    return {"droneid":droneid,
        "longitude":"NULL",
        "latitude":"NULL",
        "yaw":"NULL",
        "pitch":"NULL",
        "roll":"NULL",
        "speed":"NULL",
        "geojson":{
        "type": "Feature",
            "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": ["NULL","NULL"]
        }
    }
    };
}
function updateInfo(infopack) {
    try {
        updateLocations(infopack['altitude'], infopack['longitude'], infopack['latitude']);

    }
    catch (e) {
        console.log("update location!")
    }

    try{
        updateTel(infopack['yaw'], infopack['roll'], infopack['pitch'])
    }
    catch (e) {
        console.log("update tel!")
    }

  // $("#altitude").text(infopack['altitude']);
  // $("#groundspeed").text(infopack['groundspeed']);
  // $("#Roll").text(infopack['roll']);
  // $("#Yaw").text(infopack['yaw']);
  // $("#DistoDest").text(infopack['DistoDest']);
  // $("#Pitch").text(infopack['pitch']);
  // $("#Longitude").text(infopack['longitude']);
  // $("#Latitude").text(infopack['latitude']);

  // console.log("www");
}
function updateLocations(al, long, lat){
    $("#altitude").text(al);
    $("#longitude").text(long);
    $("#latitude").text(lat);
    // console.log(long);

}
function updateTel(yaw, roll, pit){
    $("#Yaw").text(yaw);
    $("#Roll").text(roll);
    $("#Pitch").text(pit);
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