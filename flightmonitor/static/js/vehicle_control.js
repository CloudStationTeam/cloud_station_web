function connectVehicle() {
    // psuedo code:
    // 1.) create websocket message: connect + 14550
    // 2.) send websocket message.
    // 3.) await websocket response
    var port_to_connect_text = document.getElementById("vehicleID").value;
    var port_to_connect_int=port_to_connect_text;
    var messagetosend = 'CONNECT' + port_to_connect_int;
    // send message to websocket
    doSend(messagetosend);
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