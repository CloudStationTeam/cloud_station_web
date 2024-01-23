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

// Define the mode constants
const PLANE_MODE_mavlink20 = {
    PLANE_MODE_MANUAL: 0,
    PLANE_MODE_CIRCLE: 1,
    PLANE_MODE_STABILIZE: 2,
    PLANE_MODE_TRAINING: 3,
    PLANE_MODE_ACRO: 4,
    PLANE_MODE_FLY_BY_WIRE_A: 5,
    PLANE_MODE_FLY_BY_WIRE_B: 6,
    PLANE_MODE_CRUISE: 7,
    PLANE_MODE_AUTOTUNE: 8,
    PLANE_MODE_AUTO: 10,
    PLANE_MODE_RTL: 11,
    PLANE_MODE_LOITER: 12,
    PLANE_MODE_TAKEOFF: 13,
    PLANE_MODE_AVOID_ADSB: 14,
    PLANE_MODE_GUIDED: 15,
    PLANE_MODE_INITIALIZING: 16,
    PLANE_MODE_QSTABILIZE: 17,
    PLANE_MODE_QHOVER: 18,
    PLANE_MODE_QLOITER: 19,
    PLANE_MODE_QLAND: 20,
    PLANE_MODE_QRTL: 21,
    PLANE_MODE_QAUTOTUNE: 22,
    PLANE_MODE_QACRO: 23,
    PLANE_MODE_THERMAL: 24,
    PLANE_MODE_ENUM_END: 25,
};

// Define the rover mode constants
const ROVER_MODE_mavlink20 = {
    ROVER_MODE_MANUAL: 0,
    ROVER_MODE_ACRO: 1,
    ROVER_MODE_STEERING: 3,
    ROVER_MODE_HOLD: 4,
    ROVER_MODE_LOITER: 5,
    ROVER_MODE_FOLLOW: 6,
    ROVER_MODE_SIMPLE: 7,
    ROVER_MODE_AUTO: 10,
    ROVER_MODE_RTL: 11,
    ROVER_MODE_SMART_RTL: 12,
    ROVER_MODE_GUIDED: 15,
    ROVER_MODE_INITIALIZING: 16,
    ROVER_MODE_ENUM_END: 17,
  };


  const MAV_TYPE_mavlink20 = {
    MAV_TYPE_GENERIC: 0,
    MAV_TYPE_FIXED_WING: 1,
    MAV_TYPE_QUADROTOR: 2,
    MAV_TYPE_COAXIAL: 3,
    MAV_TYPE_HELICOPTER: 4,
    MAV_TYPE_ANTENNA_TRACKER: 5,
    MAV_TYPE_GCS: 6,
    MAV_TYPE_AIRSHIP: 7,
    MAV_TYPE_FREE_BALLOON: 8,
    MAV_TYPE_ROCKET: 9,
    MAV_TYPE_GROUND_ROVER: 10,
    MAV_TYPE_SURFACE_BOAT: 11,
    MAV_TYPE_SUBMARINE: 12,
    MAV_TYPE_HEXAROTOR: 13,
    MAV_TYPE_OCTOROTOR: 14,
    MAV_TYPE_TRICOPTER: 15,
    MAV_TYPE_FLAPPING_WING: 16,
    MAV_TYPE_KITE: 17,
    MAV_TYPE_ONBOARD_CONTROLLER: 18,
    MAV_TYPE_VTOL_TAILSITTER_DUOROTOR: 19,
    MAV_TYPE_VTOL_TAILSITTER_QUADROTOR: 20,
    MAV_TYPE_VTOL_TILTROTOR: 21,
    MAV_TYPE_VTOL_FIXEDROTOR: 22,
    MAV_TYPE_VTOL_TAILSITTER: 23,
    MAV_TYPE_VTOL_TILTWING: 24,
    MAV_TYPE_VTOL_RESERVED5: 25,
    MAV_TYPE_GIMBAL: 26,
    MAV_TYPE_ADSB: 27,
    MAV_TYPE_PARAFOIL: 28,
    MAV_TYPE_DODECAROTOR: 29,
    MAV_TYPE_CAMERA: 30,
    MAV_TYPE_CHARGING_STATION: 31,
    MAV_TYPE_FLARM: 32,
    MAV_TYPE_SERVO: 33,
    MAV_TYPE_ODID: 34,
    MAV_TYPE_DECAROTOR: 35,
    MAV_TYPE_BATTERY: 36,
    MAV_TYPE_PARACHUTE: 37,
    MAV_TYPE_LOG: 38,
    MAV_TYPE_OSD: 39,
    MAV_TYPE_IMU: 40,
    MAV_TYPE_GPS: 41,
    MAV_TYPE_WINCH: 42,
    MAV_TYPE_GENERIC_MULTIROTOR: 43,
    MAV_TYPE_ENUM_END: 44
  };
  
  function findMAV_TYPEFromNumber(inputNumber) {
    for (const type in MAV_TYPE_mavlink20) {
      if (MAV_TYPE_mavlink20[type] === inputNumber) {
        return type;
      }
    }
    return "Type not found";
  }
  

  

