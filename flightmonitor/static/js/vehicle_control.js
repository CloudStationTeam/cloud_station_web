
// helper functions:

function get_list_of_existing_droneids() {
    const instancesOfWebDroneClass = enumerateInstances(WebDrone);
    console.log('list of WebDrone objects in java ' + instancesOfWebDroneClass);
    return instancesOfWebDroneClass
}

// Function to enumerate instances of a class
function enumerateInstances(className) {
    const instances = [];
    for (const key in window) {
        if (window[key] instanceof className) {
            instances.push(window[key]);
        }
    }
    return instances;
}


function get_array_of_webdrone_objects() {
    // returns array of webdrone objects
    return window.m_Array_of_WebDrone_objects;
}

function get_array_of_webdrone_object_droneids() {
    // returns array of webdrone objects
    let m_array_of_webdrone_object_droneids;

    for (let webDroneObject of window.m_Array_of_WebDrone_objects) {
        // 'webDroneObject' will be the current object
        console.log('Object:', webDroneObject);
        m_drone_id=webDroneObject.droneid;
        m_array_of_webdrone_object_droneids.push(m_drone_id);

    return m_array_of_webdrone_object_droneids;

}


}

// connect/disconnect functions

function connectVehicle_by_IP_and_PORT() {
    // psuedo code:
    // 1.) create websocket message: connect + IP:PORT
    // 2.) send websocket message.
    // 3.) await websocket response
    // 4.) create instance in browser of webdrone class with port if it doesn't already exist
    // 5.) Handle mapbox icon
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int = port_to_connect_text;

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

    // we sent the message via websocket to connect, but we have no idea if it connected yet...
    //  with heartbeat we can toggle a connected flag in the object


    // 4.) create instance in browser of webdrone class with port if it doesn't already exist
    // but don't flag it as connected yet, until a heartbeat is received.
    // Need to change to add check if mavlink connection worked 
    let is_DRONE_PORT_in_webdrone_objects = false; // assume no
    let m_array_of_webdrone_object_droneids = [];
    for (let webDroneObject of window.m_Array_of_WebDrone_objects) {
        // 'webDroneObject' will be the current object
        console.log('Object:', webDroneObject);
        m_drone_id=webDroneObject.port_to_connect_int
        m_array_of_webdrone_object_droneids.push(m_drone_id)
    }
    if (m_array_of_webdrone_object_droneids.includes(port_to_connect_int)) {
        console.log('Item is in the array.');
        is_DRONE_PORT_in_webdrone_objects= true; // assume no
    }
    if(!is_DRONE_PORT_in_webdrone_objects){ // create now WebDrone object and populate it's known fields
        m_WebDrone = new WebDrone(port_to_connect_int);
        console.log("new webdrone object: ", m_WebDrone);
        window.m_Array_of_WebDrone_objects.push(m_WebDrone);
    }

    // 5.) Handle mapbox icon.
    // We now have a drone object: m_WebDrone
    if(m_WebDrone.marker==null){ // add marker to map, and it is property of webdrone object also. When marker is updated, map updates...???
        // later write code to remove marker if drone is disconnected or whatever (cleanup, maybe on disconnect...)
        // create a marker now
        var el = document.createElement('div');
        el.className = 'marker';
        let feature = droneLocationGeoJson; // mapbox calls it feature
        m_WebDrone.marker=new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
    }


}


function disconnectVehicle() {
    // psuedo code:
    // 1.) create websocket message: disconnect + 14550 (JSON)
    // 2.) send websocket message.
    // TO DO: Check if it's in list of connnected already.
    var port_to_disconnect_text = document.getElementById("disVID").value;
    var port_to_disconnect_int = port_to_disconnect_text;
    const jsonObject = {
        command: 'DISCONNECT',
        droneid: port_to_disconnect_int
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);
}
