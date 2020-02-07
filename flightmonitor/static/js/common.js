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
                "properties": {"Name":temp["droneid"]
                },
              "geometry": {
                "type": "Point",
                "coordinates": ["NULL","NULL"]
            },
            },"markerTraker":null,
            "markerPopup":null
        };
        droneMap.set(temp["droneid"],tempInfo);
        storeTodroneMap(temp);
        //add new drone to the map
        //create html element for the new marker
        marker = droneMap.get(temp["droneid"]).geojson;
        var el = document.createElement('div');
        el.className = 'marker';
        droneMap.get(temp["droneid"]).markerPopup = new mapboxgl.Popup({ offset: 25 });
        droneMap.get(temp["droneid"]).markerTraker = new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .setPopup(droneMap.get(temp["droneid"]).markerPopup
                .setHTML('<h3>' + marker.properties.Name + "</h3><p>"+ "Longitude: " + marker.coordinates[0] + " Latitude: " + marker.coordinates[1]+ "</p>")
            )
            .addTo(map);
        var dytable = document.getElementById("dyTable");
        var row = dytable.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = "ID: " + temp["droneid"];
        addTab(temp["droneid"]); // add a new tab
        }
    else{
        storeTodroneMap(temp);
        marker = droneMap.get(temp["droneid"]).geojson;
        droneMap.get(temp["droneid"]).markerPopup.setHTML('<h3>' + marker.properties.Name + "</h3><p>"+ "Longitude: " + marker.coordinates[0] + " Latitude: " + marker.coordinates[1]+ "</p>");
        // droneMap.get(temp["droneid"]).markerTraker.setLngLat(marker.coordinates).setPopup(new mapboxgl.Popup({ offset: 25 })
        //         .setHTML('<h3>' + marker.properties.Name + "</h3><p>"+ "Longitude: " + marker.coordinates[0] + " Latitude: " + marker.coordinates[1]+ "</p>")
        //     );
        //update the map location
    }


    try{
        updateDroneLoactionGeoJson(droneMap.get(temp["droneid"])["geojson"]["coordinates"]);
    }
    catch(e) {}
    try{
        // console.log(droneMap.get(temp["droneid"]))
        updateInfo(droneMap.get(temp["droneid"]),temp["droneid"]);
    }
    catch (e) {
        console.log("info pack wrong");
    }
};

function storeTodroneMap(temp){
    var droneid = temp["droneid"];
    if (temp["type"] == "location"){
        // console.log(droneMap.get(droneid));
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
        droneMap.get(droneid)["roll"] = temp["roll"];
        droneMap.get(droneid)["pitch"] = temp["pitch"];
    }


}

// function newJSON(droneid){ // update geojson by using obj["geojson"]["coordinates"] = [long, lat]
//     return {"droneid":droneid,
//         "longitude":"NULL",
//         "latitude":"NULL",
//         "yaw":"NULL",
//         "pitch":"NULL",
//         "roll":"NULL",
//         "speed":"NULL",
//         "geojson":{
//         "type": "Feature",
//             "properties": {},
//           "geometry": {
//             "type": "Point",
//             "coordinates": ["NULL","NULL"]
//         }
//     }
//     };
// }

function updateInfo(infopack, droneID) {
    // console.log(infopack);
    try {
        updateLocations(infopack['altitude'], infopack['longitude'], infopack['latitude'], droneID);

    }
    catch (e) {
        console.log("update location!")
    }

    try{
        updateTel(infopack['yaw'], infopack['roll'], infopack['pitch'], droneID)
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