function findCopterModeFromNumber(inputNumber) {
    for (const mode in mavlink20_COPTER_MODE) {
        if (mavlink20_COPTER_MODE[mode] === inputNumber) {
            return mode;
        }
    }
    return "Mode not found";
}
function findPlaneModeFromNumber(inputNumber) {
    for (const mode in PLANE_MODE_mavlink20) {
        if (PLANE_MODE_mavlink20[mode] === inputNumber) {
            return mode;
        }
    }
    return "Mode not found";
}
function findRoverModeFromNumber(inputNumber) {
    for (const mode in ROVER_MODE_mavlink20) {
        if (ROVER_MODE_mavlink20[mode] === inputNumber) {
            return mode;
        }
    }
    return "Mode not found";
}




function isArmed(baseMode) {
    // Check if the Most Significant Bit (MSB) is set (1) or unset (0)
    const arm_status = (baseMode & 0b10000000) !== 0;
    return arm_status;
  }
  

  

// helper functions:

function get_list_of_existing_droneids() {
    const instancesOfWebDroneClass = enumerateInstances(WebDrone);
    console.log('list of WebDrone objects in java ' + instancesOfWebDroneClass);
    return instancesOfWebDroneClass
}

function get_webdrone_object_from_droneid(m_droneid_to_get) {
    // returns array of webdrone objects
    let m_array_of_webdrone_object_droneids;

    for (let webDroneObject of window.m_Array_of_WebDrone_objects) {
        // 'webDroneObject' will be the current object
        // console.log('Object:', webDroneObject);
        m_drone_id = webDroneObject.droneid;
        if (m_droneid_to_get==m_drone_id){
            return webDroneObject;
        }
    }
    return null;
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
        m_drone_id = webDroneObject.droneid;
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
    for (let webDroneObject of window.m_Array_of_WebDrone_objects) { // iterate over window.m_Array_of_WebDrone_objects which contains extant webDroneObjects
        // 'webDroneObject' will be the current object
        // console.log('Object:', webDroneObject);
        m_drone_id = webDroneObject.droneID;
        m_array_of_webdrone_object_droneids.push(m_drone_id);
    } // now we have created array of existing droneids
    if (m_array_of_webdrone_object_droneids.includes(port_to_connect_int)) { // if the drone we are trying to conenct to exists as an object already
        console.log('The drone we are trying to conenct to exists as a webdrone object already, as...');
        is_DRONE_PORT_in_webdrone_objects = true; // assume no
        // xxx add the marker back to the map if it already exists
        m_webdrone_object_to_add_marker=get_webdrone_object_from_droneid(port_to_connect_int);
        console.log(' it is....', m_webdrone_object_to_add_marker);
        m_webdrone_object_to_add_marker.marker.setLngLat(feature.geometry.coordinates).addTo(map);
    }
    if (!is_DRONE_PORT_in_webdrone_objects) { // create now WebDrone object and populate it's known fields
        console.log('The drone we are trying to conenct does not exist as a webdrone object. Creating.....');
        m_WebDrone = new WebDrone(port_to_connect_int);
        // we just created it, give it a marker and put it on the map....
        var el = document.createElement('div');
        el.className = 'marker';
        let feature = droneLocationGeoJson; // mapbox calls it feature
        m_WebDrone.marker = new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
        console.log('added marker: ', m_WebDrone.marker);
        console.log("Created new webdrone object: ", m_WebDrone);
        window.m_Array_of_WebDrone_objects.push(m_WebDrone); // add to global set of WebDrone objects
        currSelectedDroneId = m_WebDrone.port_to_connect_int; // for now CS 4.0 until we got many drones, most recent connected drone is current drone id

    }



    setTimeout(function () {
        console.log("One second later");
        console.log('[VECHICLE CONNECT LOG] Finished, with m_WebDrone = ', m_WebDrone);

    }, 1000);



}




