
// mavlink definitions: adrupilotmega.xml

  const mavlink20_COPTER_MODE = {
    COPTER_MODE_STABILIZE: 0,
    COPTER_MODE_ACRO: 1,
    COPTER_MODE_ALT_HOLD: 2,
    COPTER_MODE_AUTO: 3,
    COPTER_MODE_GUIDED: 4,
    COPTER_MODE_LOITER: 5,
    COPTER_MODE_RTL: 6,
    COPTER_MODE_CIRCLE: 7,
    COPTER_MODE_LAND: 9,
    COPTER_MODE_DRIFT: 11,
    COPTER_MODE_SPORT: 13,
    COPTER_MODE_FLIP: 14,
    COPTER_MODE_AUTOTUNE: 15,
    COPTER_MODE_POSHOLD: 16,
    COPTER_MODE_BRAKE: 17,
    COPTER_MODE_THROW: 18,
    COPTER_MODE_AVOID_ADSB: 19,
    COPTER_MODE_GUIDED_NOGPS: 20,
    COPTER_MODE_SMART_RTL: 21,
    COPTER_MODE_FLOWHOLD: 22,
    COPTER_MODE_FOLLOW: 23,
    COPTER_MODE_ZIGZAG: 24,
    COPTER_MODE_SYSTEMID: 25,
    COPTER_MODE_AUTOROTATE: 26,
    COPTER_MODE_AUTO_RTL: 27
  };
  
  function findModeFromNumber(inputNumber) {
    for (const mode in mavlink20_COPTER_MODE) {
      if (mavlink20_COPTER_MODE[mode] === inputNumber) {
        return mode;
      }
    }
    return "Mode not found";
  }
  
  // Example usage
  // const inputNumber = 23;
  // const mode = findModeFromNumber(inputNumber);
  // console.log(`Mode for input number ${inputNumber}: ${mode}`);
  
  

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
        m_drone_id=webDroneObject.port_to_connect_int;
        m_array_of_webdrone_object_droneids.push(m_drone_id);
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
    console.log('m_WebDrone.has_marker=',m_WebDrone.has_marker);
    if(m_WebDrone.has_marker==false){ // add marker to map, and it is property of webdrone object also. When marker is updated, map updates...???
        // later write code to remove marker if drone is disconnected or whatever (cleanup, maybe on disconnect...)
        // create a marker now
        console.log('m_WebDrone.has_marker==false')
        var el = document.createElement('div');
        el.className = 'marker';
        let feature = droneLocationGeoJson; // mapbox calls it feature
        m_WebDrone.marker=new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
        console.log('added marker: ',m_WebDrone.marker);
        m_WebDrone.has_marker = true;
        console.log('just set true, fact check: m_WebDrone.has_marker=',m_WebDrone.has_marker);
    }
    if(m_WebDrone.has_marker==null){ // add marker to map, and it is property of webdrone object also. When marker is updated, map updates...???
        // later write code to remove marker if drone is disconnected or whatever (cleanup, maybe on disconnect...)
        // create a marker now
        console.log('m_WebDrone.has_marker==false')
        var el = document.createElement('div');
        el.className = 'marker';
        let feature = droneLocationGeoJson; // mapbox calls it feature
        m_WebDrone.marker=new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
        console.log('added marker: ',m_WebDrone.marker);
        m_WebDrone.has_marker = true;
        console.log('just set true, fact check: m_WebDrone.has_marker=',m_WebDrone.has_marker);
    }


    setTimeout(function() {
        console.log("One second later");
        console.log('[VECHICLE CONNECT LOG] Finished, with m_WebDrone = ',m_WebDrone);
    
      }, 1000);
    


}




function disconnectVehicle() {
    // psuedo code:
    // 1.) create websocket message: disconnect + 14550 (JSON)
    // 2.) send websocket message.
    // TO DO: Check if it's in list of connnected already.
    // 3.) Mark as disconned in webdrone object
    // 4.) Delete mapbox marker so icon goes away.
    var port_to_disconnect_text = document.getElementById("disVID").value;
    var port_to_disconnect_int = port_to_disconnect_text;
    let m_WebDrone_object_to_disconnect = window.m_Array_of_WebDrone_objects.find(item => item['droneID'] === port_to_disconnect_int); // webdrone object to disconnect
    const jsonObject = {
        command: 'DISCONNECT',
        droneid: port_to_disconnect_int
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // console.log(' m_WebDrone_object_to_disconnect:', m_WebDrone_object_to_disconnect);

    // 2.) send websocket message.
    // send message to websocket
    doSend(messagetosend);
    
    // 3.) Mark as disconned in webdrone object
    m_WebDrone_object_to_disconnect.is_connected = false;

    // 4.) Remove mapbox marker so icon goes away. It might still exist in webdrone object but it will be removed.
    // console.log('going to remove: ',m_WebDrone_object_to_disconnect.marker)
    // console.log('from: ',m_WebDrone_object_to_disconnect)
    console.log('m_WebDrone_object_to_disconnect.has_marker=',m_WebDrone_object_to_disconnect.has_marker);
    m_WebDrone_object_to_disconnect.marker.remove();
    console.log('m_WebDrone_object_to_disconnect: ',m_WebDrone_object_to_disconnect)

}

function armVehicle() {
    alert("armVehicle in vehicle_control.js called !");
}

function disarmVehicle() {
    alert("disarmVehicle in vehicle_control.js called !");
}

function RTLVehicle() {
    alert("RTLVehicle in vehicle_control.js called !");
}

function LANDVehicle() {
    alert("LANDVehicle in vehicle_control.js called !");
}

function TAKEOFFVehicle() {
    alert("TAKEOFFVehicle in vehicle_control.js called !");
}


function setmodeVehicle() {
    alert("setmodeVehicle in vehicle_control.js called !");
   // psuedo code:
    // 1.) create websocket message: set mode + 14550 (JSON)
    // 2.) send websocket message. // for now no response requested ???
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int = port_to_connect_text;

    var IP_to_connect_text = document.getElementById("DRONE_IP").value;

    let mode_to_set = 123;
    //var messagetosend = 'CONNECT' + port_to_connect_int;
    const jsonObject = {
        command: 'SETMODE',
        DRONE_IP: IP_to_connect_text,
        DRONE_PORT: port_to_connect_int,
        MODE: mode_to_set
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);
}
