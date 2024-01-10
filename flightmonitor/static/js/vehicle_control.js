

function connectVehicle_by_IP_and_PORT() {
    // psuedo code:
    // 1.) create websocket message: connect + IP:PORT
    // 2.) send websocket message.
    // 3.) await websocket response
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int=port_to_connect_text;

    var IP_to_connect_text = document.getElementById("DRONE_IP").value;
    
    //var messagetosend = 'CONNECT' + port_to_connect_int;
    const jsonObject = {
    command: 'CONNECT_BY_IP_AND_PORT',
    DRONE_IP: IP_to_connect_text,
    DRONE_PORT: port_to_connect_int
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);
}


function disconnectVehicle() {
    // psuedo code:
    // 1.) create websocket message: disconnect + 14550 (JSON)
    // 2.) send websocket message.
    // TO DO: Check if it's in list of connnected already.
    var port_to_disconnect_text = document.getElementById("disVID").value;
    var port_to_disconnect_int=port_to_disconnect_text;
    const jsonObject = {
    command: 'DISCONNECT',
    droneid: port_to_disconnect_int
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);
}