function disconnectVehicle() {
    // psuedo code:
    // 1.) create websocket message: disconnect + 14550 (JSON)
    // 2.) send websocket message.
    // TO DO: Check if it's in list of connnected already.
    // 3.) Mark as disconned in webdrone object
    // 4.) Remove mapbox marker from map ... xxx.
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
    console.log('m_WebDrone_object_to_disconnect.has_marker=', m_WebDrone_object_to_disconnect.has_marker);
    m_WebDrone_object_to_disconnect.marker.remove();
    console.log('m_WebDrone_object_to_disconnect: ', m_WebDrone_object_to_disconnect)

}

function armVehicle() {
    // alert("armVehicle in vehicle_control.js called !");
    // psuedo code:
    // 1.) create websocket message: set mode + 14550 (JSON)
    // 2.) send websocket message. // for now no response requested ???
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int = port_to_connect_text;

    var IP_to_connect_text = document.getElementById("DRONE_IP").value;

    // mode_to_set = "GUIDED";
    //var messagetosend = 'CONNECT' + port_to_connect_int;
    const jsonObject = {
        command: 'ARM',
        DRONE_IP: IP_to_connect_text,
        DRONE_PORT: port_to_connect_int,
        MODE: 999 // not used
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);
}

function disarmVehicle() {
    // alert("disarmVehicle in vehicle_control.js called !");

    // psuedo code:
    // 1.) create websocket message: set mode + 14550 (JSON)
    // 2.) send websocket message. // for now no response requested ???
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int = port_to_connect_text;

    var IP_to_connect_text = document.getElementById("DRONE_IP").value;

    // mode_to_set = "GUIDED";
    //var messagetosend = 'CONNECT' + port_to_connect_int;
    const jsonObject = {
        command: 'DISARM',
        DRONE_IP: IP_to_connect_text,
        DRONE_PORT: port_to_connect_int,
        MODE: 999 // not used
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);
}


function TAKEOFFVehicle() {
    // alert("TAKEOFFVehicle in vehicle_control.js called !");
    var enteredNumber = document.getElementById('numberInput').value;
    //alert('Takeoff with Number: ' + enteredNumber);
    // Perform additional actions with the enteredNumber here
    $('#numberModal').modal('hide'); // Close the modal

    takeoff_altitude=enteredNumber
    // psuedo code:
    // 1.) create websocket message: set mode + 14550 (JSON)
    // 2.) send websocket message. // for now no response requested ???
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int = port_to_connect_text;

    var IP_to_connect_text = document.getElementById("DRONE_IP").value;

    // mode_to_set = "GUIDED";
    //var messagetosend = 'CONNECT' + port_to_connect_int;
    const jsonObject = {
        command: 'TAKEOFF',
        DRONE_IP: IP_to_connect_text,
        DRONE_PORT: port_to_connect_int,
        MODE: takeoff_altitude 
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);

}

function FlyVehicleTo(destination_lat,destination_lon,destination_alt) {
    // psuedo code:
    // 1.) create websocket message: set mode + 14550 (JSON)
    // 2.) send websocket message. // for now no response requested ???
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int = port_to_connect_text;
    var IP_to_connect_text = document.getElementById("DRONE_IP").value;

    //var messagetosend = 'CONNECT' + port_to_connect_int;
    const jsonObject = {
        command: 'FLYTO',
        DRONE_IP: IP_to_connect_text,
        DRONE_PORT: port_to_connect_int,
        MODE: 4, // guided
        LAT_DEST:destination_lat,
        LON_DEST:destination_lon,
        ALT_DEST:destination_alt,
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);

}


function takeoff() {
    var enteredNumber = document.getElementById('numberInput').value;
    alert('Takeoff with Number: ' + enteredNumber);
    // Perform additional actions with the enteredNumber here
    $('#numberModal').modal('hide'); // Close the modal
  }

  // Function to handle cancel
  function cancel() {
    $('#numberModal').modal('hide'); // Close the modal
  }




function setmodeVehicle(mode_to_set_int) { 
    // alert("setmodeVehicle in vehicle_control.js called !");
    // psuedo code:
    // 1.) create websocket message: set mode + 14550 (JSON)
    // 2.) send websocket message. // for now no response requested ???
    var port_to_connect_text = document.getElementById("DRONE_PORT").value;
    var port_to_connect_int = port_to_connect_text;

    var IP_to_connect_text = document.getElementById("DRONE_IP").value;

    // mode_to_set = "GUIDED";
    //var messagetosend = 'CONNECT' + port_to_connect_int;
    const jsonObject = {
        command: 'SETMODE',
        DRONE_IP: IP_to_connect_text,
        DRONE_PORT: port_to_connect_int,
        MODE: mode_to_set_int
    };
    const messagetosend = JSON.stringify(jsonObject);
    console.log(' messagetosend:', messagetosend);
    // send message to websocket
    doSend(messagetosend);
}
